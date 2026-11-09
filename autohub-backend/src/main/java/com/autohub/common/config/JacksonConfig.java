package com.autohub.common.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Hibernate6Module hibernate6Module() {
        Hibernate6Module module = new Hibernate6Module();
        // Không ép buộc lazy load nếu chưa fetch để tránh LazyInitializationException
        module.configure(Hibernate6Module.Feature.FORCE_LAZY_LOADING, false);
        return module;
    }
}

