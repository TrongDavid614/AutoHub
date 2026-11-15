package com.autohub.modules.admin.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminVoucherDto {

    private Long id;
    private String code;
    private Double discountPercent;
    private BigDecimal maxDiscountAmount;
    private LocalDate expiryDate;
    private boolean active;
    private String statusText; // "Đang chạy", "Tạm dừng", "Đã hết hạn"
    private boolean expired;
}
