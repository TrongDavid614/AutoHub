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
public class ResolveReturnRequest {
    @NotBlank(message = "Phương án xử lý không được để trống")
    private String resolution;

    private String inspectionNotes;
}

