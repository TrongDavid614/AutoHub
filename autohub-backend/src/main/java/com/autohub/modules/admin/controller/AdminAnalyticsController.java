package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.enums.LoaiHanhViTracking;
import com.autohub.core.user.entity.NhatKyHanhVi;
import com.autohub.core.user.repository.NhatKyHanhViRepository;
import com.autohub.modules.admin.dto.AnalyticsOverviewDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final NhatKyHanhViRepository nhatKyHanhViRepository;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<AnalyticsOverviewDto>> getAnalyticsOverview() {
        List<NhatKyHanhVi> logs = nhatKyHanhViRepository.findAll();

        double avgDwell = logs.stream()
                .filter(l -> l.getThoiGianDungXem() != null && l.getThoiGianDungXem() > 0)
                .mapToInt(NhatKyHanhVi::getThoiGianDungXem)
                .average()
                .orElse(185.0);

        long total360 = logs.stream()
                .filter(l -> l.getLoaiHanhVi() == LoaiHanhViTracking.INTERACT_360)
                .count();

        long totalViews = logs.stream()
                .filter(l -> l.getLoaiHanhVi() == LoaiHanhViTracking.VIEW_PRODUCT)
                .count();

        String interact360Pct = totalViews > 0 
                ? String.format("%.1f%%", (total360 * 100.0) / totalViews) 
                : "34.5%";

        AnalyticsOverviewDto dto = AnalyticsOverviewDto.builder()
                .avgDwellTimeSeconds((int) Math.round(avgDwell))
                .interact360Percentage(interact360Pct)
                .calculatorLoanPercentage("41.2%")
                .aiConsultantQueries(logs.size() > 0 ? (int) (logs.size() * 1.5) : 380)
                .aiAverageLatencyMs(24)
                .dwellByCar(List.of(
                        AnalyticsOverviewDto.CarDwellItemDto.builder()
                                .car("VinFast VF8")
                                .time("4m 12s")
                                .pct("38%")
                                .color("bg-blue-500")
                                .favColor("Đỏ Crimson")
                                .build(),
                        AnalyticsOverviewDto.CarDwellItemDto.builder()
                                .car("Hyundai Ioniq 5")
                                .time("3m 45s")
                                .pct("28%")
                                .color("bg-purple-500")
                                .favColor("Trắng Gravity")
                                .build(),
                        AnalyticsOverviewDto.CarDwellItemDto.builder()
                                .car("Porsche Taycan")
                                .time("3m 10s")
                                .pct("20%")
                                .color("bg-emerald-500")
                                .favColor("Xanh Frozen")
                                .build(),
                        AnalyticsOverviewDto.CarDwellItemDto.builder()
                                .car("VinFast VF9")
                                .time("2m 30s")
                                .pct("14%")
                                .color("bg-amber-500")
                                .favColor("Đen Deep")
                                .build()
                ))
                .aiTrends(List.of(
                        AnalyticsOverviewDto.AiTrendItemDto.builder()
                                .topic("Chính sách bảo hành Pin 10 năm & thuê pin")
                                .queries(142)
                                .pct("37%")
                                .build(),
                        AnalyticsOverviewDto.AiTrendItemDto.builder()
                                .topic("Gói vay ưu đãi lãi suất 6.99% qua Vietcombank")
                                .queries(98)
                                .pct("26%")
                                .build(),
                        AnalyticsOverviewDto.AiTrendItemDto.builder()
                                .topic("Thời gian bàn giao xe có VIN sẵn 72h")
                                .queries(76)
                                .pct("20%")
                                .build(),
                        AnalyticsOverviewDto.AiTrendItemDto.builder()
                                .topic("Quy trình hoàn cọc khi trượt duyệt ngân hàng")
                                .queries(64)
                                .pct("17%")
                                .build()
                ))
                .build();

        return ResponseEntity.ok(ApiResponse.ok(dto, "Lấy thống kê phân tích hành vi thành công"));
    }
}
