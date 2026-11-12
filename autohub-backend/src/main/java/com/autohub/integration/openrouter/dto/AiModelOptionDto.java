package com.autohub.integration.openrouter.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiModelOptionDto {
    private String id;
    private String name;
    private String provider;
    private boolean isFree;
    private boolean active;
}
