package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceSidebarCountsDto {
    private long totalLeads;
    private long pendingLeads;
    private long totalTestDrives;
    private long totalDeposits;
    private long activeDeposits;
    private long pendingRefunds;
    private long pendingOrders;
}

