package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeneralGreetingExecutor implements AiIntentExecutor {

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.GENERAL_GREETING;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        log.info("[GeneralGreetingExecutor] Phản hồi lời chào mở đầu tự nhiên, không gắn thẻ xe");

        String greetingText = """
                👋 **Xin chào quý khách!** Tôi là **Trợ lý AI Chuyên gia Ô tô của AutoHub**.

                Rất hân hạnh được hỗ trợ quý khách! Tôi có thể giúp quý khách:
                • 🚗 **Tư vấn xe & Thông số kỹ thuật:** Tra cứu bảng giá, dung lượng pin, tầm hoạt động và so sánh các phiên bản.
                • 💰 **Dự toán chi phí lăn bánh:** Tính chính xác lệ phí trước bạ, biển số và tổng chi phí ra biển theo từng tỉnh thành.
                • 🏢 **Kiểm tra tồn kho & Đặt lịch lái thử:** Tra cứu xe sẵn có tại các showroom AutoHub trên toàn quốc.
                • 🛡️ **Chính sách & Phụ kiện:** Quy chế cọc giữ xe 72h hoàn tiền 100%, bảo hành pin 10 năm hoặc mua phụ kiện chính hãng.

                Hôm nay quý khách đang quan tâm đến dòng xe nào hoặc cần hỗ trợ thông tin gì ạ?
                """
                .trim();

        return AiExecutionResult.builder()
                .aiAnswerText(greetingText)
                .uiBlockType("NONE")
                .recommendedVehicle(null)
                .suggestedPrompts(List.of(
                        "Tư vấn các dòng xe điện cao cấp",
                        "Tính chi phí lăn bánh tại Hà Nội & TP.HCM",
                        "Chính sách đặt cọc giữ xe 72h hoàn tiền 100%",
                        "Kiểm tra tồn kho xe có sẵn giao ngay"))
                .build();
    }
}