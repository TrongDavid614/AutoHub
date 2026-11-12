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

    private List<ModelOption> supportedModels = new ArrayList<>();

    @Getter
    @Setter
    public static class ModelOption {
        private String id;
        private String name;
        private String provider;
        private boolean free;

        public ModelOption() {}

        public ModelOption(String id, String name, String provider, boolean free) {
            this.id = id;
            this.name = name;
            this.provider = provider;
            this.free = free;
        }
    }
}
