package com.autohub.modules.admin.service;

import com.autohub.modules.admin.dto.AdminAiCopilotRequest;
import com.autohub.modules.admin.dto.AdminAiCopilotResponse;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisRequest;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisResponse;

/**
 * Interface Seam định nghĩa cổng kết nối dịch vụ cho Trợ lý Quản trị Admin AI Copilot
 * và Phân tích Ngữ nghĩa / Phát hiện Vi phạm Tiêu chuẩn Cộng đồng trong Nhận xét Phụ kiện.
 * 
 * Kiến trúc Seam cách ly hoàn toàn tầng Controller khỏi cơ chế suy luận AI, cho phép
 * cắm trực tiếp Backend AI Proxy (OpenRouter DeepSeek / Ollama Llama3), Model Fallback,
 * Timeout/Cooldown và Context Injection từ SQL Server mà không ảnh hưởng tới API contract.
 */
public interface AdminAiService {

    /**
     * Tra cứu tài liệu, chính sách hoàn cọc 72h và quy chế đại lý qua Vector Store RAG
     */
    AdminAiCopilotResponse askAdminCopilot(AdminAiCopilotRequest request);

    /**
     * Phân tích ngữ nghĩa nhận xét của khách hàng (phát hiện toxic, spam, độ tin cậy và khuyến nghị duyệt)
     */
    ReviewSentimentAnalysisResponse analyzeReviewSentiment(ReviewSentimentAnalysisRequest request);
}
