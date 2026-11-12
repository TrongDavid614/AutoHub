package com.autohub.integration.openrouter.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageHistoryDto {
    private String role; // "user", "assistant", "system"
    private String content;
}
