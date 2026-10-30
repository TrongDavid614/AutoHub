package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/staff/workspace")
@RequiredArgsConstructor
public class StaffWorkspaceController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getWorkspaceMetrics() {
        // Trả về dữ liệu 2 Mini-Chart: Mật độ lái thử theo giờ & Sức khỏe cọc xe 72h
        Map<String, Object> data = Map.of(
                "hourlyTestDriveDensity", Map.of(
                        "peakHour", "14:00 - 15:30",
                        "totalToday", 8
                ),
                "depositHealth72h", Map.of(
                        "activeHolding", 5,
                        "approachingDeadline", 2
                )
        );
        return ResponseEntity.ok(ApiResponse.ok(data, "Lấy chỉ số Mini-Chart Workspace nhân viên thành công"));
    }
}
