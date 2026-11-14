package com.autohub.modules.admin.service;

import com.autohub.modules.admin.dto.AdminAiCopilotRequest;
import com.autohub.modules.admin.dto.AdminAiCopilotResponse;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisRequest;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Slf4j
@Service
@ConditionalOnMissingBean(name = "ollamaAdminAiService")
public class DefaultAdminAiServiceImpl implements AdminAiService {

    private static final Pattern TOXIC_PATTERN = Pattern.compile(
            ".*(lừa đảo|tệ hại|đm|dkm|vớ vẩn|rác rưởi|gian lận|chó|cút|bịp|hàng đểu).*",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE
    );

    @Override
    public AdminAiCopilotResponse askAdminCopilot(AdminAiCopilotRequest request) {
        long startTime = System.currentTimeMillis();
        String query = request.getQuery() != null ? request.getQuery().trim().toLowerCase() : "";

        String answer;
        List<String> sources = new ArrayList<>();

        if (query.contains("hoàn cọc") || query.contains("rút cọc")) {
            answer = "Theo Điều 4.2 Quy Chế Đại Lý AutoHub: Phiếu đặt cọc xe được xem xét giải ngân hoàn tiền khi: "
                    + "(1) Khách hàng cung cấp văn bản từ chối bảo lãnh tín dụng hợp lệ từ ngân hàng đối tác, hoặc "
                    + "(2) Quản trị viên duyệt ngoại lệ trước khi đơn vị xuất hóa đơn tài chính. "
                    + "Khi duyệt hoàn cọc thành công, hệ thống tự động giải phóng số VIN về trạng thái CO_SAN.";
            sources.add("Quy chế đại lý AutoHub - Điều 4.2");
            sources.add("Tài liệu nghiệp vụ UC40 - Hoàn cọc 72h");
        } else if (query.contains("72h") || query.contains("72 giờ") || query.contains("hết hạn")) {
            answer = "Theo quy tắc BR06: Phiếu cọc giữ xe có hiệu lực tối đa 72 giờ liên tục. "
                    + "Quá thời hạn trên, hệ thống kiểm toán tự động chuyển trạng thái phiếu cọc sang EXPIRED "
                    + "và hoàn trả số lượng khả dụng của phiên bản xe vào kho tổng.";
            sources.add("Đặc tả quy tắc nghiệp vụ BR06");
        } else if (query.contains("bảo hành") || query.contains("đổi trả")) {
            answer = "Chính sách bảo hành phụ kiện AutoHub: Tất cả phụ kiện chính hãng được áp dụng chính sách "
                    + "1 đổi 1 trong 30 ngày nếu phát hiện lỗi từ nhà sản xuất, và bảo hành tiêu chuẩn 12 tháng "
                    + "tại toàn bộ hệ sinh thái showroom trên toàn quốc.";
            sources.add("Chính sách hậu mãi & bảo hành phụ kiện AutoHub v2.0");
        } else if (query.contains("kpi") || query.contains("doanh thu")) {
            answer = "Hệ thống Báo cáo Quản trị: Doanh thu toàn sàn được đối soát tự động qua cổng thanh toán SePay IPN "
                    + "và tích hợp trực tiếp vào biểu đồ doanh thu thời gian thực trên Admin Dashboard.";
            sources.add("Admin Financial Metrics & SePay IPN Integration");
        } else {
            answer = "Trợ lý Quản Trị AutoHub Copilot: Đã tiếp nhận yêu cầu '" + request.getQuery() + "'. "
                    + "Hệ thống sẵn sàng liên kết kho tri thức Vector Store (Ollama Llama3 / Qwen) "
                    + "để trích xuất dữ liệu sâu hơn khi kích hoạt service Ollama.";
            sources.add("AutoHub Core Knowledge Base");
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
}
