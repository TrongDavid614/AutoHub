package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.DecimalMin;
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
public class UpdateRegistrationFeeRequest {

    @DecimalMin(value = "0.0", message = "Tỷ lệ phí trước bạ không được âm")
    private Double registrationTaxRate;

    @DecimalMin(value = "0.0", message = "Lệ phí cấp biển số không được âm")
    private BigDecimal licensePlateFee;

    @DecimalMin(value = "0.0", message = "Phí đăng kiểm không được âm")
    private BigDecimal inspectionFee;

    @DecimalMin(value = "0.0", message = "Phí bảo trì đường bộ không được âm")
    private BigDecimal roadMaintenanceFee;

    @DecimalMin(value = "0.0", message = "Phí bảo hiểm TNDS không được âm")
    private BigDecimal mandatoryInsuranceFee;

    private LocalDate effectiveDate;

    private LocalDate expiryDate;
}
