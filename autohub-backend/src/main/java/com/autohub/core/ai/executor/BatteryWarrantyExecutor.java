package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiChatMessageDto;
import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BatteryWarrantyExecutor implements AiIntentExecutor {

    private final PhienBanXeRepository phienBanXeRepository;

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.BATTERY_WARRANTY_POLICY;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        log.info("[BatteryWarrantyExecutor] Cung cấp chính sách bảo hành pin 800V SiC");

        // Lấy xe điện cao cấp làm đại diện
        PhienBanXe evVariant = phienBanXeRepository.findAll().stream()
                .filter(v -> !v.isDeleted() && v.isDangHoatDong() && v.getLoaiNhienLieu() != null &&
                        (v.getLoaiNhienLieu().toLowerCase().contains("điện") || v.getLoaiNhienLieu().toLowerCase().contains("electric")))
                .findFirst()
                .orElse(null);

        AiChatMessageDto.AiRecommendedVehicleDto vehicleCard = CarCatalogExecutor.buildVehicleDto(evVariant);

        String context = """
            CHÍNH SÁCH BẢO HÀNH PIN VÀ HỆ TRUYỀN ĐỘNG ĐIỆN 800V SiC AUTOHUB:
            1. Thời hạn bảo hành tiêu chuẩn: 10 NĂM HOẶC 200.000 KM (tùy điều kiện nào đến trước), áp dụng cho toàn bộ cell pin, pack pin và hệ thống quản lý pin BMS.
            2. Cam kết dung lượng khả dụng (SOH - State of Health):
               - AutoHub cam kết đổi mới bộ pin hoàn toàn MIỄN PHÍ nếu dung lượng khả dụng của pin tụt dưới 70% trong thời gian bảo hành.
            3. Công nghệ Pin SiC 800V thế hệ mới:
               - Kiến trúc điện áp cao 800V Silicon Carbide (SiC) giảm nhiệt lượng tỏa ra 40%, tăng hiệu suất sạc.
               - Hỗ trợ công suất sạc tối đa 350kW: Sạc từ 10% lên 80% chỉ trong 18 PHÚT.
               - Hệ thống làm mát bằng chất lỏng tuần hoàn đa kênh chống quá nhiệt và ngăn ngừa suy giảm tuổi thọ pin.
            4. Dịch vụ hỗ trợ & Cứu hộ pin:
               - Cứu hộ sạc khẩn cấp lưu động 24/7 trên toàn quốc qua Hotline 1900 8888.
               - Miễn phí kiểm tra SOH định kỳ tại tất cả xưởng dịch vụ ủy quyền của AutoHub.
            """;

        String fallbackText = """
            🔋 **CHÍNH SÁCH BẢO HÀNH PIN XE ĐIỆN 800V SiC TẠI AUTOHUB**
            
            Nhằm mang lại sự an tâm tuyệt đối khi chuyển đổi sang kỷ nguyên xe điện thông minh, AutoHub áp dụng chính sách bảo hành pin vượt trội nhất phân khúc:
            
            • **Thời hạn bảo hành:** **10 năm hoặc 200.000 km** (tùy điều kiện nào đến trước) cho toàn bộ hệ thống Pin và bộ quản lý BMS.
            • **Cam kết đổi mới 100%:** Nếu dung lượng khả dụng (SOH) của pin giảm xuống dưới **70%** trong thời gian bảo hành, AutoHub sẽ thay mới hoàn toàn bộ pin miễn phí.
            • **Công nghệ sạc siêu nhanh 800V SiC:** Cho phép sạc từ 10% lên 80% chỉ trong **18 phút** tại hệ thống trạm sạc siêu nhanh AutoHub Supercharge.
            • **Hệ thống làm mát chuyên dụng:** Công nghệ tản nhiệt chất lỏng đa khoang giúp duy trì nhiệt độ tối ưu, đảm bảo tuổi thọ cell pin kéo dài hơn 15 năm.
            • **Cứu hộ pin 24/7:** Dịch vụ xe cứu hộ sạc pin lưu động miễn phí tại các thành phố lớn.
            
            Quý khách có thể xem thông số xe điện AutoHub GT-e được trang bị công nghệ pin này ở thẻ bên dưới hoặc đặt câu hỏi chi tiết hơn!
            """;

        return AiExecutionResult.builder()
                .aiAnswerText(fallbackText.trim())
                .retrievedContext(context)
                .uiBlockType(vehicleCard != null ? "CAR_CARD" : "NONE")
                .recommendedVehicle(vehicleCard)
                .suggestedPrompts(List.of(
                        "Thời gian sạc 10-80% mất bao lâu?",
                        "Tính chi phí lăn bánh AutoHub GT-e",
                        "Kiểm tra xe có sẵn tại showroom",
                        "Chính sách đặt cọc giữ xe 72h"
                ))
                .build();
    }
}
