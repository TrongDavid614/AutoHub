package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemMonitorHealthDto {
    private OpenRouterHealthDto openRouter;
    private VectorDbHealthDto vectorDb;
    private PaymentGatewayHealthDto paymentGateway;
    private List<CronJobHealthDto> cronJobs;
    private ServerMetricsDto serverMetrics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpenRouterHealthDto {
        private String model;
        private String status; // ONLINE, DEGRADED, OFFLINE
        private String apiEndpoint;
        private Integer responseTimeMs;
        private String contextWindow;
        private Double successRate;
        private String lastChecked;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VectorDbHealthDto {
        private String engine;
        private String status; // CONNECTED, DISCONNECTED
        private Integer indexedEmbeddingsCount;
        private Integer queryLatencyMs;
        private String lastSync;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentGatewayHealthDto {
        private String name;
        private String status; // LIVE, MAINTENANCE
        private String securityMethod;
        private Double uptimePercent;
        private Integer processed24h;
        private String lastWebhookAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CronJobHealthDto {
        private String name;
        private String description;
        private String schedule;
        private String lastRun;
        private String nextRun;
        private String status; // HEALTHY, RUNNING, WARNING, FAILED
        private Long executionCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServerMetricsDto {
        private Long jvmUsedMemoryMb;
        private Long jvmMaxMemoryMb;
        private Double jvmMemoryUsagePercent;
        private Integer activeDbConnections;
        private Integer maxDbConnections;
        private String databaseDialect;
        private String serverUptime;
    }
}

