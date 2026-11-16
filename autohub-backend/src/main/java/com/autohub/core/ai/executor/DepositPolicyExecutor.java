package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class DepositPolicyExecutor implements AiIntentExecutor {

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.DEPOSIT_POLICY_72H;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        log.info("[DepositPolicyExecutor] Giải thích chính sách cọc giữ xe 72h");

        String text = """
            🛡️ **CHÍNH SÁCH ĐẶT CỌC GIỮ XE 72 GIỜ TẠI AUTOHUB**
            
            Nhằm mang lại sự an tâm tuyệt đối cho quý khách hàng trong quá trình cân nhắc và ra quyết định, AutoHub áp dụng chính sách đặt cọc giữ chỗ minh bạch và bảo vệ tối đa quyền lợi người tiêu dùng:
            
            1. **Mức tiền cọc giữ xe chuẩn:**
               • **20.000.000 VNĐ / xe** cho tất cả các phiên bản xe điện và xe xăng cao cấp.
               • Khi nộp cọc thành công, hệ thống tự động khóa số khung **VIN độc quyền** và cố định mức giá ưu đãi trong 72 giờ.
            
            2. **Cam kết hoàn tiền 100% không mất phí trong 72h:**
               • Quý khách có quyền thay đổi quyết định hoặc hủy cọc bất kỳ lúc nào trong vòng **72 giờ** kể từ thời điểm giao dịch.
               • AutoHub cam kết **hoàn lại đúng 100% số tiền cọc** về tài khoản ngân hàng của quý khách mà không trừ bất kỳ khoản phí phạt hay phụ phí nào.
            
            3. **Thời gian xử lý hoàn tiền:**
               • Yêu cầu hoàn cọc được tiếp nhận tự động trên cổng Portal và xử lý hoàn tất trong vòng 24 - 48 giờ làm việc.
            
            Quý khách có thể tự tin đặt cọc giữ xe ngay hôm nay để không bỏ lỡ đợt bàn giao xe sớm nhất!
            """;

        return AiExecutionResult.builder()
                .aiAnswerText(text.trim())
                .uiBlockType("DEPOSIT_POLICY")
                .suggestedPrompts(List.of(
                        "Đặt cọc giữ xe 72h ngay bây giờ",
                        "Tư vấn phiên bản AutoHub GT-e Track Edition",
                        "Tính chi phí lăn bánh tại Hà Nội",
                        "Kiểm tra xe có sẵn giao ngay"
                ))
                .build();
    }
}
