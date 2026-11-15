package com.autohub.modules.staff.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDemoOdoRequest {
    @NotNull(message = "Chỉ số ODO không được để trống")
    @Min(value = 0, message = "Chỉ số ODO không được âm")
    private Integer newOdo;
}

