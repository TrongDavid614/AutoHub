package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankLoanPackageDto {
    private String id;

    @NotBlank(message = "Tên ngân hàng không được để trống")
    private String bank;

    @NotNull(message = "Lãi suất năm đầu không được để trống")
    @DecimalMin(value = "0.0", message = "Lãi suất năm đầu không được âm")
    private Double firstYearRate;

    @NotNull(message = "Lãi suất thả nổi không được để trống")
    @DecimalMin(value = "0.0", message = "Lãi suất thả nổi không được âm")
    private Double floatRate;

    @NotNull(message = "Kỳ hạn vay tối đa không được để trống")
    private Integer maxTenorYears;

    @NotNull(message = "Hạn mức cho vay không được để trống")
    private Integer maxLtvPercent;
}
