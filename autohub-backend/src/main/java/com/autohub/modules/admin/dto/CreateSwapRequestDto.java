package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSwapRequestDto {
    @NotNull(message = "ID nhân viên yêu cầu không được để trống")
    private Long requesterId;

    @NotNull(message = "ID ca trực hiện tại không được để trống")
    private Long requesterScheduleId;

    @NotNull(message = "ID nhân viên đổi ca không được để trống")
    private Long targetStaffId;

    private Long targetScheduleId;

    @NotBlank(message = "Lý do đổi ca không được để trống")
    private String reason;
}

