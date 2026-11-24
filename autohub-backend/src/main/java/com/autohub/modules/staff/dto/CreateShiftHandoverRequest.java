package com.autohub.modules.staff.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateShiftHandoverRequest {
    private String shiftType;
    private String shiftCode;

    @NotNull(message = "Vui lòng chọn nhân viên tiếp nhận ca")
    private Long receiverId;

    private Integer pendingLeadsCount;
    private Boolean demoKeysVerified;
    private Integer packedOrdersHandedOver;
    private String notes;
}
