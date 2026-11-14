package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.engagement.entity.NhatKyTuVan;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.NhatKyTuVanRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.LoaiHanhViTracking;
import com.autohub.core.user.entity.NhatKyHanhVi;
import com.autohub.core.user.repository.NhatKyHanhViRepository;
import com.autohub.modules.admin.dto.AnalyticsOverviewDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final NhatKyHanhViRepository nhatKyHanhViRepository;
    private final PhienBanXeRepository phienBanXeRepository;
    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final NhatKyTuVanRepository nhatKyTuVanRepository;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<AnalyticsOverviewDto>> getAnalyticsOverview() {
        List<NhatKyHanhVi> logs = nhatKyHanhViRepository.findAll();

        // 1. Dwell Time trung bình (trả về 0.0 nếu chưa có dữ liệu)
        double avgDwell = logs.stream()
                .filter(l -> l.getThoiGianDungXem() != null && l.getThoiGianDungXem() > 0)
                .mapToInt(NhatKyHanhVi::getThoiGianDungXem)
                .average()
                .orElse(0.0);

        // 2. Tỷ lệ tương tác xoay 360 độ (trả về 0.0% nếu chưa có lượt xem)
        long total360 = logs.stream()
                .filter(l -> l.getLoaiHanhVi() == LoaiHanhViTracking.INTERACT_360)
                .count();

        long totalViews = logs.stream()
                .filter(l -> l.getLoaiHanhVi() == LoaiHanhViTracking.VIEW_PRODUCT)
                .count();

        String interact360Pct = totalViews > 0
                ? String.format("%.1f%%", (total360 * 100.0) / totalViews)
                : "0.0%";

        // 3. Tỷ lệ tương tác công cụ tính phí lăn bánh / trả góp
        long totalLogs = logs.size();
        long calculatorCount = logs.stream()
                .filter(l -> {
                    if (l.getDuLieuBoSung() != null) {
                        String extra = l.getDuLieuBoSung().toLowerCase();
                        if (extra.contains("calculator") || extra.contains("estimator")
                                || extra.contains("loan") || extra.contains("lan_banh")
                                || extra.contains("tra_gop")) {
                            return true;
                        }
                    }
                    if (l.getLoaiThucThe() != null) {
                        String entityType = l.getLoaiThucThe().toUpperCase();
                        return entityType.contains("ESTIMATOR") || entityType.contains("CALCULATOR");
                    }
                    return false;
                })
                .count();

        String calculatorLoanPct = totalLogs > 0
                ? String.format("%.1f%%", (calculatorCount * 100.0) / totalLogs)
                : "0.0%";

        // 4. Số lượt hỏi đáp Trợ lý AI và độ trễ phản hồi trung bình (ms)
        int totalAiQueries = (int) (yeuCauTuVanRepository.count() + nhatKyTuVanRepository.count());

        List<NhatKyTuVan> consultLogs = nhatKyTuVanRepository.findAll();
        double avgLatency = consultLogs.stream()
                .filter(c -> c.getThoiGianPhanHoiMs() != null && c.getThoiGianPhanHoiMs() > 0)
                .mapToInt(NhatKyTuVan::getThoiGianPhanHoiMs)
                .average()
                .orElse(0.0);

        // 5. Phân bổ thời gian dừng xem theo mẫu xe
        List<AnalyticsOverviewDto.CarDwellItemDto> carDwells = buildCarDwellList(logs);

        // 6. Xu hướng hỏi đáp Trợ lý AI
        List<AnalyticsOverviewDto.AiTrendItemDto> aiTrends = buildAiTrendList();

        AnalyticsOverviewDto dto = AnalyticsOverviewDto.builder()
                .avgDwellTimeSeconds((int) Math.round(avgDwell))
                .interact360Percentage(interact360Pct)
                .calculatorLoanPercentage(calculatorLoanPct)
                .aiConsultantQueries(totalAiQueries)
                .aiAverageLatencyMs((int) Math.round(avgLatency))
                .dwellByCar(carDwells)
                .aiTrends(aiTrends)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(dto, "Lấy thống kê phân tích hành vi người dùng thành công"));
    }

    private List<AnalyticsOverviewDto.CarDwellItemDto> buildCarDwellList(List<NhatKyHanhVi> logs) {
        // Lấy danh sách xe thực tế từ CSDL để map tên chính xác
        Map<Long, String> carNameMap = phienBanXeRepository.findAll().stream()
                .collect(Collectors.toMap(
                        PhienBanXe::getId,
                        pb -> (pb.getDongXe() != null ? pb.getDongXe().getTenDongXe() + " " : "") + pb.getTenPhienBan(),
                        (existing, replacement) -> existing
                ));

        // Group dwell time theo car id
        Map<Long, Integer> dwellByCarId = logs.stream()
                .filter(l -> "CAR".equalsIgnoreCase(l.getLoaiThucThe()) && l.getMaThucThe() != null && l.getThoiGianDungXem() != null && l.getThoiGianDungXem() > 0)
                .collect(Collectors.groupingBy(
                        NhatKyHanhVi::getMaThucThe,
                        Collectors.summingInt(NhatKyHanhVi::getThoiGianDungXem)
                ));

        if (!dwellByCarId.isEmpty()) {
            int totalDwell = dwellByCarId.values().stream().mapToInt(Integer::intValue).sum();
            List<AnalyticsOverviewDto.CarDwellItemDto> result = new ArrayList<>();
            String[] colors = {"bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500"};
            String[] favColors = {"Đỏ Crimson", "Trắng Gravity", "Xanh Frozen", "Đen Deep"};
            int idx = 0;

            for (Map.Entry<Long, Integer> entry : dwellByCarId.entrySet()) {
                String carName = carNameMap.getOrDefault(entry.getKey(), "Xe #" + entry.getKey());
                int seconds = entry.getValue();
                int minutes = seconds / 60;
                int remSeconds = seconds % 60;
                String timeStr = minutes > 0 ? minutes + "m " + remSeconds + "s" : seconds + "s";
                int pct = totalDwell > 0 ? Math.round((seconds * 100.0f) / totalDwell) : 25;

                result.add(AnalyticsOverviewDto.CarDwellItemDto.builder()
                        .car(carName)
                        .time(timeStr)
                        .pct(pct + "%")
                        .color(colors[idx % colors.length])
                        .favColor(favColors[idx % favColors.length])
                        .build());
                idx++;
                if (result.size() >= 4) break;
            }
            return result;
        }

        // Trả về danh sách rỗng nếu chưa có dữ liệu dwell time thực tế
        return List.of();
    }

    private List<AnalyticsOverviewDto.AiTrendItemDto> buildAiTrendList() {
        List<YeuCauTuVan> requests = yeuCauTuVanRepository.findAll();
        Map<String, Long> trendMap = requests.stream()
                .filter(r -> r.getNoiDungCanTuVan() != null && !r.getNoiDungCanTuVan().trim().isEmpty())
                .collect(Collectors.groupingBy(
                        r -> r.getNoiDungCanTuVan().trim(),
                        Collectors.counting()
                ));

        if (trendMap.isEmpty()) {
            return List.of();
        }

        long totalRequests = trendMap.values().stream().mapToLong(Long::longValue).sum();

        return trendMap.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(4)
                .map(entry -> {
                    int queries = entry.getValue().intValue();
                    String pct = totalRequests > 0
                            ? String.format("%.0f%%", (queries * 100.0) / totalRequests)
                            : "0%";
                    return AnalyticsOverviewDto.AiTrendItemDto.builder()
                            .topic(entry.getKey())
                            .queries(queries)
                            .pct(pct)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
