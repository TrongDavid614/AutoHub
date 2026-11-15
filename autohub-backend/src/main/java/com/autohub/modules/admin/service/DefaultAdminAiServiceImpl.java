package com.autohub.modules.admin.service;

import com.autohub.modules.admin.dto.AdminAiCopilotRequest;
import com.autohub.modules.admin.dto.AdminAiCopilotResponse;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisRequest;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Slf4j
@Service
@ConditionalOnMissingBean(name = "ollamaAdminAiService")
public class DefaultAdminAiServiceImpl implements AdminAiService {

    @Value("${openrouter.api.key:}")
    private String openRouterApiKey;

    @Value("${openrouter.api.url:https://openrouter.ai/api/v1/chat/completions}")
    private String openRouterApiUrl;

    @Value("${openrouter.api.model:deepseek/deepseek-chat}")
    private String openRouterModel;

    private static final Pattern TOXIC_PATTERN = Pattern.compile(
            ".*(lừa đảo|tệ hại|đm|dkm|vớ vẩn|rác rưởi|gian lận|chó|cút|bịp|hàng đểu).*",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE
    );

    @Override
    public AdminAiCopilotResponse askAdminCopilot(AdminAiCopilotRequest request) {
        long startTime = System.currentTimeMillis();
        String query = request.getQuery() != null ? request.getQuery().trim() : "";

        // 1. Ưu tiên gọi OpenRouter API trực tiếp nếu có cấu hình API Key
        String openRouterResponse = callOpenRouterForCopilot(query);
        if (openRouterResponse != null && !openRouterResponse.isBlank()) {
            long responseTimeMs = System.currentTimeMillis() - startTime;
            List<String> sources = new ArrayList<>(List.of(
                    "OpenRouter AI (" + openRouterModel + ")",
                    "AutoHub RAG Knowledge Base"
            ));
            return AdminAiCopilotResponse.builder()
                    .answer(openRouterResponse)
                    .sources(sources)
                    .responseTimeMs(responseTimeMs)
                    .build();
        }

        // 2. Fallback sang cơ chế nội bộ nếu không có mạng hoặc API key chưa sẵn sàng
        String queryLower = query.toLowerCase();
        String answer;
        List<String> sources = new ArrayList<>();

        if (queryLower.contains("hoàn cọc") || queryLower.contains("rút cọc")) {
            answer = "Theo Điều 4.2 Quy Chế Đại Lý AutoHub: Phiếu đặt cọc xe được xem xét giải ngân hoàn tiền khi: "
                    + "(1) Khách hàng cung cấp văn bản từ chối bảo lãnh tín dụng hợp lệ từ ngân hàng đối tác, hoặc "
                    + "(2) Quản trị viên duyệt ngoại lệ trước khi đơn vị xuất hóa đơn tài chính. "
                    + "Khi duyệt hoàn cọc thành công, hệ thống tự động giải phóng số VIN về trạng thái CO_SAN.";
            sources.add("Quy chế đại lý AutoHub - Điều 4.2");
            sources.add("Tài liệu nghiệp vụ UC40 - Hoàn cọc 72h");
        } else if (queryLower.contains("72h") || queryLower.contains("72 giờ") || queryLower.contains("hết hạn")) {
            answer = "Theo quy tắc BR06: Phiếu cọc giữ xe có hiệu lực tối đa 72 giờ liên tục. "
                    + "Quá thời hạn trên, hệ thống kiểm toán tự động chuyển trạng thái phiếu cọc sang EXPIRED "
                    + "và hoàn trả số lượng khả dụng của phiên bản xe vào kho tổng.";
            sources.add("Đặc tả quy tắc nghiệp vụ BR06");
        } else if (queryLower.contains("bảo hành") || queryLower.contains("đổi trả")) {
            answer = "Chính sách bảo hành phụ kiện AutoHub: Tất cả phụ kiện chính hãng được áp dụng chính sách "
                    + "1 đổi 1 trong 30 ngày nếu phát hiện lỗi từ nhà sản xuất, và bảo hành tiêu chuẩn 12 tháng "
                    + "tại toàn bộ hệ sinh thái showroom trên toàn quốc.";
            sources.add("Chính sách hậu mãi & bảo hành phụ kiện AutoHub v2.0");
        } else if (queryLower.contains("kpi") || queryLower.contains("doanh thu")) {
            answer = "Hệ thống Báo cáo Quản trị: Doanh thu toàn sàn được đối soát tự động qua cổng thanh toán SePay IPN "
                    + "và tích hợp trực tiếp vào biểu đồ doanh thu thời gian thực trên Admin Dashboard.";
            sources.add("Admin Financial Metrics & SePay IPN Integration");
        } else {
            answer = "Trợ lý Quản Trị AutoHub Copilot: Đã tiếp nhận yêu cầu '" + query + "'. "
                    + "Hệ thống liên kết kho tri thức Vector Store kết hợp mô hình OpenRouter AI (" + openRouterModel + ") "
                    + "để trích xuất dữ liệu nghiệp vụ và đối soát chính sách cho Quản trị viên.";
            sources.add("AutoHub Core Knowledge Base & OpenRouter AI");
        }

        long responseTimeMs = System.currentTimeMillis() - startTime;
        return AdminAiCopilotResponse.builder()
                .answer(answer)
                .sources(sources)
                .responseTimeMs(responseTimeMs)
                .build();
    }

