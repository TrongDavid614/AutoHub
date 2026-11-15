package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffWorkspaceDto {
    private List<StaffKpiStatDto> kpis;
    private List<HourlyTestDriveSlotDto> hourlyTestDrives;
    private int totalTestDrivesCount;
    private List<DepositStatusSegmentDto> depositBreakdown;
    private int totalDepositsCount;
    private List<TodayTimelineSlotDto> todayTimeline;
    private List<WorkspaceUrgentDepositDto> urgentDeposits;
    private WorkspaceSidebarCountsDto sidebarCounts;
}

