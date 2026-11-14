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
public class RevenueDataPointDto {
    private String date; // YYYY-MM-DD
    private String dayLabel; // DD/MM
    private BigDecimal accessoryRevenue;
    private BigDecimal carDepositCashflow;
}
