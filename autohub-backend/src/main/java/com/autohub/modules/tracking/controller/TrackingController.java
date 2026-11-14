package com.autohub.modules.tracking.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.user.entity.NhatKyHanhVi;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.core.user.repository.NhatKyHanhViRepository;
import com.autohub.modules.tracking.dto.TrackingEventRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final NhatKyHanhViRepository nhatKyHanhViRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @PostMapping("/collect")
    public ResponseEntity<ApiResponse<String>> collectEvent(@Valid @RequestBody TrackingEventRequest req) {
        try {
            NhatKyHanhVi nhatKy = NhatKyHanhVi.builder()
                    .maPhien(req.getMaPhien())
                    .loaiHanhVi(req.getLoaiHanhVi())
                    .loaiThucThe(req.getLoaiThucThe())
                    .maThucThe(req.getMaThucThe())
                    .thoiGianDungXem(req.getThoiGianDungXem() != null ? req.getThoiGianDungXem() : 0)
                    .duLieuBoSung(req.getDuLieuBoSung())
                    .build();

            if (req.getNguoiDungId() != null) {
                nguoiDungRepository.findById(req.getNguoiDungId()).ifPresent(nhatKy::setNguoiDung);
            }

            nhatKyHanhViRepository.save(nhatKy);
            return ResponseEntity.ok(ApiResponse.ok("RECORDED", "Ghi nhận sự kiện hành vi thành công"));
        } catch (Exception e) {
            log.error("[Tracking] Lỗi khi ghi nhận hành vi: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.ok("SKIPPED", "Bỏ qua sự kiện không hợp lệ"));
        }
    }
}
