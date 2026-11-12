package com.autohub.integration.openrouter.dto.openrouter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

public class OpenRouterWireDtos {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OpenRouterRequest {
        private String model;
        private List<OpenRouterMessage> messages;
        @Builder.Default
        private Double temperature = 0.7;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OpenRouterMessage {
        private String role; // "system", "user", "assistant"
        private String content;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OpenRouterResponse {
        private String id;
        private String model;
        private List<OpenRouterChoice> choices;
        private OpenRouterUsage usage;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OpenRouterChoice {
        private Integer index;
        private OpenRouterMessage message;
        private String finish_reason;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OpenRouterUsage {
        private Integer prompt_tokens;
        private Integer completion_tokens;
        private Integer total_tokens;
    }
}
