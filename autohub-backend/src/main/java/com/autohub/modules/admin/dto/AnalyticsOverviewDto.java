package com.autohub.modules.admin.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewDto {

    private Integer avgDwellTimeSeconds;
    private String interact360Percentage;
    private String calculatorLoanPercentage;
    private Integer aiConsultantQueries;
    private Integer aiAverageLatencyMs;
    private List<CarDwellItemDto> dwellByCar;
    private List<AiTrendItemDto> aiTrends;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CarDwellItemDto {
        private String car;
        private String time;
        private String pct;
        private String color;
        private String favColor;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiTrendItemDto {
        private String topic;
        private Integer queries;
        private String pct;
    }
}
