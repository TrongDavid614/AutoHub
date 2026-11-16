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

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeneralGreetingExecutor implements AiIntentExecutor {

    private final PhienBanXeRepository phienBanXeRepository;
    private static final Locale VI_LOCALE = Locale.of("vi", "VN");

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.GENERAL_GREETING;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        log.info("[GeneralGreetingExecutor] Phản hồi chào hỏi mở đầu");
        NumberFormat nf = NumberFormat.getInstance(VI_LOCALE);

        List<PhienBanXe> activeVariants = phienBanXeRepository.findAll().stream()
                .filter(v -> !v.isDeleted() && v.isDangHoatDong())
                .toList();

        StringBuilder sb = new StringBuilder();
        sb.append("👋 **Xin chào quý khách!** Tôi là Trợ lý AI Chuyên gia Ô tô AutoHub.\n\n");
        sb.append("Rất hân hạnh được đồng hành cùng quý khách tìm kiếm chiếc xe ưng ý nhất. Hệ sinh thái AutoHub hiện đang phân phối và có sẵn giao ngay các dòng xe cao cấp tiêu biểu:\n\n");

        int count = 0;
        for (PhienBanXe v : activeVariants) {
            if (count++ >= 3) break;
            sb.append("🚗 **").append(v.getTenPhienBan()).append("**\n");
            sb.append("   • Phân khúc: ").append(v.getDongXe() != null ? v.getDongXe().getPhanKhuc() : "Luxury").append(" (").append(v.getSoChoNgoi() != null ? v.getSoChoNgoi() : 5).append(" chỗ)\n");
            sb.append("   • Động cơ / Tầm hoạt động: ").append(v.getLoaiNhienLieu() != null ? v.getLoaiNhienLieu() : "Điện 800V SiC").append(" - ").append(v.getTamHoatDongKm() != null ? v.getTamHoatDongKm() + " km" : "620 km").append("\n");
            sb.append("   • Giá niêm yết: **").append(v.getGiaNiemYet() != null ? nf.format(v.getGiaNiemYet()) + " VNĐ" : "Liên hệ").append("** (Cọc 72h: ").append(v.getMucTienCoc() != null ? nf.format(v.getMucTienCoc()) + " VNĐ" : "20.000.000 VNĐ").append(")\n\n");
        }

        sb.append("👉 **Quý khách có thể cho tôi biết:**\n");
        sb.append("1. Nhu cầu sử dụng (xe gia đình 5/7 chỗ hay xe thể thao cá nhân)?\n");
        sb.append("2. Ngân sách dự kiến (ví dụ: dưới 1 tỷ, 1 - 2 tỷ hay trên 2 tỷ)?\n");
        sb.append("3. Tỉnh thành quý khách muốn nhận xe và tính phí lăn bánh?");

        PhienBanXe top = !activeVariants.isEmpty() ? activeVariants.get(0) : null;
        AiChatMessageDto.AiRecommendedVehicleDto vehicleCard = CarCatalogExecutor.buildVehicleDto(top);

        return AiExecutionResult.builder()
                .aiAnswerText(sb.toString())
                .uiBlockType(vehicleCard != null ? "CAR_CARD" : "NONE")
                .recommendedVehicle(vehicleCard)
                .suggestedPrompts(List.of(
                        "Tư vấn phiên bản AutoHub GT-e Track Edition",
                        "Kiểm tra xe có sẵn giao ngay tại showroom",
                        "Tính chi phí lăn bánh tại Hà Nội & TP.HCM",
                        "Chính sách bảo hành pin xe điện 800V SiC"
                ))
                .build();
    }
}
