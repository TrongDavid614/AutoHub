package com.autohub.core.ai.service;

import com.autohub.core.ai.dto.AiChatMessageDto;
import com.autohub.core.ai.dto.AiChatRequest;
import com.autohub.core.ai.executor.CarCatalogExecutor;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerAiService {

    private final AiOrchestratorService aiOrchestratorService;
    private final PhienBanXeRepository phienBanXeRepository;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Điểm tiếp nhận yêu cầu chat từ khách hàng — Định tuyến qua Kiến trúc Router-Executor
     */
    public AiChatMessageDto processUserChat(AiChatRequest request) {
        log.info("[CustomerAiService] Tiếp nhận hội thoại tư vấn AI, chuyển tiếp tới AiOrchestratorService");
        return aiOrchestratorService.processUserChat(request);
    }

    /**
     * Khởi tạo lời chào ban đầu kèm thẻ xe Flagship Generative UI
     */
    public List<AiChatMessageDto> getInitialConversation() {
        String nowTime = LocalDateTime.now().format(TIME_FMT);

        PhienBanXe flagship = phienBanXeRepository.findAll().stream()
                .filter(v -> !v.isDeleted() && v.isDangHoatDong())
                .findFirst()
                .orElse(null);

        AiChatMessageDto.AiRecommendedVehicleDto vehicleCard = CarCatalogExecutor.buildVehicleDto(flagship);

        AiChatMessageDto welcome = AiChatMessageDto.builder()
                .id("init-msg-01")
                .sender("AI")
                .senderTitle("AutoHub AI Specialist (Google Gemini 3.5 & Spring AI)")
                .timestamp(nowTime)
                .content("Xin chào quý khách! Tôi là Trợ lý AI Chuyên gia Ô tô AutoHub được vận hành trên kiến trúc Router-Executor và truy vấn dữ liệu thời gian thực từ AutoHubDB. Tôi có thể hỗ trợ quý khách tra cứu thông số kỹ thuật, giá xe, kiểm tra tồn kho tại showroom, dự toán chi phí lăn bánh chính xác và gợi ý phụ kiện tương thích. Quý khách đang quan tâm đến dòng xe nào hôm nay?")
                .uiBlockType(vehicleCard != null ? "CAR_CARD" : "NONE")
                .recommendedVehicle(vehicleCard)
                .suggestedPrompts(List.of(
                        "Tư vấn phiên bản AutoHub GT-e Track Edition",
                        "Kiểm tra xe có sẵn giao ngay tại showroom",
                        "Tính chi phí lăn bánh tại Hà Nội & TP.HCM",
                        "Chính sách bảo hành pin xe điện 800V SiC"
                ))
                .build();

        return List.of(welcome);
    }
}
