package com.autohub.modules.admin.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAiCopilotResponse {

    private String answer;
    private List<String> sources;
    private Long responseTimeMs;
}
