package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProbeOpenRouterResponseDto {
    private String status; // ONLINE, DEGRADED, OFFLINE
    private String model;
    private Long responseTimeMs;
    private String endpoint;
    private String message;
    private LocalDateTime probedAt;
}

