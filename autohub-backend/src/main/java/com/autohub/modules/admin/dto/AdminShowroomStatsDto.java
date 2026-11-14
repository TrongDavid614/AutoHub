package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminShowroomStatsDto {
    private int totalShowrooms;
    private int activeShowrooms;
    private int inactiveShowrooms;
    private int totalDemoFleet;
    private int readyDemoFleet;
    private int totalPhysicalInventory;
    private int totalReservedInventory;
    private int totalStaff;
    private Map<String, Integer> regionDistribution;
}
