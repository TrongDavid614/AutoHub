package com.autohub.modules.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonBenchmarkMetricDto {
    private String id;
    private String title;
    private String icon;
    private String rangeText;
    private Map<String, Integer> scores;
    private Map<String, String> labels;
}
