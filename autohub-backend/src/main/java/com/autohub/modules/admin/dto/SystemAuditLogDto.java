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
public class SystemAuditLogDto {
    private String id;
    private String time;
    private LocalDateTime timestamp;
    private String module; // AI_COPILOT, AI_SENTIMENT, SEPAY_WEBHOOK, STAFF_ACTION, CRON_JOB, SECURITY_AUTH, INVENTORY_AUDIT, DEPOSIT_AUDIT
    private String operator;
    private String action;
    private String result;
    private String status; // SUCCESS, WARNING, ERROR
    private String ipAddress;
    private String details;
}

