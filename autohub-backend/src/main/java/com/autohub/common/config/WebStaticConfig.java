package com.autohub.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Configuration
public class WebStaticConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get("uploads");
        String uploadAbsolutePath = uploadDir.toFile().getAbsolutePath();
        String uploadLocation = "file:" + uploadAbsolutePath + File.separator;

        log.info("[WebStaticConfig] Cấu hình phục vụ file tĩnh /uploads/** từ: {}", uploadLocation);

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(
                        uploadLocation,
                        "file:uploads/",
                        "file:./uploads/",
                        "file:/app/uploads/"
                );
    }
}
