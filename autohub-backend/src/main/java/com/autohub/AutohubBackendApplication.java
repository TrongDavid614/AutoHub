package com.autohub;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class AutohubBackendApplication {

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
    }

    @Bean
    public CommandLineRunner normalizeTestDepositAmounts(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                int updated = jdbcTemplate.update(
                        "UPDATE phieu_dat_coc SET so_tien_coc = so_tien_coc * 1000 " +
                        "WHERE so_tien_coc > 0 AND so_tien_coc <= 100000"
                );
                if (updated > 0) {
                    System.out.println("[DataMigration] Đã tự động chuẩn hóa " + updated + " phiếu cọc từ số tiền test về giá trị thực tế.");
                }
            } catch (Exception ex) {
                System.out.println("[DataMigration] Lưu ý khi chuẩn hóa số tiền cọc: " + ex.getMessage());
            }
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(AutohubBackendApplication.class, args);
    }

}
