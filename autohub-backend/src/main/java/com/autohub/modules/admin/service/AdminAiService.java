package com.autohub.modules.admin.service;

import com.autohub.modules.admin.dto.AdminAiCopilotRequest;
import com.autohub.modules.admin.dto.AdminAiCopilotResponse;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisRequest;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisResponse;

public interface AdminAiService {

    /**
     * Tra cứu tài liệu chính sách, quy chế hoàn cọc 72h và chỉ số kinh doanh bằng RAG Vector Store.
     */
    AdminAiCopilotResponse askAdminCopilot(AdminAiCopilotRequest request);

    /**
     * Phân tích ngữ nghĩa nội dung nhận xét (phát hiện toxic, phản cảm, cảm xúc tiêu cực).
     */
    ReviewSentimentAnalysisResponse analyzeReviewSentiment(ReviewSentimentAnalysisRequest request);
}
