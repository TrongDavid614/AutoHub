package com.autohub.core.ai.config;

import com.autohub.core.ai.tools.AccessoryCompatibilityTool;
import com.autohub.core.ai.tools.CarSpecificationTool;
import com.autohub.core.ai.tools.InventoryCheckTool;
import com.autohub.core.ai.tools.RegistrationFeeCalculatorTool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class AiConfig {

    public static final String SYSTEM_PROMPT = """
        Bạn là Chuyên gia Tư vấn Cấp cao kiêm Trợ lý Thông minh của AutoHub - Nền tảng Thương mại Điện tử Ô tô & Phụ kiện Hàng đầu.
        Nhiệm vụ của bạn:
        1. Hỗ trợ khách hàng tư vấn các dòng xe hơi, so sánh thông số kỹ thuật, khả năng vận hành, dung lượng pin và tính năng an toàn.
        2. Khi khách hàng hỏi về thông số, giá bán, tồn kho hoặc chi phí lăn bánh, BẮT BUỘC sử dụng các Tools hệ thống được cung cấp:
           - CarSpecificationTool: Lấy thông số kỹ thuật xe chính xác từ dbo.phien_ban_xe.
           - InventoryCheckTool: Kiểm tra số lượng xe thực tế trong kho từ dbo.ton_kho_xe.
           - RegistrationFeeCalculatorTool: Tính toán chính xác dự toán chi phí lăn bánh theo từng tỉnh thành từ dbo.bieu_phi_lan_banh.
           - AccessoryCompatibilityTool: Tìm kiếm phụ kiện chính hãng tương thích từ dbo.phu_kien.
        3. Tuyệt đối không tự bịa đặt giá cả hay số lượng tồn kho nếu chưa tra cứu qua Tools.
        4. Phong cách giao tiếp: Chuyên nghiệp, lịch thiệp, am hiểu kỹ thuật và luôn đưa ra lời khuyên thực tế, hữu ích cho khách hàng.
        5. Luôn phản hồi bằng Tiếng Việt chuẩn mực.
        """;

    @Bean
    public org.springframework.boot.web.client.RestClientCustomizer openRouterRestClientCustomizer() {
        return restClientBuilder -> restClientBuilder
                .defaultHeader("HTTP-Referer", "https://autohub.vn")
                .defaultHeader("X-Title", "AutoHub AI Consultant");
    }

    @org.springframework.context.annotation.Primary
    @Bean
    public ChatClient chatClient(
            ChatClient.Builder builder,
            CarSpecificationTool carSpecificationTool,
            InventoryCheckTool inventoryCheckTool,
            RegistrationFeeCalculatorTool registrationFeeCalculatorTool,
            AccessoryCompatibilityTool accessoryCompatibilityTool
    ) {
        log.info("[Spring AI] Khởi tạo ChatClient với 4 Tools Function Calling trên AutoHubDB");
        return builder
                .defaultSystem(SYSTEM_PROMPT)
                .defaultTools(
                        carSpecificationTool,
                        inventoryCheckTool,
                        registrationFeeCalculatorTool,
                        accessoryCompatibilityTool
                )
                .build();
    }

    @Bean(name = "plainChatClient")
    public ChatClient plainChatClient(ChatClient.Builder builder) {
        log.info("[Spring AI] Khởi tạo Plain ChatClient (Direct Chat không tools) với Google Gemini");
        return builder
                .defaultSystem(SYSTEM_PROMPT)
                .build();
    }
}
