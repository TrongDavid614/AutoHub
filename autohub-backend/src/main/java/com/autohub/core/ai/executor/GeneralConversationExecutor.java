package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class GeneralConversationExecutor implements AiIntentExecutor {

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.GENERAL_CONVERSATION;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        log.info("[GeneralConversationExecutor] Xử lý câu hỏi trò chuyện / bảo mật / quyền hạn AI");

        String context = """
            QUY ĐỊNH BẢO MẬT VÀ PHẠM VI HOẠT ĐỘNG CỦA TRỢ LÝ AI AUTOHUB:
            1. Vai trò: Tôi là Trợ lý AI Chuyên gia Ô tô của Nền tảng AutoHub, được phát triển trên kiến trúc Spring AI kết hợp mô hình Google Gemini 3.5 Flash.
            2. Quyền hạn bảo mật:
               - Tôi CHỈ có quyền đọc (Read-only) các thông tin công khai về xe, thông số kỹ thuật, giá niêm yết, tồn kho và biểu phí lăn bánh.
               - Tôi TUYỆT ĐỐI KHÔNG có quyền truy cập quản trị (Admin), không thể chỉnh sửa, ghi đè hoặc XÓA cơ sở dữ liệu hệ thống (SQL Server AutoHubDB).
               - Toàn bộ cơ sở dữ liệu được bảo vệ nghiêm ngặt bằng tường lửa, hệ thống phân quyền Spring Security RBAC và cơ chế sao lưu định kỳ.
            3. Nhiệm vụ phục vụ: Hỗ trợ khách hàng tìm kiếm xe, so sánh thông số, tính chi phí lăn bánh, kiểm tra tồn kho tại showroom và hướng dẫn đặt cọc giữ xe 72h trực tuyến.
            """;

        String fallbackText = """
            🛡️ **Thông báo an toàn & Bảo mật hệ thống AutoHub:**
            
            Tôi là **Trợ lý AI Tư vấn Chuyên môn của AutoHub**. Về mặt kỹ thuật và phân quyền bảo mật:
            
            • **Quyền hạn của AI:** Tôi chỉ được cấp quyền đọc (Read-only) để tra cứu thông số xe, bảng giá và tồn kho phục vụ quý khách.
            • **Tuyệt đối không thể xóa hay can thiệp CSDL:** Hệ thống cơ sở dữ liệu AutoHubDB được bảo mật đa tầng bởi Spring Security RBAC và các chính sách an toàn nghiêm ngặt của doanh nghiệp. Tôi hoàn toàn không có quyền hạn hay khả năng thực hiện bất kỳ thao tác xóa hoặc thay đổi dữ liệu nào.
            
            Tôi luôn sẵn sàng đồng hành hỗ trợ quý khách tìm hiểu các dòng xe cao cấp, tính chi phí lăn bánh hoặc kiểm tra xe có sẵn giao ngay. Quý khách đang quan tâm đến dòng xe nào hôm nay?
            """;

        return AiExecutionResult.builder()
                .aiAnswerText(fallbackText.trim())
                .retrievedContext(context)
                .uiBlockType("NONE")
                .suggestedPrompts(List.of(
                        "Tư vấn phiên bản AutoHub GT-e Track Edition",
                        "Kiểm tra xe có sẵn giao ngay tại showroom",
                        "Tính chi phí lăn bánh tại Hà Nội",
                        "Chính sách bảo hành pin xe điện 800V SiC"
                ))
                .build();
    }
}
