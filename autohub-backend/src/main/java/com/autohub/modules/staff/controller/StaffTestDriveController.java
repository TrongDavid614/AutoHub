package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.showroom.repository.XeDemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/staff/test-drives")
@RequiredArgsConstructor
public class StaffTestDriveController {

    private final LichHenLaiThuRepository testDriveRepository;
    private final XeDemoRepository xeDemoRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTestDriveBookings() {
        List<LichHenLaiThu> list = testDriveRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (LichHenLaiThu b : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", String.valueOf(b.getId()));
            map.put("bookingCode", "TD-00" + b.getId());
            map.put("customerName", b.getHoTenKhach() != null ? b.getHoTenKhach() : (b.getNguoiDung() != null ? b.getNguoiDung().getHoTen() : "Khách hàng"));
            map.put("phone", b.getSoDienThoaiKhach() != null ? b.getSoDienThoaiKhach() : (b.getNguoiDung() != null ? b.getNguoiDung().getSoDienThoai() : "0900000000"));
            map.put("carModel", b.getPhienBanXe() != null ? b.getPhienBanXe().getTenPhienBan() : "Xe lái thử AutoHub");
            map.put("scheduledTime", b.getThoiGianHen() != null ? b.getThoiGianHen().toString() : "Hôm nay 09:30");
            map.put("pickupLocation", b.getDiaDiemLaiThu() != null ? b.getDiaDiemLaiThu() : "AutoHub Quận 7 - TP. Hồ Chí Minh");
            map.put("licenseVerified", b.isCamKetGPLX());
            map.put("status", b.getTrangThai() != null ? b.getTrangThai().name() : "PENDING");
            map.put("assignedDemoPlate", b.getXeDemo() != null ? b.getXeDemo().getBienSo() : "51K-992.14");
            map.put("notes", b.getGhiChu() != null ? b.getGhiChu() : "Khách hẹn lái thử");
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy lịch hẹn lái thử thành công từ database"));
    }

    @PostMapping("/{id}/dispatch")
    public ResponseEntity<ApiResponse<String>> dispatchDemoCar(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String plate = payload.get("demoPlate");
        LichHenLaiThu b = testDriveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn ID: " + id));

        if (plate != null) {
            List<XeDemo> demos = xeDemoRepository.findAll();
            for (XeDemo d : demos) {
                if (d.getBienSo().equalsIgnoreCase(plate)) {
                    b.setXeDemo(d);
                    break;
                }
            }
        }
        b.setTrangThai(TrangThaiLichHen.CONFIRMED);
        testDriveRepository.save(b);

        return ResponseEntity.ok(ApiResponse.ok(plate, "Điều phối xe lái thử thành công trong database"));
    }

    @PostMapping("/{id}/complete")
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

