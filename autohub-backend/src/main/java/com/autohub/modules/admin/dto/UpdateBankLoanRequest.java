package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBankLoanRequest {

    private String bankName;

    private String bankCode;

    private String logoUrl;

    @DecimalMin(value = "0.0", message = "Lãi suất năm đầu không được âm")
    private Double firstYearRate;

    @DecimalMin(value = "0.0", message = "Lãi suất thả nổi không được âm")
    private Double floatingRate;

    @Min(value = 1, message = "Kỳ hạn vay tối đa ít nhất 1 năm")
    private Integer maxTenorYears;

    @Min(value = 1, message = "Hạn mức vay ít nhất 1%")
    private Integer maxLtvPercent;

    private String note;

    private Boolean active;
}
