package com.autohub.core.ai.config;

import com.autohub.core.ai.tools.AccessoryCompatibilityTool;
import com.autohub.core.ai.tools.AccessoryOrderTool;
import com.autohub.core.ai.tools.BookTestDriveTool;
import com.autohub.core.ai.tools.CarSpecificationTool;
import com.autohub.core.ai.tools.CheckDepositPaymentTool;
import com.autohub.core.ai.tools.CreateCarDepositTool;
import com.autohub.core.ai.tools.InventoryCheckTool;
import com.autohub.core.ai.tools.RegistrationFeeCalculatorTool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.time.Duration;

@Slf4j
@Configuration
public class AiConfig {

        public static final String SYSTEM_PROMPT = """
                        Bạn là Chuyên gia Tư vấn Cấp cao kiêm Trợ lý Thông minh của AutoHub - Nền tảng Thương mại Điện tử Ô tô & Phụ kiện Hàng đầu.
                        Nhiệm vụ của bạn:
                        1. Hỗ trợ khách hàng tư vấn các dòng xe hơi, so sánh thông số kỹ thuật, khả năng vận hành, dung lượng pin và tính năng an toàn.
                        2. Khi khách hàng hỏi thông tin hoặc yêu cầu hành động, BẮT BUỘC sử dụng các Tools hệ thống được cung cấp:
                           - CarSpecificationTool: Lấy thông số kỹ thuật xe chính xác từ dbo.phien_ban_xe.
                           - InventoryCheckTool: Kiểm tra số lượng xe thực tế trong kho từ dbo.ton_kho_xe.
                           - RegistrationFeeCalculatorTool: Tính toán chính xác dự toán chi phí lăn bánh theo từng tỉnh thành từ dbo.bieu_phi_lan_banh.
                           - AccessoryCompatibilityTool: Tìm kiếm phụ kiện chính hãng tương thích từ dbo.phu_kien.
                           - AccessoryOrderTool: Thêm sản phẩm vào giỏ hàng hoặc tự động tạo đơn mua phụ kiện/linh kiện chính hãng.
                           - BookTestDriveTool: Đăng ký lịch hẹn trải nghiệm lái thử xe tại showroom vào dbo.lich_hen_lai_thu.
                           - CreateCarDepositTool: Lập phiếu đặt cọc giữ xe 72h và sinh mã VietQR chuyển khoản thanh toán vào dbo.phieu_dat_coc.
                           - CheckDepositPaymentTool: Kiểm tra trạng thái chuyển khoản tiền cọc SePay BIDV của khách hàng từ dbo.phieu_dat_coc.
                        3. Tuyệt đối không tự bịa đặt giá cả hay số lượng tồn kho nếu chưa tra cứu qua Tools.
                        4. Phong cách giao tiếp: Chuyên nghiệp, lịch thiệp, am hiểu kỹ thuật và luôn đưa ra lời khuyên thực tế, hữu ích cho khách hàng.
                        5. Luôn phản hồi bằng Tiếng Việt chuẩn mực.
                        """;

        /**
         * 1. Quản lý bộ nhớ hội thoại đa lượt (Multi-turn chat memory)
         * Lưu trữ các lượt hỏi-đáp trong bộ nhớ RAM theo conversationId
         */
        @Bean
        public ChatMemory chatMemory() {
                log.info("[Spring AI] Khởi tạo InMemoryChatMemory quản lý hội thoại đa lượt");
                return new InMemoryChatMemory();
        }

        /**
         * 2. Thiết lập Timeout mạng an toàn chống treo socket khi gọi API Google Gemini
         * Connect Timeout: 10 giây | Read Timeout: 45 giây
         */
        @Bean
        public RestClientCustomizer restClientCustomizer() {
                return restClientBuilder -> {
                        var factory = new SimpleClientHttpRequestFactory();
                        factory.setConnectTimeout(Duration.ofSeconds(10));
                        factory.setReadTimeout(Duration.ofSeconds(45));

                        restClientBuilder
                                        .requestFactory(factory)
                                        .defaultHeader("HTTP-Referer", "https://autohub.vn")
                                        .defaultHeader("X-Title", "AutoHub AI Consultant");
                };
        }

        /**
         * 3. ChatClient chính: Tích hợp đầy đủ Advisors (Logger, ChatMemory) và 4 Tools
         * CSDL SQL Server
         */
        /**
         * 3. ChatClient chính: Tích hợp đầy đủ Advisors và trọn bộ 7 Tools CSDL
         */
        @Primary
        @Bean
        public ChatClient chatClient(
                        ChatClient.Builder builder,
                        ChatMemory chatMemory,
                        CarSpecificationTool carSpecificationTool,
                        InventoryCheckTool inventoryCheckTool,
                        RegistrationFeeCalculatorTool registrationFeeCalculatorTool,
                        AccessoryCompatibilityTool accessoryCompatibilityTool,
                        AccessoryOrderTool accessoryOrderTool,
                        BookTestDriveTool bookTestDriveTool,
                        CreateCarDepositTool createCarDepositTool,
                        CheckDepositPaymentTool checkDepositPaymentTool) {
                log.info("[Spring AI] Khởi tạo ChatClient: Advisors (Logger, ChatMemory) + Trọn bộ 8 Tools CSDL");
                return builder
                                .defaultSystem(SYSTEM_PROMPT)
                                .defaultAdvisors(
                                                new SimpleLoggerAdvisor(),
                                                MessageChatMemoryAdvisor.builder(chatMemory).build())
                                .defaultTools(
                                                carSpecificationTool,
                                                inventoryCheckTool,
                                                registrationFeeCalculatorTool,
                                                accessoryCompatibilityTool,
                                                accessoryOrderTool,
                                                bookTestDriveTool,
                                                createCarDepositTool,
                                                checkDepositPaymentTool)
                                .build();
        }

        /**
         * 4. ChatClient phụ trợ (Plain ChatClient):
         * Dùng cho AiQueryRouter phân loại ý định và AiOrchestratorService tổng hợp câu
         * trả lời
         */
        @Bean(name = "plainChatClient")
        public ChatClient plainChatClient(ChatClient.Builder builder) {
                log.info("[Spring AI] Khởi tạo Plain ChatClient (không tools) cho Router & Orchestrator");
                return builder
                                .defaultSystem(SYSTEM_PROMPT)
                                .build();
        }
}