package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import com.autohub.core.ai.tools.RegistrationFeeCalculatorTool;
import com.autohub.core.ai.tools.RegistrationFeeCalculatorTool.RolloutCalculationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class RolloutCostExecutor implements AiIntentExecutor {

    private final RegistrationFeeCalculatorTool registrationFeeCalculatorTool;
    private static final Locale VI_LOCALE = new Locale("vi", "VN");

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.ROLLOUT_FEE_CALCULATION;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        String province = decision.province() != null && !decision.province().isBlank()
                ? decision.province()
                : "Hà Nội";

        String targetCar = decision.targetVehicleName();
        log.info("[RolloutCostExecutor] Tính chi phí lăn bánh cho xe: [{}], carId: [{}], tỉnh: [{}]",
                targetCar, decision.contextCarId(), province);
        RolloutCalculationResult res = registrationFeeCalculatorTool.calculateRolloutFee(
                decision.contextCarId(),
                targetCar,
                originalPrompt,
                province
        );
        NumberFormat nf = NumberFormat.getInstance(VI_LOCALE);

        StringBuilder sb = new StringBuilder();
        sb.append("Dạ, AutoHub xin gửi tới Quý khách dự toán chi phí lăn bánh cho mẫu xe **")
                .append(res.getTenPhienBan()).append("** tại khu vực **").append(res.getTinhThanh()).append("**.\n\n");
        sb.append("👉 **Tổng chi phí lăn bánh dự kiến:** **")
                .append(res.getTongChiPhiLanBanh() != null ? nf.format(res.getTongChiPhiLanBanh()) + " VNĐ" : "Liên hệ")
                .append("** (đã bao gồm đầy đủ giá niêm yết VAT, lệ phí trước bạ, phí cấp biển số, đăng kiểm và bảo hiểm TNDS bắt buộc).\n\n");
        sb.append("💡 *Chính sách ưu đãi:* ").append(res.getGhiChuChinhSach()).append("\n\n");
        sb.append("Quý khách có thể xem bảng kê chi tiết từng khoản mục ở thẻ bên dưới hoặc chọn **'Đặt cọc giữ xe 72h'** trực tuyến để khóa ưu đãi này!");

        String retrievedCtx = "Dự toán lăn bánh xe " + res.getTenPhienBan() + " tại " + res.getTinhThanh() +
                ": Giá niêm yết: " + (res.getGiaNiemYet() != null ? nf.format(res.getGiaNiemYet()) : "0") + " VNĐ, " +
                "Lệ phí trước bạ (" + res.getTyLePhiTruocBa() + "%): " + (res.getPhiTruocBa() != null ? nf.format(res.getPhiTruocBa()) : "0") + " VNĐ, " +
                "Phí cấp biển số: " + (res.getPhiCapBienSo() != null ? nf.format(res.getPhiCapBienSo()) : "0") + " VNĐ, " +
                "Tổng lăn bánh dự kiến: " + (res.getTongChiPhiLanBanh() != null ? nf.format(res.getTongChiPhiLanBanh()) : "0") + " VNĐ. " +
                "Ưu đãi: " + res.getGhiChuChinhSach();

        return AiExecutionResult.builder()
                .aiAnswerText(sb.toString())
                .retrievedContext(retrievedCtx)
                .uiBlockType("ROLLOUT_TABLE")
                .rolloutFeeData(res)
                .suggestedPrompts(List.of(
                        "Đặt cọc giữ xe " + res.getTenPhienBan() + " 72h ngay bây giờ",
                        "Kiểm tra tồn kho " + res.getTenPhienBan() + " sẵn giao",
                        "Tính chi phí lăn bánh tại TP.HCM",
                        "Chính sách bảo hành pin 800V SiC"
                ))
                .build();
    }
}
