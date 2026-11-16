package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftSwapRequestDto {
    private String id;
    private Long requesterId;
    private String requesterName;
    private String requesterCode;
    private Long requesterScheduleId;
    private String currentDate;
    private String currentShift;
    private Long targetStaffId;
    private String targetStaffName;
    private String targetStaffCode;
    private Long targetScheduleId;
    private String targetDate;
    private String targetShift;
    private String reason;
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime createdAt;
}

