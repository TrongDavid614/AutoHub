package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
public class CreateBankLoanRequest {

    @NotBlank(message = "Tên ngân hàng liên kết không được để trống")
    private String bankName;

    private String bankCode;

    private String logoUrl;

    @NotNull(message = "Vui lòng nhập lãi suất năm đầu")
    @DecimalMin(value = "0.0", message = "Lãi suất năm đầu không được âm")
    private Double firstYearRate;

    @NotNull(message = "Vui lòng nhập lãi suất thả nổi")
    @DecimalMin(value = "0.0", message = "Lãi suất thả nổi không được âm")
    private Double floatingRate;

    @NotNull(message = "Vui lòng nhập kỳ hạn vay tối đa")
    @Min(value = 1, message = "Kỳ hạn vay tối đa ít nhất 1 năm")
    private Integer maxTenorYears;

    @NotNull(message = "Vui lòng nhập hạn mức vay (LTV)")
    @Min(value = 1, message = "Hạn mức vay ít nhất 1%")
    private Integer maxLtvPercent;

    private String note;

    @Builder.Default
    private Boolean active = true;
}
