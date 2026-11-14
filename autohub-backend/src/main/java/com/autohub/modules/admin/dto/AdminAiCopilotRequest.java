package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAiCopilotRequest {

    @NotBlank(message = "Câu hỏi hoặc truy vấn của Quản trị viên không được để trống")
    private String query;
}
