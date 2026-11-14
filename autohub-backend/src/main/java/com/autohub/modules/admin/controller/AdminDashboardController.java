package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.modules.admin.dto.*;
import com.autohub.modules.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping({"", "/overview"})
    public ResponseEntity<ApiResponse<AdminDashboardOverviewDto>> getDashboardOverview() {
        AdminDashboardOverviewDto overview = adminDashboardService.getDashboardOverview();
        return ResponseEntity.ok(ApiResponse.ok(overview, "Lấy dữ liệu tổng quan Dashboard Admin thành công"));
    }

    @GetMapping("/kpis")
    public ResponseEntity<ApiResponse<List<KpiMetricDto>>> getKpiMetrics() {
        List<KpiMetricDto> kpis = adminDashboardService.getKpiMetrics();
        return ResponseEntity.ok(ApiResponse.ok(kpis, "Lấy danh sách KPI Dashboard thành công"));
    }

    @GetMapping("/revenue-chart")
    public ResponseEntity<ApiResponse<List<RevenueDataPointDto>>> getRevenueChart(
            @RequestParam(defaultValue = "90D") String range
    ) {
        List<RevenueDataPointDto> points = adminDashboardService.getRevenueChart(range);
        return ResponseEntity.ok(ApiResponse.ok(points, "Lấy dữ liệu biểu đồ doanh thu thành công"));
    }

    @GetMapping("/regional-revenues")
    public ResponseEntity<ApiResponse<List<RegionalRevenueDto>>> getRegionalRevenues() {
        List<RegionalRevenueDto> regional = adminDashboardService.getRegionalRevenues();
        return ResponseEntity.ok(ApiResponse.ok(regional, "Lấy tỷ trọng doanh thu showroom thành công"));
    }

    @GetMapping("/urgent-deposits")
    public ResponseEntity<ApiResponse<List<UrgentDepositDto>>> getUrgentDeposits() {
        List<UrgentDepositDto> urgent = adminDashboardService.getUrgentDeposits();
        return ResponseEntity.ok(ApiResponse.ok(urgent, "Lấy danh sách cọc xe 72h khẩn cấp thành công"));
    }

    @PostMapping("/urgent-deposits/{id}/nudge")
    public ResponseEntity<ApiResponse<String>> nudgeStaffForUrgentDeposit(@PathVariable String id) {
        String msg = adminDashboardService.nudgeStaff(id);
        return ResponseEntity.ok(ApiResponse.ok(msg, "Gửi thông báo đốc thúc nhân viên thành công"));
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardChartMetrics() {
        List<KpiMetricDto> kpis = adminDashboardService.getKpiMetrics();
        Double accRev = kpis.stream()
                .filter(k -> "kpi-accessory-rev".equals(k.getId()))
                .map(KpiMetricDto::getNumericValue)
                .findFirst()
                .orElse(3842500000.0);

        Double carDeposits = kpis.stream()
                .filter(k -> "kpi-car-deposits".equals(k.getId()))
                .map(KpiMetricDto::getNumericValue)
                .findFirst()
                .orElse(380000000.0);

        Map<String, Object> metrics = Map.of(
                "totalRevenueMonthly", BigDecimal.valueOf(accRev),
                "totalCarDepositsCashflow", BigDecimal.valueOf(carDeposits),
                "totalCarDepositsCount", 24,
                "depositConversionRate", "78.5%"
        );
        return ResponseEntity.ok(ApiResponse.ok(metrics, "Lấy chỉ số thống kê Dashboard Admin thành công"));
    }
}

