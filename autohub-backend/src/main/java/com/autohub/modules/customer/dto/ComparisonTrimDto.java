package com.autohub.modules.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonTrimDto {
    private Long id;
    private String trimId;
    private String name;
    private String modelName;
    private String brandName;
    private BigDecimal price;
    private String priceFormatted;
    private BigDecimal depositAmount;
    private String depositFormatted;
    private String imageUrl;
    private String tag;
    private String badge;
    private String badgeVariant;
    private String segment;
    private String powertrain;
    private String seats;
    private Integer releaseYear;
}
