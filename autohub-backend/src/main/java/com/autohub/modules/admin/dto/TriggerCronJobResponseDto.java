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
public class TriggerCronJobResponseDto {
    private String jobName;
    private String status;
    private String message;
    private Long executionTimeMs;
    private LocalDateTime executedAt;
}

