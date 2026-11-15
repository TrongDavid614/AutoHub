package com.autohub.modules.customer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonSpecRowDto {
    private String id;
    private String label;
    private String sublabel;
    private String unit;

    @JsonProperty("isDifferent")
    private boolean isDifferent;

    @JsonProperty("isTelemetryHighlight")
    private boolean isTelemetryHighlight;

    private Map<String, String> values;
    private Map<String, String> subValues;

    // Backward compatibility helper fields for legacy callers
    private String standardVal;
    private String standardSub;
    private String performanceVal;
    private String performanceSub;
    private String trackVal;
    private String trackSub;
}
