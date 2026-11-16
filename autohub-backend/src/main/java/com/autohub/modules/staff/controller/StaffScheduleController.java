package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.modules.staff.dto.StaffScheduleDetailDto;
import com.autohub.modules.staff.dto.StaffScheduleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff/schedules")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffScheduleController {

    @GetMapping
    public ResponseEntity<ApiResponse<List<StaffScheduleDto>>> getStaffSchedules() {
        return ResponseEntity.ok(ApiResponse.ok(List.of(
                StaffScheduleDto.builder()
                        .staffCode("STF-004")
                        .shift("Ca Sáng 08:00 - 12:00")
                        .assignedShowroom("AutoHub Thủ Đức")
                        .build()
        ), "Lấy lịch phân ca làm việc thành công"));
    }

    @GetMapping("/{staffCode}")
    public ResponseEntity<ApiResponse<StaffScheduleDetailDto>> getStaffDetailSchedule(@PathVariable String staffCode) {
        return ResponseEntity.ok(ApiResponse.ok(
                StaffScheduleDetailDto.builder()
                        .staffCode(staffCode)
                        .tasks(List.of("Trực bàn giao lái thử xe GT-e", "Tiếp nhận 2 ca cọc xe"))
                        .build(),
                "Lấy chi tiết lịch làm việc của nhân viên " + staffCode + " thành công"
        ));
    }
}
