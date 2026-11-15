package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceUrgentDepositDto {
    private String id;
    private String depositCode;
    private String customerName;
    private String customerPhone;
    private String carModel;
    private String variant;
    private Double depositAmount;
    private Long remainingSeconds;
    private String assignedVin;
    private String status;
}

