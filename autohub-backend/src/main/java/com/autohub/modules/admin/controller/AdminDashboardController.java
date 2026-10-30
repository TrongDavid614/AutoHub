package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardChartMetrics() {
        // Dữ liệu biểu đồ Chart.js thống kê cho Quản trị viên
        Map<String, Object> metrics = Map.of(
                "totalRevenueMonthly", new BigDecimal("12850000000"),
                "totalCarDeposits", 24,
                "totalAccessoriesSold", 156,
                "depositConversionRate", "78.5%"
        );
        return ResponseEntity.ok(ApiResponse.ok(metrics, "Lấy chỉ số thống kê Dashboard Admin thành công"));
    }
}
