package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TriggerCronJobRequestDto {
    @NotBlank(message = "Tên tác vụ daemon không được để trống")
    private String jobName;
}

