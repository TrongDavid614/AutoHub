package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutoScheduleRequest {
    private Long showroomId; // null = all showrooms
    private LocalDate startDate; // Ngày thứ hai đầu tuần
    private Integer maxShiftsPerStaff; // Mặc định 5
    private String strategy; // "BALANCED", "WEEKEND_HEAVY"
    private Boolean replaceExisting; // Mặc định true
}

