package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftHandoverDto {
    private String id;
    private String handoverCode;
    private String shiftCode;
    private String shiftType;
    private String date;
    private String handedOverBy;
    private String receivedBy;
    private Integer pendingLeadsCount;
    private Boolean demoKeysVerified;
    private Integer packedOrdersHandedOver;
    private String notes;
    private String createdAt;
}
