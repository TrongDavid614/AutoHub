package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeeStatsDto {
    private int totalProvinces;
    private int configuredProvinces;
    private Double avgRegistrationTaxRate;
    private Double evTaxRate;
    private int totalBankPartners;
    private Double lowestInterestRate;
    private int maxLtv;
}
