package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.showroom.entity.LichTrucNhanVien;
import com.autohub.core.showroom.repository.LichTrucNhanVienRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.staff.dto.StaffScheduleDetailDto;
import com.autohub.modules.staff.dto.StaffScheduleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/staff/schedules")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffScheduleController {

    private static final DateTimeFormatter VN_DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final LichTrucNhanVienRepository lichTrucRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffScheduleDto>>> getStaffSchedules(Authentication authentication) {
        NguoiDung currentUser = authentication != null && authentication.getName() != null
                ? nguoiDungRepository.findByEmail(authentication.getName()).orElse(null)
                : null;

        List<LichTrucNhanVien> schedules;
        if (currentUser != null && currentUser.getShowroom() != null) {
            Long srId = currentUser.getShowroom().getId();
            schedules = lichTrucRepository.findAll().stream()
                    .filter(s -> s.getShowroom() != null && srId.equals(s.getShowroom().getId()))
                    .sorted(Comparator.comparing(LichTrucNhanVien::getNgayTruc).reversed())
                    .collect(Collectors.toList());
        } else {
            schedules = lichTrucRepository.findAll().stream()
                    .sorted(Comparator.comparing(LichTrucNhanVien::getNgayTruc).reversed())
                    .collect(Collectors.toList());
        }

        List<StaffScheduleDto> result = schedules.stream()
                .map(s -> StaffScheduleDto.builder()
                        .staffCode(formatStaffCode(s.getNhanVien()))
                        .shift(formatShiftLabel(s.getCaTruc()) + " (" + (s.getNgayTruc() != null ? s.getNgayTruc().format(VN_DATE_FMT) : "-") + ")")
                        .assignedShowroom(s.getShowroom() != null ? s.getShowroom().getTenShowroom() : "-")
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy lịch phân ca làm việc thực tế từ SQL Server thành công"));
    }

    @GetMapping("/{staffCode}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<StaffScheduleDetailDto>> getStaffDetailSchedule(@PathVariable String staffCode) {
        Long staffId = parseStaffId(staffCode);
        List<LichTrucNhanVien> items = staffId != null
                ? lichTrucRepository.findByNhanVienId(staffId)
                : List.of();

        List<String> tasks = items.stream()
                .sorted(Comparator.comparing(LichTrucNhanVien::getNgayTruc).reversed())
                .map(s -> {
                    String dateStr = s.getNgayTruc() != null ? s.getNgayTruc().format(VN_DATE_FMT) : "-";
                    String shift = formatShiftLabel(s.getCaTruc());
                    String note = (s.getGhiChu() != null && !s.getGhiChu().isBlank()) ? " - " + s.getGhiChu() : "";
                    return dateStr + " | " + shift + note;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(
                StaffScheduleDetailDto.builder()
                        .staffCode(staffCode)
                        .tasks(tasks)
                        .build(),
                "Lấy chi tiết lịch làm việc của nhân viên " + staffCode + " thành công"
        ));
    }

    private String formatStaffCode(NguoiDung user) {
        if (user == null || user.getId() == null) return "STF-000";
        return "STF-" + String.format("%03d", user.getId());
    }

    private Long parseStaffId(String staffCode) {
        if (staffCode == null) return null;
        String digits = staffCode.replaceAll("[^0-9]", "");
        if (digits.isEmpty()) return null;
        try {
            return Long.parseLong(digits);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String formatShiftLabel(String caTruc) {
        if (caTruc == null) return "Ca trực";
        return switch (caTruc) {
            case "CA_SANG" -> "Ca Sáng (08:00 - 12:00)";
            case "CA_CHIEU" -> "Ca Chiều (13:30 - 17:30)";
            case "CA_TOI" -> "Ca Tối (17:30 - 21:00)";
            case "CA_HANH_CHINH" -> "Ca Hành Chính (08:00 - 17:30)";
            default -> caTruc;
        };
    }
}
