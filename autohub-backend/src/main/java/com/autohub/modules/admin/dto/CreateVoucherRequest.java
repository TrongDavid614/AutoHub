package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateVoucherRequest {
    @NotBlank(message = "Mã voucher không được để trống")
    private String maVoucher;

    @PositiveOrZero(message = "Phần trăm giảm phải từ 0 trở lên")
    private Double phanTramGiam;

    @PositiveOrZero(message = "Mức giảm tối đa phải từ 0 trở lên")
    private BigDecimal giamToiDa;

    @NotNull(message = "Vui lòng chọn ngày hết hạn")
    private LocalDate ngayHetHan;

    private Boolean dangHoatDong;
}
