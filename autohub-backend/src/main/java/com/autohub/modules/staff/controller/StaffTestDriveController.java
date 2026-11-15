package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.enums.TrangThaiXeDemo;
import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.showroom.repository.XeDemoRepository;
import com.autohub.modules.staff.dto.CompleteTestDriveRequest;
import com.autohub.modules.staff.dto.DemoCarOptionDto;
import com.autohub.modules.staff.dto.DispatchTestDriveRequest;
import com.autohub.modules.staff.dto.StaffTestDriveDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/staff/test-drives")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffTestDriveController {

    private final LichHenLaiThuRepository testDriveRepository;
    private final XeDemoRepository xeDemoRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffTestDriveDto>>> getTestDriveBookings() {
        List<LichHenLaiThu> list = testDriveRepository.findAll();
        List<StaffTestDriveDto> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (LichHenLaiThu b : list) {
            StaffTestDriveDto dto = StaffTestDriveDto.builder()
                    .id(String.valueOf(b.getId()))
                    .bookingCode("TD-" + String.format("%03d", b.getId()))
                    .customerName(b.getHoTenKhach() != null ? b.getHoTenKhach()
                            : (b.getNguoiDung() != null ? b.getNguoiDung().getHoTen() : "-"))
                    .phone(b.getSoDienThoaiKhach() != null ? b.getSoDienThoaiKhach()
                            : (b.getNguoiDung() != null && b.getNguoiDung().getSoDienThoai() != null ? b.getNguoiDung().getSoDienThoai() : "-"))
                    .carModel(b.getPhienBanXe() != null ? b.getPhienBanXe().getTenPhienBan() : "Chưa chọn xe")
                    .scheduledTime(b.getThoiGianHen() != null ? b.getThoiGianHen().format(fmt) : "-")
                    .pickupLocation(b.getDiaDiemLaiThu() != null ? b.getDiaDiemLaiThu()
                            : (b.getShowroom() != null ? b.getShowroom().getTenShowroom() : "Showroom AutoHub"))
                    .licenseVerified(b.isCamKetGPLX())
                    .status(b.getTrangThai() != null ? b.getTrangThai().name() : "PENDING")
                    .assignedDemoPlate(b.getXeDemo() != null ? b.getXeDemo().getBienSo() : null)
                    .notes(b.getGhiChu() != null ? b.getGhiChu() : "")
                    .build();
            result.add(dto);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy lịch hẹn lái thử thành công từ database"));
    }

    @GetMapping("/demo-cars")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<DemoCarOptionDto>>> getAvailableDemoCars() {
        List<XeDemo> demos = xeDemoRepository.findAll();
        List<DemoCarOptionDto> result = new ArrayList<>();

        for (XeDemo d : demos) {
            if (!d.isDangHoatDong()) continue;
            DemoCarOptionDto item = DemoCarOptionDto.builder()
                    .id(String.valueOf(d.getId()))
                    .bienSo(d.getBienSo())
                    .model(d.getPhienBanXe() != null ? d.getPhienBanXe().getTenPhienBan() : "Xe Demo AutoHub")
                    .showroom(d.getShowroom() != null ? d.getShowroom().getTenShowroom() : "")
                    .trangThai(d.getTrangThai() != null ? d.getTrangThai().name() : TrangThaiXeDemo.SAN_SANG.name())
                    .build();
            result.add(item);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách xe Demo từ database thành công"));
    }

    @PostMapping("/{id}/dispatch")
    @Transactional
    public ResponseEntity<ApiResponse<String>> dispatchDemoCar(
            @PathVariable Long id,
            @Valid @RequestBody DispatchTestDriveRequest payload
    ) {
        String plate = payload.getDemoPlate();
        LichHenLaiThu b = testDriveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn ID: " + id));

        // Kiểm tra Idempotency & trạng thái hợp lệ
        if (b.getTrangThai() == TrangThaiLichHen.CANCELLED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể điều phối cho lịch hẹn đã bị hủy"));
        }
        if (b.getTrangThai() == TrangThaiLichHen.COMPLETED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lịch hẹn này đã hoàn tất trước đó"));
        }

        XeDemo matchedDemo = xeDemoRepository.findByBienSoIgnoreCase(plate.trim())
                .orElse(null);

        if (matchedDemo == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy xe Demo biển số: " + plate));
        }

        // Nếu lịch hẹn trước đó đã gán xe demo khác, hoàn trả trạng thái xe cũ về SAN_SANG
        if (b.getXeDemo() != null && !b.getXeDemo().getId().equals(matchedDemo.getId())) {
            XeDemo oldDemo = b.getXeDemo();
            oldDemo.setTrangThai(TrangThaiXeDemo.SAN_SANG);
            xeDemoRepository.save(oldDemo);
        }

        // Cập nhật trạng thái xe Demo sang ĐANG_CHAY_THU
        matchedDemo.setTrangThai(TrangThaiXeDemo.DANG_CHAY_THU);
        xeDemoRepository.save(matchedDemo);

        b.setXeDemo(matchedDemo);
        b.setTrangThai(TrangThaiLichHen.CONFIRMED);
        testDriveRepository.save(b);

        return ResponseEntity.ok(ApiResponse.ok(matchedDemo.getBienSo(), "Điều phối xe lái thử thành công trong database"));
    }

    @PostMapping("/{id}/complete")
    @Transactional
    public ResponseEntity<ApiResponse<String>> completeTestDrive(
            @PathVariable Long id,
            @RequestBody(required = false) CompleteTestDriveRequest payload
    ) {
        LichHenLaiThu b = testDriveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn ID: " + id));

        if (b.getTrangThai() == TrangThaiLichHen.CANCELLED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể hoàn tất lịch hẹn đã bị hủy"));
        }

        // Hoàn trả trạng thái xe Demo về SẴN_SÀNG
        if (b.getXeDemo() != null) {
            XeDemo demo = b.getXeDemo();
            demo.setTrangThai(TrangThaiXeDemo.SAN_SANG);
            xeDemoRepository.save(demo);
        }

        b.setTrangThai(TrangThaiLichHen.COMPLETED);
        if (payload != null && payload.getEvaluation() != null) {
            b.setBienBanDanhGia(payload.getEvaluation().toString());
        }
        testDriveRepository.save(b);

        return ResponseEntity.ok(ApiResponse.ok("COMPLETED", "Hoàn tất ca lái thử và lưu biên bản đánh giá"));
    }
}
