package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.enums.TrangThaiXeDemo;
import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.showroom.repository.XeDemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/staff/test-drives")
@RequiredArgsConstructor
public class StaffTestDriveController {

    private final LichHenLaiThuRepository testDriveRepository;
    private final XeDemoRepository xeDemoRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTestDriveBookings() {
        List<LichHenLaiThu> list = testDriveRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (LichHenLaiThu b : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", String.valueOf(b.getId()));
            map.put("bookingCode", "TD-" + String.format("%03d", b.getId()));
            map.put("customerName", b.getHoTenKhach() != null ? b.getHoTenKhach()
                    : (b.getNguoiDung() != null ? b.getNguoiDung().getHoTen() : "-"));
            map.put("phone", b.getSoDienThoaiKhach() != null ? b.getSoDienThoaiKhach()
                    : (b.getNguoiDung() != null && b.getNguoiDung().getSoDienThoai() != null ? b.getNguoiDung().getSoDienThoai() : "-"));
            map.put("carModel", b.getPhienBanXe() != null ? b.getPhienBanXe().getTenPhienBan() : "Chưa chọn xe");
            map.put("scheduledTime", b.getThoiGianHen() != null ? b.getThoiGianHen().format(fmt) : "-");
            map.put("pickupLocation", b.getDiaDiemLaiThu() != null ? b.getDiaDiemLaiThu()
                    : (b.getShowroom() != null ? b.getShowroom().getTenShowroom() : "Showroom AutoHub"));
            map.put("licenseVerified", b.isCamKetGPLX());
            map.put("status", b.getTrangThai() != null ? b.getTrangThai().name() : "PENDING");
            map.put("assignedDemoPlate", b.getXeDemo() != null ? b.getXeDemo().getBienSo() : null);
            map.put("notes", b.getGhiChu() != null ? b.getGhiChu() : "");
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy lịch hẹn lái thử thành công từ database"));
    }

    @GetMapping("/demo-cars")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAvailableDemoCars() {
        List<XeDemo> demos = xeDemoRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (XeDemo d : demos) {
            if (!d.isDangHoatDong()) continue;
            Map<String, Object> item = new HashMap<>();
            item.put("id", String.valueOf(d.getId()));
            item.put("bienSo", d.getBienSo());
            item.put("model", d.getPhienBanXe() != null ? d.getPhienBanXe().getTenPhienBan() : "Xe Demo AutoHub");
            item.put("showroom", d.getShowroom() != null ? d.getShowroom().getTenShowroom() : "");
            item.put("trangThai", d.getTrangThai() != null ? d.getTrangThai().name() : TrangThaiXeDemo.SAN_SANG.name());
            result.add(item);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách xe Demo từ database thành công"));
    }

    @PostMapping("/{id}/dispatch")
    @Transactional
    public ResponseEntity<ApiResponse<String>> dispatchDemoCar(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String plate = payload.get("demoPlate");
        if (plate == null || plate.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng chọn biển số xe Demo"));
        }

        LichHenLaiThu b = testDriveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn ID: " + id));

        XeDemo matchedDemo = xeDemoRepository.findAll().stream()
                .filter(d -> d.getBienSo() != null && d.getBienSo().equalsIgnoreCase(plate.trim()))
                .findFirst()
                .orElse(null);

        if (matchedDemo == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy xe Demo biển số: " + plate));
        }

        b.setXeDemo(matchedDemo);
        b.setTrangThai(TrangThaiLichHen.CONFIRMED);
        testDriveRepository.save(b);

        return ResponseEntity.ok(ApiResponse.ok(matchedDemo.getBienSo(), "Điều phối xe lái thử thành công trong database"));
    }

    @PostMapping("/{id}/complete")
    @Transactional
    public ResponseEntity<ApiResponse<String>> completeTestDrive(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        LichHenLaiThu b = testDriveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn ID: " + id));

        b.setTrangThai(TrangThaiLichHen.COMPLETED);
        if (payload.get("evaluation") != null) {
            b.setBienBanDanhGia(payload.get("evaluation").toString());
        }
        testDriveRepository.save(b);

        return ResponseEntity.ok(ApiResponse.ok("COMPLETED", "Hoàn tất ca lái thử và lưu biên bản đánh giá"));
    }
}

