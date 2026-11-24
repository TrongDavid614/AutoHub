package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.enums.TrangThaiXeDemo;
import com.autohub.core.showroom.entity.LichSuBaoDuongXeDemo;
import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.showroom.repository.LichSuBaoDuongXeDemoRepository;
import com.autohub.core.showroom.repository.XeDemoRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.staff.dto.DemoFleetCarDto;
import com.autohub.modules.staff.dto.DemoMaintenanceRecordDto;
import com.autohub.modules.staff.dto.ScheduleDemoMaintenanceRequest;
import com.autohub.modules.staff.dto.UpdateDemoOdoRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/staff/fleet")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffFleetController {

    private static final DateTimeFormatter VN_DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final XeDemoRepository xeDemoRepository;
    private final LichSuBaoDuongXeDemoRepository maintenanceRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<DemoFleetCarDto>>> getDemoFleet() {
        List<XeDemo> list = xeDemoRepository.findAll();
        List<DemoFleetCarDto> result = new ArrayList<>();

        for (XeDemo d : list) {
            List<LichSuBaoDuongXeDemo> logs;
            try {
                logs = maintenanceRepository.findByXeDemoIdOrderByNgayTaoDesc(d.getId());
            } catch (Exception ex) {
                // Graceful fallback if migration script autohub_staff_integration_migration.sql has not been executed yet
                logs = List.of();
            }
            Optional<LichSuBaoDuongXeDemo> activeLog = logs.stream()
                    .filter(l -> "DANG_BAO_DUONG".equals(l.getTrangThai()))
                    .findFirst();

            List<DemoMaintenanceRecordDto> historyDtos = logs.stream()
                    .map(this::toMaintenanceDto)
                    .collect(Collectors.toList());

            DemoFleetCarDto dto = DemoFleetCarDto.builder()
                    .id(String.valueOf(d.getId()))
                    .licensePlate(d.getBienSo())
                    .carModel(d.getPhienBanXe() != null ? d.getPhienBanXe().getTenPhienBan() : "Xe Demo AutoHub")
                    .showroomName(d.getShowroom() != null ? d.getShowroom().getTenShowroom() : "-")
                    .currentOdo(d.getSoOdoHienTai() != null ? d.getSoOdoHienTai() : 0)
                    .status(d.getTrangThai() != null ? d.getTrangThai().name() : "SAN_SANG")
                    .lastMaintenanceDate(d.getNgayBaoDuongGanNhat() != null ? d.getNgayBaoDuongGanNhat().format(VN_DATE_FMT) : "-")
                    .nextMaintenanceDate(d.getNgayBaoDuongTiepTheo() != null ? d.getNgayBaoDuongTiepTheo().format(VN_DATE_FMT) : "-")
                    .maintenanceReason(activeLog.map(LichSuBaoDuongXeDemo::getHangMucBaoDuong).orElse(null))
                    .expectedReturnDate(activeLog.map(l -> l.getNgayDuKienHoanTat() != null ? l.getNgayDuKienHoanTat().format(VN_DATE_FMT) : null).orElse(null))
                    .maintenanceHistory(historyDtos)
                    .build();
            result.add(dto);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đội xe Demo lái thử thành công từ database"));
    }

    @GetMapping("/maintenance-history")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<DemoMaintenanceRecordDto>>> getMaintenanceHistory() {
        List<DemoMaintenanceRecordDto> history = maintenanceRepository.findAllByOrderByNgayTaoDesc().stream()
                .map(this::toMaintenanceDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(history, "Lấy lịch sử bảo dưỡng đội xe Demo thành công"));
    }

    @PutMapping("/{id}/odo")
    @Transactional
    public ResponseEntity<ApiResponse<String>> updateOdo(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDemoOdoRequest payload
    ) {
        Integer odo = payload.getNewOdo();
        if (odo == null || odo < 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Chỉ số ODO không hợp lệ"));
        }
        XeDemo d = xeDemoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe Demo ID: " + id));

        d.setSoOdoHienTai(odo);
        xeDemoRepository.save(d);

        return ResponseEntity.ok(ApiResponse.ok("ODO_UPDATED", "Đã cập nhật chỉ số ODO mới: " + odo + " km"));
    }

    @PostMapping("/{id}/maintenance")
    @Transactional
    public ResponseEntity<ApiResponse<String>> scheduleMaintenance(
            @PathVariable Long id,
            @RequestBody(required = false) ScheduleDemoMaintenanceRequest payload,
            Authentication authentication
    ) {
        XeDemo d = xeDemoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe Demo ID: " + id));

        if (d.getTrangThai() == TrangThaiXeDemo.BAO_DUONG) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Xe Demo " + d.getBienSo() + " hiện đang ở trạng thái bảo dưỡng"));
        }

        String reason = (payload != null && payload.getReason() != null && !payload.getReason().isBlank())
                ? payload.getReason().trim()
                : "Bảo dưỡng định kỳ tiêu chuẩn";
        LocalDate expectedReturn = parseFlexibleDate(payload != null ? payload.getExpectedReturnDate() : null);

        d.setTrangThai(TrangThaiXeDemo.BAO_DUONG);
        if (expectedReturn != null) {
            d.setNgayBaoDuongTiepTheo(expectedReturn);
        }
        xeDemoRepository.save(d);

        NguoiDung staff = authentication != null && authentication.getName() != null
                ? nguoiDungRepository.findByEmail(authentication.getName()).orElse(null)
                : null;

        String ticketCode = "BD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"))
                + "-" + String.format("%02d", new Random().nextInt(100));

        LichSuBaoDuongXeDemo record = LichSuBaoDuongXeDemo.builder()
                .maPhieuBaoDuong(ticketCode)
                .xeDemo(d)
                .nguoiTao(staff)
                .hangMucBaoDuong(reason)
                .soOdoLucBaoDuong(d.getSoOdoHienTai() != null ? d.getSoOdoHienTai() : 0)
                .ngayBatDau(LocalDate.now())
                .ngayDuKienHoanTat(expectedReturn)
                .trangThai("DANG_BAO_DUONG")
                .ngayTao(LocalDateTime.now())
                .build();
        maintenanceRepository.save(record);

        return ResponseEntity.ok(ApiResponse.ok(ticketCode, "Đã lập phiếu bảo dưỡng " + ticketCode + " cho xe " + d.getBienSo()));
    }

    @PostMapping("/{id}/complete-maintenance")
    @Transactional
    public ResponseEntity<ApiResponse<String>> completeMaintenance(@PathVariable Long id) {
        XeDemo d = xeDemoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe Demo ID: " + id));

        if (d.getTrangThai() != TrangThaiXeDemo.BAO_DUONG) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Xe Demo " + d.getBienSo() + " không ở trạng thái đang bảo dưỡng"));
        }

        LocalDate today = LocalDate.now();
        d.setTrangThai(TrangThaiXeDemo.SAN_SANG);
        d.setNgayBaoDuongGanNhat(today);
        d.setNgayBaoDuongTiepTheo(today.plusMonths(3));
        xeDemoRepository.save(d);

        maintenanceRepository.findFirstByXeDemoIdAndTrangThaiOrderByNgayTaoDesc(d.getId(), "DANG_BAO_DUONG")
                .ifPresent(log -> {
                    log.setTrangThai("HOAN_TAT");
                    log.setNgayHoanTatThucTe(today);
                    maintenanceRepository.save(log);
                });

        return ResponseEntity.ok(ApiResponse.ok("SAN_SANG", "Đã hoàn tất bảo dưỡng, xe " + d.getBienSo() + " đã sẵn sàng lái thử"));
    }

    private DemoMaintenanceRecordDto toMaintenanceDto(LichSuBaoDuongXeDemo l) {
        return DemoMaintenanceRecordDto.builder()
                .id(String.valueOf(l.getId()))
                .ticketCode(l.getMaPhieuBaoDuong())
                .demoCarId(String.valueOf(l.getXeDemo().getId()))
                .licensePlate(l.getXeDemo().getBienSo())
                .carModel(l.getXeDemo().getPhienBanXe() != null ? l.getXeDemo().getPhienBanXe().getTenPhienBan() : "Xe Demo")
                .maintenanceItem(l.getHangMucBaoDuong())
                .odoAtMaintenance(l.getSoOdoLucBaoDuong())
                .startDate(l.getNgayBatDau() != null ? l.getNgayBatDau().format(VN_DATE_FMT) : "-")
                .expectedReturnDate(l.getNgayDuKienHoanTat() != null ? l.getNgayDuKienHoanTat().format(VN_DATE_FMT) : "-")
                .actualReturnDate(l.getNgayHoanTatThucTe() != null ? l.getNgayHoanTatThucTe().format(VN_DATE_FMT) : null)
                .status(l.getTrangThai())
                .notes(l.getGhiChu())
                .createdBy(l.getNguoiTao() != null ? l.getNguoiTao().getHoTen() : "Hệ thống")
                .build();
    }

    private LocalDate parseFlexibleDate(String raw) {
        if (raw == null || raw.isBlank()) return null;
        String trimmed = raw.trim();
        for (DateTimeFormatter f : List.of(VN_DATE_FMT, DateTimeFormatter.ISO_LOCAL_DATE)) {
            try {
                return LocalDate.parse(trimmed, f);
            } catch (DateTimeParseException ignored) {
                // try next pattern
            }
        }
        return null;
    }
}
