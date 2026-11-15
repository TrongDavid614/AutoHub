package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HourlyTestDriveSlotDto {
    private String slot;
    private int count;
    private int max;
    private String label;
    private boolean highlight;
}

