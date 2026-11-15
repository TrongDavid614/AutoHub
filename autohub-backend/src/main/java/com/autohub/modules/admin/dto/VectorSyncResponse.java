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
public class VectorSyncResponse {
    private int totalSynced;
    private int latencyMs;
    private LocalDateTime syncedAt;
    private String message;
}
