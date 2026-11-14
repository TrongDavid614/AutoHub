package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionalRevenueDto {
    private String region;
    private String showroomName;
    private BigDecimal revenue;
    private String formattedRevenue;
    private Double percentage;
    private String color;
    private Integer staffCount;
    private Integer ordersCount;
}
