package com.autohub.modules.admin.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminVoucherDto {
    private Long id;
    private String code;
    private String title;
    private Double discountPercentage;
    private BigDecimal maxDiscount;
    private String formattedDiscount;
    private String minOrderFormatted;
    private Integer usageCount;
    private Integer maxUsage;
    private Integer usagePercent;
    private LocalDate expiryDate;
    private boolean isActive;
    private String status;
}