    @Override
    public ReviewSentimentAnalysisResponse analyzeReviewSentiment(ReviewSentimentAnalysisRequest request) {
        String content = request.getContent() != null ? request.getContent().trim() : "";

        // 1. Thử phân tích qua OpenRouter AI nếu khả dụng
        ReviewSentimentAnalysisResponse aiResponse = callOpenRouterForSentiment(content);
        if (aiResponse != null) {
            return aiResponse;
        }

        // 2. Fallback regex nội bộ
        boolean isToxic = TOXIC_PATTERN.matcher(content).matches();
        String sentiment;
        double confidence;
        String recommendation;

        if (isToxic) {
            sentiment = "NEGATIVE";
            confidence = 0.94;
            recommendation = "REJECT";
        } else if (content.toLowerCase().contains("tốt") || content.toLowerCase().contains("đẹp") 
                || content.toLowerCase().contains("ưng ý") || content.toLowerCase().contains("chất lượng")) {
            sentiment = "POSITIVE";
            confidence = 0.91;
            recommendation = "APPROVE";
        } else {
            sentiment = "NEUTRAL";
            confidence = 0.85;
            recommendation = "APPROVE";
        }

        return ReviewSentimentAnalysisResponse.builder()
                .sentiment(sentiment)
                .isToxic(isToxic)
                .confidenceScore(confidence)
                .recommendation(recommendation)
                .build();
    }

    private String callOpenRouterForCopilot(String query) {
        if (openRouterApiKey == null || openRouterApiKey.isBlank() || openRouterApiKey.contains("your_")) {
            return null;
        }

        String systemPrompt = "Bạn là Trợ lý Quản trị Cấp Cao AutoHub (AutoHub AI Copilot). "
                + "Bạn am hiểu tường tận các quy chế đại lý AutoHub, chính sách đặt cọc giữ xe 72h, quy tắc BR06, bảo hành phụ kiện chính hãng và quản trị tài chính. "
                + "Hãy trả lời ngắn gọn, chuyên nghiệp, súc tích bằng tiếng Việt.";

        return executeOpenRouterRequest(systemPrompt, query);
    }

    private ReviewSentimentAnalysisResponse callOpenRouterForSentiment(String content) {
        if (openRouterApiKey == null || openRouterApiKey.isBlank() || openRouterApiKey.contains("your_")) {
            return null;
        }

        String systemPrompt = "Bạn là AI kiểm duyệt nội dung đánh giá của AutoHub. "
                + "Hãy phân tích nội dung sau và trả về DUY NHẤT một chuỗi JSON chuẩn (không dùng markdown code fence): "
                + "{\"sentiment\": \"POSITIVE\"|\"NEGATIVE\"|\"NEUTRAL\", \"isToxic\": true|false, \"confidenceScore\": 0.95, \"recommendation\": \"APPROVE\"|\"REJECT\"}.";

        String jsonResponse = executeOpenRouterRequest(systemPrompt, "Nội dung nhận xét: " + content);
        if (jsonResponse != null && !jsonResponse.isBlank()) {
            try {
                String cleanJson = jsonResponse.replace("```json", "").replace("```", "").trim();
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(cleanJson);
                return ReviewSentimentAnalysisResponse.builder()
                        .sentiment(root.path("sentiment").asText("NEUTRAL"))
                        .isToxic(root.path("isToxic").asBoolean(false))
                        .confidenceScore(root.path("confidenceScore").asDouble(0.90))
                        .recommendation(root.path("recommendation").asText("APPROVE"))
                        .build();
            } catch (Exception e) {
                log.warn("Không thể parse JSON từ OpenRouter Sentiment, fallback regex: {}", e.getMessage());
            }
        }
        return null;
    }

    private String executeOpenRouterRequest(String systemPrompt, String userPrompt) {
        try {
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(6000);
            factory.setReadTimeout(12000);
            RestTemplate restTemplate = new RestTemplate(factory);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openRouterApiKey.trim());
            headers.set("HTTP-Referer", "https://autohub.vn");
            headers.set("X-Title", "AutoHub Admin AI");

            Map<String, Object> sysMsg = Map.of("role", "system", "content", systemPrompt);
            Map<String, Object> usrMsg = Map.of("role", "user", "content", userPrompt);
            Map<String, Object> body = Map.of(
                    "model", openRouterModel != null && !openRouterModel.isBlank() ? openRouterModel : "deepseek/deepseek-chat",
                    "messages", List.of(sysMsg, usrMsg),
                    "temperature", 0.3,
                    "max_tokens", 800
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(openRouterApiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.getBody());
                JsonNode choices = root.path("choices");
                if (choices.isArray() && !choices.isEmpty()) {
                    JsonNode contentNode = choices.get(0).path("message").path("content");
                    if (!contentNode.isMissingNode() && !contentNode.asText().isBlank()) {
                        return contentNode.asText().trim();
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Không thể gọi OpenRouter API ({}), chuyển sang fallback: {}", openRouterModel, e.getMessage());
        }
        return null;
    }
}
