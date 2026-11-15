package com.autohub.modules.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarComparisonResponseDto {
    private List<ComparisonTrimDto> trims;
    private List<ComparisonSpecGroupDto> specGroups;
    private List<ComparisonBenchmarkMetricDto> benchmarkMetrics;
}
