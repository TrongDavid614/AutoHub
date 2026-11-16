package com.autohub.modules.staff.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HandoverCourierRequest {
    @NotBlank(message = "Đơn vị vận chuyển không được để trống")
    private String courier;

    private String trackingNumber;
}

