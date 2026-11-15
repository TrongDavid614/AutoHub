package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVoucherRequest {

    @NotBlank(message = "Mã voucher không được để trống")
    private String code;

    @Min(value = 1, message = "Phần trăm giảm tối thiểu là 1%")
    @Max(value = 100, message = "Phần trăm giảm tối đa là 100%")
    private Double discountPercent;

    @DecimalMin(value = "0.0", message = "Mức giảm tối đa không được âm")
    private BigDecimal maxDiscountAmount;

    private LocalDate expiryDate;

    @Builder.Default
    private Boolean active = true;
}
