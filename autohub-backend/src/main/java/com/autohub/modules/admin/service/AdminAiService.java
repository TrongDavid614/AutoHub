package com.autohub.modules.admin.service;

import java.util.Map;

public interface AdminAiService {
    /**
     * Tra cứu tài liệu, chính sách hoàn cọc và quy chế đại lý bằng RAG / Vector Store
     */
    String askAdminCopilot(String query);

    /**
     * Phân tích ngữ nghĩa nội dung đánh giá của khách hàng (phát hiện toxic, spam, độ hài lòng)
     */
    Map<String, Object> analyzeReviewSentiment(String reviewContent);
}
