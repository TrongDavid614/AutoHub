package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import com.autohub.core.ai.tools.InventoryCheckTool;
import com.autohub.core.ai.tools.InventoryCheckTool.InventoryStockDetail;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryExecutor implements AiIntentExecutor {

    private final InventoryCheckTool inventoryCheckTool;

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.INVENTORY_SHOWROOM_CHECK;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        String targetCar = decision.targetVehicleName();
        log.info("[InventoryExecutor] Kiểm tra tồn kho cho xe: [{}], carId: [{}], tỉnh: [{}]",
                targetCar, decision.contextCarId(), decision.province());
        List<InventoryStockDetail> stocks = inventoryCheckTool.checkCarInventory(
                decision.contextCarId(),
                targetCar,
                originalPrompt,
                decision.province()
        );

        String carLabel = targetCar != null && !targetCar.isBlank()
                ? targetCar
                : (!stocks.isEmpty() ? stocks.get(0).getTenPhienBan() : "xe điện AutoHub");

        if (stocks.isEmpty()) {
            return AiExecutionResult.builder()
                    .aiAnswerText("Hệ thống ghi nhận phiên bản **" + carLabel + "** hiện đang hoàn tất thủ tục xuất xưởng từ nhà máy. Quý khách có thể nộp cọc giữ chỗ 72h trên AutoHub để nhận xe trong đợt bàn giao đầu tiên.")
                    .uiBlockType("NONE")
                    .suggestedPrompts(List.of(
                            "Đặt cọc giữ chỗ " + carLabel + " 72h đợt đầu tiên",
                            "Tư vấn phiên bản có sẵn khác",
                            "Đăng ký lịch lái thử khi xe về"
                    ))
                    .build();
        }

        StringBuilder sb = new StringBuilder();
        sb.append("📍 **TÌNH TRẠNG XE CÓ SẴN TẠI HỆ THỐNG SHOWROOM AUTOHUB**\n\n");
        for (InventoryStockDetail s : stocks) {
            sb.append("🚗 **").append(s.getTenPhienBan()).append("** (Màu: ").append(s.getMauSac()).append(")\n");
            sb.append("   • Showroom: **").append(s.getTenShowroom()).append("**\n");
            sb.append("   • Địa chỉ: ").append(s.getDiaChiShowroom()).append("\n");
            sb.append("   • Tồn kho sẵn giao: **").append(s.getSoLuongKhaDung()).append(" xe** (").append(s.getTrangThaiGiao()).append(")\n\n");
        }
        sb.append("Quý khách có thể xem chi tiết từng showroom bên dưới hoặc bấm 'Đăng Ký Lái Thử' / 'Đặt Cọc Giữ Xe 72h' để khóa xe ngay.");

        return AiExecutionResult.builder()
                .aiAnswerText(sb.toString())
                .uiBlockType("INVENTORY_CARD")
                .inventoryData(stocks)
                .suggestedPrompts(List.of(
                        "Đặt cọc giữ xe " + carLabel + " 72h ngay bây giờ",
                        "Đăng ký lái thử " + carLabel + " hôm nay",
                        "Tính chi phí lăn bánh " + carLabel + " tại Hà Nội",
                        "Chính sách bảo hành xe AutoHub"
                ))
                .build();
    }
}
