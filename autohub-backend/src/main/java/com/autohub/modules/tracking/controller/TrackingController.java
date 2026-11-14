package com.autohub.modules.tracking.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.entity.NhatKyHanhVi;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.core.user.repository.NhatKyHanhViRepository;
import com.autohub.modules.tracking.dto.TrackingEventRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final NhatKyHanhViRepository trackingRepository;
    private final NguoiDungRepository userRepository;

    @PostMapping("/collect")
    public ResponseEntity<ApiResponse<Long>> collectEvent(@Valid @RequestBody TrackingEventRequest req) {
        NguoiDung user = null;
        if (req.getNguoiDungId() != null) {
            user = userRepository.findById(req.getNguoiDungId()).orElse(null);
        }

        NhatKyHanhVi event = NhatKyHanhVi.builder()
                .nguoiDung(user)
                .maPhien(req.getMaPhien() != null ? req.getMaPhien() : "ANONYMOUS_SESSION")
                .loaiHanhVi(req.getLoaiHanhVi())
                .loaiThucThe(req.getLoaiThucThe() != null ? req.getLoaiThucThe() : "CAR")
                .maThucThe(req.getMaThucThe())
                .thoiGianDungXem(req.getThoiGianDungXem() != null ? req.getThoiGianDungXem() : 0)
                .duLieuBoSung(req.getDuLieuBoSung())
                .thoiGianTao(LocalDateTime.now())
                .build();

        NhatKyHanhVi saved = trackingRepository.save(event);
        log.debug("Đã ghi nhận sự kiện tracking: id={}, hành vi={}", saved.getId(), saved.getLoaiHanhVi());

        return ResponseEntity.ok(ApiResponse.ok(saved.getId(), "Ghi nhận sự kiện hành vi thành công"));
    }
}
