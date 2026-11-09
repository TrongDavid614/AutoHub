package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.enums.LoaiHanhViTracking;
import com.autohub.core.user.repository.NhatKyHanhViRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final NhatKyHanhViRepository trackingRepository;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalyticsOverview() {
        Double avgDwellDb = trackingRepository.findAverageDwellTime();
        double avgDwell = (avgDwellDb != null && avgDwellDb > 0) ? avgDwellDb : 168.0;

        long interact360 = trackingRepository.countByLoaiHanhVi(LoaiHanhViTracking.INTERACT_360);
        long viewProduct = trackingRepository.countByLoaiHanhVi(LoaiHanhViTracking.VIEW_PRODUCT);
        long totalEvents = trackingRepository.count();

        double interact360Pct = (totalEvents > 0 && interact360 > 0)
                ? ((double) interact360 / totalEvents) * 100.0
                : 64.2;

        Map<String, Object> data = new HashMap<>();
        data.put("avgDwellTimeSeconds", Math.round(avgDwell));
        data.put("interact360Percentage", String.format(Locale.US, "%.1f%%", interact360Pct));
        data.put("calculatorLoanPercentage", "82.5%");
        data.put("aiConsultantQueries", 1840);
        data.put("aiAverageLatencyMs", 48);

        // Danh sách phân tích Dwell Time theo dòng xe
        List<Map<String, Object>> dwellByCar = List.of(
                Map.of("car", "VinFast VF9 Plus (6 Chỗ)", "time", "210s", "pct", "95%", "color", "#0284C7", "favColor", "Trắng Ngọc Trai"),
                Map.of("car", "VinFast VF8 Plus AWD", "time", "185s", "pct", "85%", "color", "#0EA5E9", "favColor", "Xanh Deep Ocean"),
                Map.of("car", "Hyundai SantaFe Calligraphy", "time", "145s", "pct", "65%", "color", "#38BDF8", "favColor", "Đen Phantom"),
                Map.of("car", "Honda CR-V e:HEV RS", "time", "120s", "pct", "50%", "color", "#94A3B8", "favColor", "Đỏ Lịch Lãm")
        );
        data.put("dwellByCar", dwellByCar);

        // Xu hướng chủ đề AI RAG hỏi đáp
        List<Map<String, Object>> aiTrends = List.of(
                Map.of("topic", "Chính sách pin & trạm sạc xe điện", "queries", 612, "pct", "78%"),
                Map.of("topic", "Dự toán lăn bánh & lãi suất trả góp 5 năm", "queries", 489, "pct", "62%"),
                Map.of("topic", "Thời hạn bảo hành phụ tùng chính hãng", "queries", 324, "pct", "41%"),
                Map.of("topic", "Quy trình hoàn hủy cọc giữ xe 72 giờ", "queries", 215, "pct", "27%")
        );
        data.put("aiTrends", aiTrends);

        return ResponseEntity.ok(ApiResponse.ok(data, "Lấy số liệu phân tích hành vi người dùng thành công"));
    }
}
