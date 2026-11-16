package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodayTimelineSlotDto {
    private String id;
    private String carModel;
    private String licensePlate;
    private String timeSlot;
    private String customerName;
    private String customerPhone;
    private String staffName;
    private String status;
}

