package com.autohub.modules.admin.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAccessoryDto {

    private Long id;
    private String sku;
    private String name;
    private Long categoryId;
    private String categoryName;
    private String brand;
    private BigDecimal price;
    private Integer stock;
    private Integer minThreshold;
    private String installationSpec;
    private String imageUrl;
    private boolean universal;
    private boolean active;
    private String stockStatus; // "Còn hàng", "Sắp hết hàng", "Hết hàng"
}
