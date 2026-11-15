package com.autohub.modules.admin.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminRefundDto {
    private Long id;
    private String docketCode;
    private String depositCode;
    private String customerName;
    private String identityCardNumber;
    private String car;
    private String amount;
    private String reason;
    private String deadlineStatus;
    private String staffVerifier;
    private String status;
    private String rejectionReason;
    private String minhChungUrl;
    private String submittedAt;
    private String processedAt;
}
