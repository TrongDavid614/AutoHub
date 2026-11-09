package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import com.autohub.core.showroom.repository.ShowroomRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/customer/engagement")
@RequiredArgsConstructor
public class CustomerEngagementController {

    private final LichHenLaiThuRepository lichHenLaiThuRepository;
    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final PhienBanXeRepository phienBanXeRepository;
    private final ShowroomRepository showroomRepository;

    @GetMapping("/test-drives")
    public ResponseEntity<ApiResponse<List<LichHenLaiThu>>> getMyTestDrives(@RequestParam(required = false) Long customerId) {
        List<LichHenLaiThu> list = (customerId != null)
                ? lichHenLaiThuRepository.findByNguoiDungId(customerId)
                : lichHenLaiThuRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(list, "Lấy danh sách lịch hẹn lái thử thành công"));
    }

    @PostMapping("/test-drives")
    public ResponseEntity<ApiResponse<LichHenLaiThu>> bookTestDrive(@RequestBody LichHenLaiThu request) {
        // Kiểm tra cam kết bằng lái xe GPLX
        if (!Boolean.TRUE.equals(request.getCamKetGplx())) {
            throw new IllegalArgumentException("Khách hàng bắt buộc phải cam kết có Giấy phép lái xe (GPLX) còn hiệu lực");
        }

        if (request.getNgayTao() == null) {
            request.setNgayTao(LocalDateTime.now());
        }

        // Kiểm tra hẹn trước tối thiểu 24h
        if (request.getThoiGianHen() == null || request.getThoiGianHen().isBefore(request.getNgayTao().plusHours(24))) {
            request.setThoiGianHen(request.getNgayTao().plusHours(25)); // Tự động tối thiểu 25h
        }

        if (request.getTrangThai() == null) {
            request.setTrangThai(TrangThaiLichHen.PENDING);
        }

        if (request.getThoiLuongPhut() == null) {
            request.setThoiLuongPhut(60);
        }

        if (request.getNguoiDung() == null && request.getHoTenKhach() != null) {
            NguoiDung defaultUser = nguoiDungRepository.findAll().stream().findFirst().orElse(null);
            request.setNguoiDung(defaultUser);
        }

        LichHenLaiThu saved = lichHenLaiThuRepository.save(request);
        return ResponseEntity.ok(ApiResponse.ok(saved, "Đặt lịch hẹn lái thử thành công"));
    }

    @GetMapping("/consultations")
    public ResponseEntity<ApiResponse<List<YeuCauTuVan>>> getMyConsultations() {
        return ResponseEntity.ok(ApiResponse.ok(yeuCauTuVanRepository.findAll(), "Lấy danh sách yêu cầu tư vấn thành công"));
    }

    @PostMapping("/consultations")
    public ResponseEntity<ApiResponse<YeuCauTuVan>> submitConsultation(@RequestBody YeuCauTuVan request) {
        if (request.getNgayGui() == null) {
            request.setNgayGui(LocalDateTime.now());
        }
        if (request.getTrangThai() == null) {
            request.setTrangThai(TrangThaiYeuCauTuVan.PENDING);
        }
        YeuCauTuVan saved = yeuCauTuVanRepository.save(request);
        return ResponseEntity.ok(ApiResponse.ok(saved, "Gửi yêu cầu tư vấn thành công. Đội ngũ chuyên viên sẽ liên hệ trong khung giờ bạn chọn!"));
    }
}

