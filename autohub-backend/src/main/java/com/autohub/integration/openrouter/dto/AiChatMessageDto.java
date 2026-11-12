package com.autohub.integration.openrouter.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AiChatMessageDto {
    private String id;
    private String sender; // "AI" hoặc "USER"
    private String senderTitle; // Tên hiển thị (kèm model đang phục vụ)
    private String timestamp;
    private String avatarText;
    private String content;
    private String currentModel; // Model OpenRouter vừa xử lý câu hỏi
    private FunctionCallNotificationDto functionCall;
    private String rationale;
    private List<String> suggestedPrompts;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FunctionCallNotificationDto {
        private String querySegment;
        private String priceRange;
        private Double matchPercentage;
    }
}
