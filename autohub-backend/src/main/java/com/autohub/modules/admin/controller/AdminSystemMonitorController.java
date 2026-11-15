package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.modules.admin.dto.*;
import com.autohub.modules.admin.service.AdminSystemMonitorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin/system-monitor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSystemMonitorController {

    private final AdminSystemMonitorService systemMonitorService;

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<SystemMonitorHealthDto>> getSystemHealth() {
        SystemMonitorHealthDto health = systemMonitorService.getSystemHealth();
        return ResponseEntity.ok(ApiResponse.ok(health, "Lấy thông tin giám sát sức khỏe hệ thống thành công"));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<SystemAuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "50") Integer limit
    ) {
        List<SystemAuditLogDto> logs = systemMonitorService.getAuditLogs(module, status, keyword, limit);
        return ResponseEntity.ok(ApiResponse.ok(logs, "Lấy danh sách nhật ký kiểm toán thành công"));
    }

    @PostMapping("/probe-ai")
    public ResponseEntity<ApiResponse<ProbeOpenRouterResponseDto>> probeOpenRouter() {
        ProbeOpenRouterResponseDto probeResult = systemMonitorService.probeOpenRouter();
        return ResponseEntity.ok(ApiResponse.ok(probeResult, probeResult.getMessage()));
    }

    @PostMapping("/trigger-cron")
    public ResponseEntity<ApiResponse<TriggerCronJobResponseDto>> triggerCronJob(
            @Valid @RequestBody TriggerCronJobRequestDto request
    ) {
        TriggerCronJobResponseDto result = systemMonitorService.triggerCronJob(request.getJobName());
        return ResponseEntity.ok(ApiResponse.ok(result, result.getMessage()));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportAuditLogs(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword
    ) {
        byte[] csv = systemMonitorService.exportAuditLogsCsv(module, status, keyword);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"audit_trail_logs.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }
}

