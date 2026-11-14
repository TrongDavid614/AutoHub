package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpiMetricDto {
    private String id;
    private String title;
    private String value;
    private Double numericValue;
    private Double changePercent;
    private Boolean isPositive;
    private String targetLabel;
    private String subtitle;
    private List<Double> sparklineData;
    private String badgeText;
    private String badgeType; // success, warning, info, danger
}
