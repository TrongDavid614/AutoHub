package com.autohub.modules.admin.service;

import com.autohub.modules.admin.dto.*;

import java.util.List;

public interface AdminSystemMonitorService {
    SystemMonitorHealthDto getSystemHealth();
    ProbeOpenRouterResponseDto probeOpenRouter();
    List<SystemAuditLogDto> getAuditLogs(String module, String status, String keyword, Integer limit);
    TriggerCronJobResponseDto triggerCronJob(String jobName);
    byte[] exportAuditLogsCsv(String module, String status, String keyword);
    void recordAuditLog(String module, String operator, String action, String result, String status, String ipAddress, String details);
}

