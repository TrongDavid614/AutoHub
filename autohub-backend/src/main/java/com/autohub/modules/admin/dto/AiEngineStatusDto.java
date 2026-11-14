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
public class AiEngineStatusDto {
    private GeminiStatusDto gemini;
    private VectorDbStatusDto vectorDb;
    private PaymentGatewayStatusDto paymentGateway;
    private List<CronJobStatusDto> cronJobs;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiStatusDto {
        private String model;
        private String status; // ONLINE, OFFLINE, DEGRADED
        private String apiEndpoint;
        private Integer responseTimeMs;
        private Integer quotaUsedPercent;
        private String contextWindow;
        private Double successRate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VectorDbStatusDto {
        private String engine;
        private String status; // CONNECTED, DISCONNECTED
        private Integer indexedEmbeddingsCount;
        private Integer queryLatencyMs;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentGatewayStatusDto {
        private String name;
        private String status; // LIVE, MAINTENANCE
        private Double uptimePercent;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CronJobStatusDto {
        private String name;
        private String schedule;
        private String lastRun;
        private String status; // HEALTHY, RUNNING, FAILED
    }
}
