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
public class StaffRefundDocketDto {
    private String id;
    private String docketCode;
    private String depositCode;
    private String customerName;
    private String identityCardNumber;
    private String carModel;
    private Double depositAmount;
    private String reason;
    private String reasonType;
    private String rejectionReason;
    private String bankName;
    private String bankAccountNumber;
    private String bankAccountHolder;
    private String submittedAt;
    private String status;
    private List<String> evidenceUrls;
}

