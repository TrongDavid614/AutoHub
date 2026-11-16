package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffScheduleStatsDto {
    private int totalShiftsThisWeek;
    private int testDriveShifts;
    private int warehouseShifts;
    private int salesShifts;
    private int supervisorShifts;
    private int pendingSwapRequests;
    private String coverageRate;
    private int activeStaffCount;
}

