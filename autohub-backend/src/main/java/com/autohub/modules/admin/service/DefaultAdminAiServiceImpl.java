package com.autohub.modules.admin.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@ConditionalOnMissingBean(name = "ollamaAdminAiService")
public class DefaultAdminAiServiceImpl implements AdminAiService {

    @Override
    public String askAdminCopilot(String query) {
        String q = query.toLowerCase();
        if (q.contains("hoàn cọc") || q.contains("rút cọc")) {
            return "Theo Điều 4.2 Quy Chế Đại Lý AutoHub: Phiếu cọc xe được xem xét hoàn trả khi (1) Ngân hàng đối tác từ chối bảo lãnh tín dụng có văn bản xác thực hoặc (2) Quản trị viên duyệt ngoại lệ trước khi đại lý xuất hóa đơn tài chính.";
        } else if (q.contains("72h") || q.contains("72 giờ") || q.contains("hết hạn")) {
            return "Theo BR06: Phiếu cọc giữ xe có hiệu lực tối đa 72 giờ liên tục. Quá thời hạn này, hệ thống tự động giải phóng suất xe về kho và chuyển trạng thái thành EXPIRED.";
        } else if (q.contains("bảo hành")) {
            return "Chính sách bảo hành phụ kiện: Bảo hành chính hãng 12 tháng tại toàn bộ hệ thống showroom AutoHub trên toàn quốc.";
        }
        return "Trợ lý Admin AutoHub: Đã ghi nhận câu hỏi '" + query + "'. Dữ liệu kiến thức chi tiết sẽ được tự động đồng bộ khi kết nối mô hình Vector Store Ollama.";
    }

    @Override
    public Map<String, Object> analyzeReviewSentiment(String reviewContent) {
        String lower = reviewContent.toLowerCase();
        boolean isToxic = lower.matches(".*(lừa đảo|tệ hại|đm|rác|vớ vẩn).*");
        
        Map<String, Object> result = new HashMap<>();
        result.put("isToxic", isToxic);
        result.put("sentiment", isToxic ? "NEGATIVE" : "POSITIVE");
        result.put("confidenceScore", isToxic ? 0.92 : 0.88);
        result.put("recommendation", isToxic ? "REJECT" : "APPROVE");
        return result;
    }
}
