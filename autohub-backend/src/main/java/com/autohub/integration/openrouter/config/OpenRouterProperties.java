package com.autohub.integration.openrouter.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "openrouter")
public class OpenRouterProperties {
    private String apiKey = "";
    private String baseUrl = "https://openrouter.ai/api/v1";
    private String defaultModel = "liquid/lfm-3-1.7b:free";
    private String siteUrl = "http://localhost:5173";
    private String appName = "AutoHub";

    /**
     * Danh sách model dự phòng tự động chuyển đổi khi rảnh rỗi hoặc khi model chính bị nghẽn/rate-limited
     */
    private List<String> fallbackModels = new ArrayList<>(List.of(
            "liquid/lfm-3-1.7b:free",
            "google/gemma-4-31b-it:free",
            "nvidia/nemotron-3.5-super-vl:free",
            "deepseek/deepseek-chat",
            "google/gemini-2.0-flash-001",
            "openai/gpt-4o-mini"
    ));

    /**
     * Tự động bật tối ưu hóa model khi hệ thống nhàn rỗi
     */
    private boolean idleOptimizationEnabled = true;
}
