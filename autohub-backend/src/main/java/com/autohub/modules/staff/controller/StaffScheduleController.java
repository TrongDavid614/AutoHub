package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/staff/schedules")
@RequiredArgsConstructor
public class StaffScheduleController {

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStaffSchedules() {
        return ResponseEntity.ok(ApiResponse.ok(List.of(
                Map.of("staffCode", "STF-004", "shift", "Ca Sáng 08:00 - 12:00", "assignedShowroom", "AutoHub Thủ Đức")
        ), "Lấy lịch phân ca làm việc thành công"));
    }

    @GetMapping("/{staffCode}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStaffDetailSchedule(@PathVariable String staffCode) {
        return ResponseEntity.ok(ApiResponse.ok(
                Map.of("staffCode", staffCode, "tasks", List.of("Trực bàn giao lái thử xe GT-e", "Tiếp nhận 2 ca cọc xe")),
                "Lấy chi tiết lịch làm việc của nhân viên " + staffCode + " thành công"
        ));
    }
}
