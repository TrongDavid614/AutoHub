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
public class AutoScheduleResultDto {
    private int totalShiftsCreated;
    private int totalStaffAssigned;
    private double coverageRate;
    private double avgShiftsPerStaff;
    private double avgHoursPerStaff;
    private String strategy;
    private String message;
    private List<AdminStaffScheduleDto> schedules;
}

