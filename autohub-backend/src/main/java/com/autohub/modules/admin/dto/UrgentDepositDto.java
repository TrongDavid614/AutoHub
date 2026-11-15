package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrgentDepositDto {
    private String id;
    private String depositCode;
    private String customerName;
    private String customerPhone;
    private String carModel;
    private String variant;
    private String color;
    private BigDecimal depositAmount;
    private Long remainingSeconds;
    private String assignedStaff;
    private String assignedShowroom;
    private String sepayTxnRef;
    private String vnpayTxnRef;
    private String status; // PENDING_VIN, PENDING_CONTRACT
}
