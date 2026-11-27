package com.autohub.common.config;

import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.core.LockProvider;
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import javax.sql.DataSource;

@Slf4j
@Configuration
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "10m")
public class SchedulingConfig {

    /**
     * Cấu hình ThreadPool đa luồng cho TaskScheduler (Phần 1).
     * Mặc định Spring Boot chỉ dùng 1 luồng duy nhất khiến các job dễ bị block lẫn nhau.
     * Cấu hình 5 worker threads cho phép chạy song song các tác vụ quét cọc, dọn đơn và gửi email.
     */
    @Bean(name = "taskScheduler")
    public ThreadPoolTaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(5);
        scheduler.setThreadNamePrefix("AutoHub-Cron-");
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(30);
        scheduler.setErrorHandler(throwable ->
                log.error("[TaskScheduler] Lỗi không xử lý được trong tiến trình lập lịch: ", throwable)
        );
        scheduler.initialize();
        log.info("[SchedulingConfig] Đã khởi tạo ThreadPoolTaskScheduler với pool-size: 5 (Multi-threaded Production Ready)");
        return scheduler;
    }

    /**
     * Cấu hình ShedLock Provider dựa trên JDBC (SQL Server).
     * Đảm bảo khi scale-out nhiều replica Backend container, 1 cron job chỉ chạy trên 1 node duy nhất (Hướng 1).
     */
    @Bean
    public LockProvider lockProvider(DataSource dataSource) {
        initShedLockTableIfNotExists(dataSource);

        return new JdbcTemplateLockProvider(
                JdbcTemplateLockProvider.Configuration.builder()
                        .withJdbcTemplate(new JdbcTemplate(dataSource))
                        .usingDbTime() // Đồng bộ thời gian qua SQL Server database time
                        .build()
        );
    }

    private void initShedLockTableIfNotExists(DataSource dataSource) {
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            String ddl = """
                IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[shedlock]') AND type in (N'U'))
                BEGIN
                    CREATE TABLE [dbo].[shedlock](
                        [name] [varchar](64) NOT NULL,
                        [lock_until] [datetime2](3) NOT NULL,
                        [locked_at] [datetime2](3) NOT NULL,
                        [locked_by] [varchar](255) NOT NULL,
                        PRIMARY KEY CLUSTERED ([name] ASC)
                    );
                END
            """;
            jdbcTemplate.execute(ddl);
            log.info("[SchedulingConfig] Khởi tạo / kiểm tra bảng 'shedlock' thành công trên SQL Server.");
        } catch (Exception e) {
            log.warn("[SchedulingConfig] Không thể tự động tạo bảng shedlock (nếu đã có có thể bỏ qua): {}", e.getMessage());
        }
    }
}
