package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardOverviewDto {
    private List<KpiMetricDto> kpis;
    private List<RevenueDataPointDto> revenueChart;
    private List<RegionalRevenueDto> regionalRevenues;
    private List<UrgentDepositDto> urgentDeposits;
}
