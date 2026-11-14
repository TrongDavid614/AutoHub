package com.autohub.modules.tracking.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.entity.NhatKyHanhVi;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.core.user.repository.NhatKyHanhViRepository;
import com.autohub.modules.tracking.dto.TrackingEventRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final NhatKyHanhViRepository nhatKyHanhViRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/collect")
    public ResponseEntity<ApiResponse<String>> collectEvent(@Valid @RequestBody TrackingEventRequest req) {
        try {
            // Chuẩn hóa & đảm bảo dữ liệu bổ sung luôn là JSON hợp lệ (thỏa mãn CK_nkhv_json trong SQL Server)
            String sanitizedJson = sanitizeJsonPayload(req.getDuLieuBoSung());

            NhatKyHanhVi nhatKy = NhatKyHanhVi.builder()
                    .maPhien(req.getMaPhien())
                    .loaiHanhVi(req.getLoaiHanhVi())
                    .loaiThucThe(req.getLoaiThucThe())
                    .maThucThe(req.getMaThucThe())
                    .thoiGianDungXem(req.getThoiGianDungXem() != null ? Math.max(0, req.getThoiGianDungXem()) : 0)
                    .duLieuBoSung(sanitizedJson)
                    .build();

            // Nếu request có truyền ID người dùng
            if (req.getNguoiDungId() != null) {
                nguoiDungRepository.findById(req.getNguoiDungId()).ifPresent(nhatKy::setNguoiDung);
            } else {
                // Tự động liên kết người dùng nếu đang đăng nhập qua JWT
                resolveAuthenticatedUser().ifPresent(nhatKy::setNguoiDung);
            }

            nhatKyHanhViRepository.save(nhatKy);
            return ResponseEntity.ok(ApiResponse.ok("RECORDED", "Ghi nhận sự kiện hành vi thành công"));
        } catch (Exception e) {
            log.warn("[Tracking] Lỗi ghi nhận telemetry hành vi: {}", e.getMessage());
            // Trả về 200 OK với cờ SKIPPED để không làm gián đoạn trải nghiệm người dùng
            return ResponseEntity.ok(ApiResponse.ok("SKIPPED", "Bỏ qua sự kiện telemetry không hợp lệ"));
        }
    }

    private Optional<NguoiDung> resolveAuthenticatedUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                return nguoiDungRepository.findByEmail(auth.getName());
            }
        } catch (Exception ignored) {}
        return Optional.empty();
    }

    private String sanitizeJsonPayload(String raw) {
        if (raw == null || raw.trim().isBlank()) {
            return null;
        }
        String trimmed = raw.trim();
        try {
            // Kiểm tra xem chuỗi có phải JSON hợp lệ không
            objectMapper.readTree(trimmed);
            return trimmed;
        } catch (Exception e) {
            // Nếu không phải JSON, bọc lại thành JSON an toàn
            try {
                return objectMapper.writeValueAsString(Map.of("raw", trimmed));
            } catch (Exception ignored) {
                return null;
            }
        }
    }
}
