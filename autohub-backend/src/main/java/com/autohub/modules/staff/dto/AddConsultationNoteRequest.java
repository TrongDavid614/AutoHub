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
public class AddConsultationNoteRequest {
    @NotBlank(message = "Nội dung ghi chú không được để trống")
    private String note;
}

