package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminRegistrationFeeDto {
    private Long id;
    private Long provinceId;
    private String provinceName;
    private String region;
    private String licensePlateZone;
    private Double registrationTaxRate;
    private Double electricTaxRate;
    private BigDecimal licensePlateFee;
    private BigDecimal inspectionFee;
    private BigDecimal roadMaintenanceFee;
    private BigDecimal mandatoryInsuranceFee;
    private LocalDate effectiveDate;
    private LocalDate expiryDate;
    private boolean active;
}
