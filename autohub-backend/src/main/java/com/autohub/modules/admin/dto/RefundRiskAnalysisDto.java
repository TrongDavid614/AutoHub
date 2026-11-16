package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundRiskAnalysisDto {
    private Long refundId;
    private String docketCode;
    private String riskLevel; // LOW, MEDIUM, HIGH
    private Integer riskScore; // 0 - 100
    private Double hoursElapsed;
    private Boolean within72Hours;
    private Integer priorRefundsCount;
    private String vinStatus;
    private String summary;
    private String recommendation; // APPROVE, REJECT, MANUAL_AUDIT
    private Integer latencyMs;
}
