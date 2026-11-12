package com.autohub.integration.openrouter.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatRequest {
    private String prompt;
    private String model; // Cho phép client chuyển đổi OpenRouter model
    private List<ChatMessageHistoryDto> history;
}
