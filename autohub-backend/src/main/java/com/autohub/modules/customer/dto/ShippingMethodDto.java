package com.autohub.modules.customer.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingMethodDto {
    private Long id;
    private String methodId;
    private String code;
    private String title;
    private String tag;
    private BigDecimal price;
    private String estimatedDelivery;
    private String subDescription;
    private BigDecimal freeThreshold;
    private Boolean isDefault;
}
