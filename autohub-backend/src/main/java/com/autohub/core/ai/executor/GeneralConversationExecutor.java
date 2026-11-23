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
        log.info("[GeneralConversationExecutor] Xử lý câu hỏi trò chuyện thông thường hoặc bảo mật");

        String pLower = originalPrompt != null ? originalPrompt.toLowerCase() : "";

        // Kiểm tra xem có phải người dùng đang hỏi về bảo mật / phá hoại CSDL không
        boolean isSecurityQuery = pLower.contains("xóa") || pLower.contains("csdl") ||
                pLower.contains("database") || pLower.contains("hack") ||
                pLower.contains("drop") || pLower.contains("can thiệp");

        if (isSecurityQuery) {
            String securityContext = """
                    QUY ĐỊNH BẢO MẬT VÀ PHẠM VI HOẠT ĐỘNG CỦA TRỢ LÝ AI AUTOHUB:
                    1. Vai trò: Tôi là Trợ lý AI Chuyên gia Ô tô của Nền tảng AutoHub.
                    2. Quyền hạn bảo mật:
                       - Tôi CHỈ có quyền đọc (Read-only) các thông tin công khai về xe, thông số kỹ thuật, giá niêm yết, tồn kho và biểu phí lăn bánh.
                       - Tôi TUYỆT ĐỐI KHÔNG có quyền truy cập quản trị (Admin), không thể chỉnh sửa, ghi đè hoặc XÓA cơ sở dữ liệu hệ thống (SQL Server AutoHubDB).
                       - Toàn bộ cơ sở dữ liệu được bảo vệ nghiêm ngặt bằng tường lửa và phân quyền Spring Security RBAC.
                    """;

            String securityText = """
                    🛡️ **Thông báo an toàn & Bảo mật hệ thống AutoHub:**

                    Tôi là **Trợ lý AI Tư vấn Chuyên môn của AutoHub**. Về mặt kỹ thuật và phân quyền bảo mật:
                    • **Quyền hạn của AI:** Tôi chỉ được cấp quyền đọc (Read-only) để tra cứu thông số xe, bảng giá và tồn kho phục vụ quý khách.
                    • **Tuyệt đối không thể xóa hay can thiệp CSDL:** Hệ thống CSDL AutoHubDB được bảo mật đa tầng bởi Spring Security RBAC. Tôi hoàn toàn không có khả năng thực hiện bất kỳ thao tác xóa hoặc thay đổi dữ liệu nào.

                    Tôi luôn sẵn sàng đồng hành hỗ trợ quý khách tìm hiểu xe, tính chi phí lăn bánh hoặc lái thử. Quý khách đang quan tâm đến nội dung nào ạ?
                    """
                    .trim();

            return AiExecutionResult.builder()
                    .aiAnswerText(securityText)
                    .retrievedContext(securityContext)
                    .uiBlockType("NONE")
                    .recommendedVehicle(null)
                    .suggestedPrompts(List.of(
                            "Tư vấn phiên bản AutoHub GT-e",
                            "Kiểm tra xe có sẵn giao ngay",
                            "Tính chi phí lăn bánh tại Hà Nội"))
                    .build();
        }

        // Trường hợp trò chuyện thông thường (hỏi thăm, thời tiết, toán học, câu hỏi
        // ngoài lề...)
        String generalChatText = """
                Dạ tôi là **Trợ lý AI của AutoHub**! Tôi luôn sẵn sàng lắng nghe và trò chuyện cùng bạn.

                Nếu bạn cần giải đáp thông tin thường nhật hoặc có bất kỳ câu hỏi nào về các dòng xe ô tô, chi phí lăn bánh, phụ kiện hay đăng ký lái thử, tôi rất vui lòng được hỗ trợ bạn nhé!
                """
                .trim();

        return AiExecutionResult.builder()
                .aiAnswerText(generalChatText)
                .retrievedContext("Người dùng đang trò chuyện thông thường, không hỏi về xe cụ thể.")
                .uiBlockType("NONE")
                .recommendedVehicle(null)
                .suggestedPrompts(List.of(
                        "Tư vấn các dòng xe điện cao cấp",
                        "Tính chi phí lăn bánh tại Hà Nội & TP.HCM",
                        "Chính sách cọc giữ xe 72h hoàn tiền 100%"))
                .build();
    }
}