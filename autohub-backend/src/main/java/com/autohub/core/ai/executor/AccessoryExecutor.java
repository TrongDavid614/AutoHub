package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiChatMessageDto;
import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import com.autohub.core.ai.tools.AccessoryCompatibilityTool;
import com.autohub.core.ai.tools.AccessoryCompatibilityTool.AccessoryDetail;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccessoryExecutor implements AiIntentExecutor {

    private final AccessoryCompatibilityTool accessoryCompatibilityTool;
    private static final Locale VI_LOCALE = Locale.of("vi", "VN");

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.ACCESSORY_COMPATIBILITY;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        log.info("[AccessoryExecutor] Tìm kiếm phụ kiện tương thích cho prompt: {}", originalPrompt);
        List<AccessoryDetail> accs = accessoryCompatibilityTool.searchCompatibleAccessories(originalPrompt);
        NumberFormat nf = NumberFormat.getInstance(VI_LOCALE);

        if (accs.isEmpty()) {
            return AiExecutionResult.builder()
                    .aiAnswerText("Hiện tại hệ thống phụ kiện chính hãng AutoHub đang được cập nhật thêm các mã sản phẩm tương thích mới. Quý khách có thể xem danh mục phụ kiện tại showroom hoặc liên hệ hotline để được hỗ trợ.")
                    .uiBlockType("NONE")
                    .build();
        }

        StringBuilder sb = new StringBuilder();
        sb.append("🛠️ **DANH MỤC PHỤ KIỆN CHÍNH HÃNG AUTOHUB TƯƠNG THÍCH ĐANG CÓ SẴN:**\n\n");
        for (AccessoryDetail a : accs) {
            sb.append("• **").append(a.getTenPhuKien()).append("** - Thương hiệu: ").append(a.getThuongHieu()).append("\n");
            sb.append("  - Giá bán: **").append(a.getGiaBan() != null ? nf.format(a.getGiaBan()) + " VNĐ" : "Liên hệ").append("**\n");
            sb.append("  - Trạng thái kho: ").append(a.getTrangThaiTon()).append(" | Bảo hành chính hãng AutoHub.\n\n");
        }
        sb.append("Quý khách có thể thêm phụ kiện vào giỏ hàng hoặc xem thẻ sản phẩm bên dưới để nhận ưu đãi lắp đặt miễn phí tại Showroom.");

        AccessoryDetail top = accs.get(0);
        AiChatMessageDto.AiRecommendedAccessoryDto accessoryDto = AiChatMessageDto.AiRecommendedAccessoryDto.builder()
                .accessoryId(top.getId())
                .name(top.getTenPhuKien())
                .badgeTitle("CHÍNH HÃNG AUTOHUB")
                .price(top.getGiaBan() != null ? top.getGiaBan().longValue() : 18500000L)
                .description("Phụ kiện cao cấp được thiết kế riêng và đồng bộ kỹ thuật 100% với các dòng xe AutoHub.")
                .benefits(List.of(
                        "Bảo hành chính hãng 24 tháng 1 đổi 1",
                        "Lắp đặt miễn phí tại tất cả Showroom",
                        "Đạt chuẩn an toàn quốc tế"
                ))
                .matchPercentage(98.5)
                .sku("ACC-" + top.getId())
                .imageUrl("https://images.unsplash.com/photo-1558441719-f54ec58797dd?auto=format&fit=crop&w=800&q=80")
                .build();

        return AiExecutionResult.builder()
                .aiAnswerText(sb.toString())
                .uiBlockType("ACCESSORY_LIST")
                .recommendedAccessory(accessoryDto)
                .suggestedPrompts(List.of(
                        "Thêm vào giỏ hàng phụ kiện",
                        "Tư vấn trạm sạc tại nhà 22kW",
                        "Kiểm tra bảo hành phụ kiện",
                        "Tư vấn xe tương thích"
                ))
                .build();
    }
}
