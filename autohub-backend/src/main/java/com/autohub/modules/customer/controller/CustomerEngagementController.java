package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import com.autohub.core.showroom.entity.Showroom;
import com.autohub.core.showroom.repository.ShowroomRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer/engagement")
@RequiredArgsConstructor
public class CustomerEngagementController {

    private final LichHenLaiThuRepository lichHenLaiThuRepository;
    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final PhienBanXeRepository phienBanXeRepository;
    private final ShowroomRepository showroomRepository;

    @Getter
    @Setter
    public static class BookTestDriveDto {
        private Long customerId;
        private Long phienBanId;
        private Long showroomId;
        private String hoTenKhach;
        private String soDienThoaiKhach;
        private String diaDiemLaiThu;
        private String thoiGianHen;
        private Boolean camKetGplx;
        private String ghiChu;
    }

    @GetMapping("/test-drives")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyTestDrives(@RequestParam(required = false) Long customerId) {
        List<LichHenLaiThu> list = (customerId != null)
                ? lichHenLaiThuRepository.findByNguoiDungId(customerId)
                : Collections.emptyList();
        if (list.isEmpty()) {
            list = lichHenLaiThuRepository.findAll();
        }

        List<Map<String, Object>> dtos = list.stream().map(this::mapTestDriveToDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(dtos, "Lấy danh sách lịch hẹn lái thử thành công"));
    }

    @PostMapping("/test-drives")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bookTestDrive(@RequestBody BookTestDriveDto req) {
        Long custId = req.getCustomerId() != null ? req.getCustomerId() : 5L;
        NguoiDung user = nguoiDungRepository.findById(custId)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));

        PhienBanXe pb = null;
        if (req.getPhienBanId() != null) {
            pb = phienBanXeRepository.findById(req.getPhienBanId()).orElse(null);
        }
        if (pb == null) {
            pb = phienBanXeRepository.findAll().stream().findFirst().orElse(null);
        }

        Showroom sr = null;
        if (req.getShowroomId() != null) {
            sr = showroomRepository.findById(req.getShowroomId()).orElse(null);
        }
        if (sr == null) {
            sr = showroomRepository.findAll().stream().findFirst().orElse(null);
        }

        LocalDateTime bookingTime = LocalDateTime.now().plusHours(26);
        if (req.getThoiGianHen() != null && !req.getThoiGianHen().isBlank()) {
            try {
                bookingTime = LocalDateTime.parse(req.getThoiGianHen());
            } catch (Exception ignored) {}
        }

        LichHenLaiThu item = LichHenLaiThu.builder()
                .nguoiDung(user)
                .phienBanXe(pb)
                .showroom(sr)
                .hoTenKhach(req.getHoTenKhach() != null ? req.getHoTenKhach() : (user != null ? user.getHoTen() : "Khách hàng"))
                .soDienThoaiKhach(req.getSoDienThoaiKhach() != null ? req.getSoDienThoaiKhach() : "0912345678")
                .diaDiemLaiThu(req.getDiaDiemLaiThu() != null ? req.getDiaDiemLaiThu() : (sr != null ? sr.getTenShowroom() : "Showroom AutoHub Flagship"))
                .thoiGianHen(bookingTime)
                .thoiLuongPhut(60)
                .camKetGplx(req.getCamKetGplx() != null ? req.getCamKetGplx() : true)
                .ghiChu(req.getGhiChu())
                .trangThai(TrangThaiLichHen.PENDING)
                .ngayTao(LocalDateTime.now())
                .build();

        LichHenLaiThu saved = lichHenLaiThuRepository.save(item);
        return ResponseEntity.ok(ApiResponse.ok(mapTestDriveToDto(saved), "Đặt lịch hẹn lái thử thành công"));
    }

    @PostMapping("/test-drives/{id}/cancel")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cancelTestDrive(@PathVariable Long id) {
        LichHenLaiThu item = lichHenLaiThuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch hẹn ID: " + id));
        item.setTrangThai(TrangThaiLichHen.CANCELLED);
        LichHenLaiThu saved = lichHenLaiThuRepository.save(item);
        return ResponseEntity.ok(ApiResponse.ok(mapTestDriveToDto(saved), "Đã hủy lịch hẹn lái thử"));
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

    private Map<String, Object> mapTestDriveToDto(LichHenLaiThu l) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", l.getId());
        map.put("bookingCode", "#TD-" + (l.getId() < 100 ? "0" + l.getId() : l.getId()));

        String modelName = "AutoHub GT-e";
        String variantName = "GT-e Performance Dual-Motor AWD";
        if (l.getPhienBanXe() != null) {
            variantName = l.getPhienBanXe().getTenPhienBan();
            if (l.getPhienBanXe().getDongXe() != null) {
                modelName = l.getPhienBanXe().getDongXe().getTenDongXe();
            }
        }
        map.put("carModelName", modelName);
        map.put("carVariant", variantName);
        map.put("carImageUrl", "https://api.builder.io/api/v1/image/assets/TEMP/f8563407750402a5ec748ad5da036903aa27d5e0?width=600");

        String showroomName = "Showroom AutoHub Flagship Thủ Đức";
        String showroomAddress = l.getDiaDiemLaiThu() != null ? l.getDiaDiemLaiThu() : "Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh";
        if (l.getShowroom() != null) {
            showroomName = l.getShowroom().getTenShowroom();
            if (l.getShowroom().getDiaChi() != null) showroomAddress = l.getShowroom().getDiaChi();
        }
        map.put("showroomName", showroomName);
        map.put("showroomAddress", showroomAddress);
        map.put("locationType", (showroomAddress.contains("Showroom") || showroomAddress.contains("AutoHub")) ? "SHOWROOM" : "HOME");

        if (l.getThoiGianHen() != null) {
            map.put("bookingDate", l.getThoiGianHen().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            int duration = l.getThoiLuongPhut() != null ? l.getThoiLuongPhut() : 60;
            map.put("timeSlot", l.getThoiGianHen().format(DateTimeFormatter.ofPattern("HH:mm")) + " - " + l.getThoiGianHen().plusMinutes(duration).format(DateTimeFormatter.ofPattern("HH:mm")));
        } else {
            map.put("bookingDate", "Hôm nay");
            map.put("timeSlot", "09:00 - 10:30");
        }

        map.put("status", l.getTrangThai() != null ? l.getTrangThai().name() : "PENDING");
        map.put("hasDrivingLicense", Boolean.TRUE.equals(l.getCamKetGplx()));
        map.put("demoCarPlate", l.getXeDemo() != null ? l.getXeDemo().getBienSo() + " (Xe Demo)" : "51K-999.88 (Xe Demo)");
        map.put("consultantName", "Kỹ sư Trịnh Hoài Nam");
        map.put("evaluationNote", l.getGhiChu());
        map.put("createdAt", l.getNgayTao() != null ? l.getNgayTao().toString() : LocalDateTime.now().toString());
        return map;
    }
}


