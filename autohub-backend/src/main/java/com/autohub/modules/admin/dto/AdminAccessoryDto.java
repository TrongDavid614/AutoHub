package com.autohub.modules.admin.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private String status;
    private String imageUrl;
    private String installationGuide;
    private boolean isUniversal;
    private boolean isActive;
}
