package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewSentimentAnalysisRequest {

    @NotBlank(message = "Nội dung nhận xét cần phân tích ngữ nghĩa không được để trống")
    private String content;
}
