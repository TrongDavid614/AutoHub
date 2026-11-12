package com.autohub.integration.openrouter.service;

import com.autohub.core.car.entity.DongXe;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.DongXeRepository;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.integration.openrouter.config.OpenRouterProperties;
import com.autohub.integration.openrouter.dto.AiChatMessageDto;
import com.autohub.integration.openrouter.dto.AiChatRequest;
import com.autohub.integration.openrouter.dto.openrouter.OpenRouterWireDtos.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenRouterAiService {

    private final OpenRouterProperties properties;
    private final DongXeRepository dongXeRepository;
    private final PhienBanXeRepository phienBanXeRepository;

    private RestClient restClient;
    private volatile String currentOptimalModel;
    private volatile long lastOptimizedLatencyMs = 0;
    private volatile LocalDateTime lastOptimizedTime;

    @PostConstruct
    public void init() {
        this.currentOptimalModel = properties.getDefaultModel();
        this.lastOptimizedTime = LocalDateTime.now();

        this.restClient = RestClient.builder()
                .baseUrl(properties.getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + properties.getApiKey())
                .defaultHeader("HTTP-Referer", properties.getSiteUrl())
                .defaultHeader("X-Title", properties.getAppName())
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();

        log.info("OpenRouterAiService đã kích hoạt với Model mặc định ban đầu: {}", currentOptimalModel);
    }

    /**
     * Tự động kiểm tra và chuyển đổi model khi hệ thống rảnh rỗi (Idle Optimizer)
     * Chạy ngầm định kỳ mỗi 10 phút, ping thử các model trong pool để chọn model có tốc độ phản hồi nhanh nhất.
     */
    @Scheduled(initialDelay = 120000, fixedDelay = 600000)
    public void optimizeModelDuringIdle() {
        if (!properties.isIdleOptimizationEnabled()) {
            return;
        }

        log.info("[Idle-Optimizer] Bắt đầu tác vụ kiểm tra độ trễ & tối ưu hóa Model khi hệ thống nhàn rỗi...");
        List<String> candidates = properties.getFallbackModels();
        String fastestModel = null;
        long lowestLatency = Long.MAX_VALUE;

        for (String candidate : candidates) {
            try {
                long start = System.currentTimeMillis();
                OpenRouterRequest pingRequest = OpenRouterRequest.builder()
                        .model(candidate)
                        .messages(List.of(OpenRouterMessage.builder().role("user").content("ping").build()))
                        .temperature(0.1)
                        .build();

                OpenRouterResponse response = restClient.post()
                        .uri("/chat/completions")
                        .body(pingRequest)
                        .retrieve()
                        .body(OpenRouterResponse.class);

                long latency = System.currentTimeMillis() - start;

                if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
                    log.debug("[Idle-Optimizer] Model [{}] khả dụng (Độ trễ: {}ms)", candidate, latency);
                    if (latency < lowestLatency) {
                        lowestLatency = latency;
                        fastestModel = candidate;
                    }
                }
            } catch (Exception e) {
                log.warn("[Idle-Optimizer] Model [{}] hiện không sẵn sàng ({})", candidate, e.getMessage());
            }
        }

        if (fastestModel != null) {
            if (!fastestModel.equals(this.currentOptimalModel)) {
                log.info("[Idle-Optimizer] Đã tự động chuyển đổi sang Model tối ưu hơn: {} (Độ trễ: {}ms, trước đó: {})",
                        fastestModel, lowestLatency, this.currentOptimalModel);
                this.currentOptimalModel = fastestModel;
            } else {
                log.info("[Idle-Optimizer] Model hiện tại [{}] vẫn duy trì hiệu năng tối ưu (Độ trễ: {}ms)",
                        fastestModel, lowestLatency);
            }
            this.lastOptimizedLatencyMs = lowestLatency;
            this.lastOptimizedTime = LocalDateTime.now();
        }
    }

    /**
     * Xử lý tin nhắn chat của khách hàng với cơ chế Auto-Failover đa tầng:
     * Tự động thử model tối ưu hiện tại, nếu gặp lỗi/rate-limit thì tự động fallback ngay sang model khác trong pool
     * mà khách hàng không hề hay biết hay bị gián đoạn trải nghiệm.
     */
    public AiChatMessageDto chat(AiChatRequest request) {
        String userPrompt = request.getPrompt();
        if (!StringUtils.hasText(userPrompt)) {
            throw new IllegalArgumentException("Nội dung câu hỏi không được để trống");
        }

        List<OpenRouterMessage> messages = buildMessagesPayload(userPrompt, request.getHistory());
        String nowTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));

        // Tạo danh sách model dự phòng ưu tiên
        List<String> candidateModels = buildCandidateModelList();
        String replyContent = null;
        String successfulModel = null;

        for (String modelToTry : candidateModels) {
            try {
                log.info("Gọi OpenRouter API với model [{}]...", modelToTry);
                OpenRouterRequest payload = OpenRouterRequest.builder()
                        .model(modelToTry)
                        .messages(messages)
                        .temperature(0.7)
                        .build();

                OpenRouterResponse response = restClient.post()
                        .uri("/chat/completions")
                        .body(payload)
                        .retrieve()
                        .body(OpenRouterResponse.class);

                if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
                    OpenRouterChoice choice = response.getChoices().get(0);
                    if (choice.getMessage() != null && StringUtils.hasText(choice.getMessage().getContent())) {
                        replyContent = choice.getMessage().getContent().trim();
                        successfulModel = modelToTry;

                        // Nếu model thành công khác model ban đầu, tự động cập nhật model tối ưu mới
                        if (!modelToTry.equals(this.currentOptimalModel)) {
                            log.info("[Auto-Failover] Đã tự động hoán đổi Model sang [{}] để phục vụ phiên tiếp theo", modelToTry);
                            this.currentOptimalModel = modelToTry;
                        }
                        break;
                    }
                }
            } catch (Exception ex) {
                log.warn("[Auto-Failover] Model [{}] gặp sự cố ({}), tự động dự phòng sang model kế tiếp...",
                        modelToTry, ex.getMessage());
            }
        }

        // Trường hợp tất cả model OpenRouter đều nghẽn: dùng kịch bản fallback thông minh của Showroom
        if (!StringUtils.hasText(replyContent)) {
            log.error("Tất cả model OpenRouter trong pool đều không phản hồi. Kích hoạt fallback tri thức nội bộ.");
            replyContent = generateSmartShowroomFallback(userPrompt);
            successfulModel = "AutoHub Showroom Knowledge Engine";
        }

        return AiChatMessageDto.builder()
                .id("msg-" + System.currentTimeMillis())
                .sender("AI")
                .senderTitle("AutoHub AI Consultant")
                .timestamp(nowTime)
                .content(replyContent)
                .currentModel(successfulModel)
                .suggestedPrompts(generateSuggestedPrompts(userPrompt))
                .build();
    }

    public List<AiChatMessageDto> getInitialMessages() {
        String nowTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
        AiChatMessageDto greeting = AiChatMessageDto.builder()
                .id("msg-init-1")
                .sender("AI")
                .senderTitle("AutoHub AI Consultant")
                .timestamp(nowTime)
                .content("Xin chào quý khách! Tôi là trợ lý AutoHub AI Consultant (vận hành trên nền tảng AI thông minh tự động tối ưu hóa tốc độ & ngữ cảnh). Tôi có thể hỗ trợ quý khách tìm kiếm mẫu xe điện ưng ý, tính toán chi phí lăn bánh, tư vấn gói phụ kiện hoặc chính sách cọc xe giữ chỗ 72 giờ qua SePay. Quý khách đang quan tâm đến dòng xe nào hôm nay?")
                .suggestedPrompts(List.of(
                        "Tư vấn mẫu xe điện tầm giá 2 tỷ",
                        "So sánh AutoHub GT-e Grand Touring vs Track Edition",
                        "Chi phí lăn bánh tại TP. Hồ Chí Minh",
                        "Chính sách cọc giữ chỗ 72h qua SePay"
                ))
                .build();

        return List.of(greeting);
    }

    public Map<String, Object> getAiStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("currentOptimalModel", currentOptimalModel);
        status.put("lastOptimizedLatencyMs", lastOptimizedLatencyMs);
        status.put("lastOptimizedTime", lastOptimizedTime);
        status.put("status", "ACTIVE_OPTIMIZED");
        status.put("poolSize", properties.getFallbackModels().size());
        return status;
    }

    private List<String> buildCandidateModelList() {
        List<String> list = new ArrayList<>();
        if (StringUtils.hasText(currentOptimalModel)) {
            list.add(currentOptimalModel);
        }
        for (String m : properties.getFallbackModels()) {
            if (!list.contains(m)) {
                list.add(m);
            }
        }
        return list;
    }

    private List<OpenRouterMessage> buildMessagesPayload(String userPrompt, List<com.autohub.integration.openrouter.dto.ChatMessageHistoryDto> history) {
        List<OpenRouterMessage> messages = new ArrayList<>();
        messages.add(OpenRouterMessage.builder()
                .role("system")
                .content(buildSystemPrompt())
                .build());

        if (history != null) {
            for (var h : history) {
                if (StringUtils.hasText(h.getContent())) {
                    messages.add(OpenRouterMessage.builder()
                            .role(h.getRole())
                            .content(h.getContent())
                            .build());
                }
            }
        }

        messages.add(OpenRouterMessage.builder()
                .role("user")
                .content(userPrompt)
                .build());

        return messages;
    }

    private String buildSystemPrompt() {
        StringBuilder sb = new StringBuilder();
        sb.append("Bạn là Cố Vấn Bán Hàng & Chuyên Viên Kỹ Thuật Cao Cấp của hệ thống AutoHub Việt Nam (AutoHub AI Consultant).\n");
        sb.append("Phong cách: Lịch sự, chuyên nghiệp, am hiểu sâu sắc về ô tô điện, công nghệ pin, trạm sạc và chính sách bảo hành.\n");
        sb.append("Chính sách cốt lõi của AutoHub:\n");
        sb.append("- Đặt cọc giữ chỗ trực tuyến: Giữ xe 72 giờ qua cổng SePay, có quyền yêu cầu hoàn cọc theo quy định.\n");
        sb.append("- Lái thử xe: Hỗ trợ lái thử tại showroom hoặc giao xe lái thử tận nhà miễn phí.\n");
        sb.append("- Dự toán chi phí lăn bánh: Gồm lệ phí trước bạ, phí cấp biển số theo tỉnh thành, đăng kiểm, bảo hiểm TNDS.\n");

        try {
            List<DongXe> dongXes = dongXeRepository.findAll();
            if (!dongXes.isEmpty()) {
                sb.append("\nDanh sách dòng xe hiện có tại Showroom AutoHub:\n");
                for (DongXe dx : dongXes) {
                    sb.append("- Dòng xe: ").append(dx.getTenDongXe()).append(" (Phân khúc: ").append(dx.getPhanKhuc()).append(")\n");
                }
            }
            List<PhienBanXe> phienBans = phienBanXeRepository.findAll();
            if (!phienBans.isEmpty()) {
                sb.append("Các phiên bản tiêu biểu:\n");
                for (PhienBanXe pb : phienBans) {
                    sb.append("  + ").append(pb.getTenPhienBan())
                            .append(": Giá niêm yết ").append(pb.getGiaNiemYet()).append(" VNĐ")
                            .append(", Tiền cọc: ").append(pb.getMucTienCoc()).append(" VNĐ\n");
                }
            }
        } catch (Exception e) {
            log.warn("Không thể tải thông tin xe từ database: {}", e.getMessage());
        }

        sb.append("\nHãy luôn trả lời khách hàng bằng tiếng Việt tự nhiên, súc tích, chuyên nghiệp và kết thúc bằng một câu hỏi gợi mở hoặc hướng dẫn đặt cọc / lái thử khi phù hợp.");
        return sb.toString();
    }

    private String generateSmartShowroomFallback(String userPrompt) {
        String lower = userPrompt.toLowerCase();
        if (lower.contains("track edition") || lower.contains("grand touring") || lower.contains("so sánh")) {
            return "Phiên bản AutoHub GT-e Track Edition được tối ưu hiệu năng thể thao với công suất 750 mã lực, phanh gốm carbon và gia tốc 0-100 km/h trong 2.6 giây. Trong khi đó, bản Grand Touring tối ưu sự êm ái, cách âm đa lớp và phạm vi di chuyển dài hơn (+60 km). Quý khách có thể đăng ký lái thử trực tiếp hoặc đặt cọc giữ chỗ 72 giờ ngay trên hệ thống.";
        }
        if (lower.contains("giá") || lower.contains("chi phí") || lower.contains("lăn bánh")) {
            return "Giá xe AutoHub được niêm yết minh bạch. Chi phí lăn bánh thực tế bao gồm lệ phí trước bạ, phí cấp biển số, đăng kiểm và bảo hiểm TNDS theo địa phương của quý khách. Quý khách có thể sử dụng công cụ 'Dự toán lăn bánh' trên thanh menu hoặc cọc xe 72 giờ để khóa ưu đãi tốt nhất hôm nay.";
        }
        return "Cảm ơn quý khách đã quan tâm đến AutoHub! Hệ thống cố vấn tự động ghi nhận nhu cầu của quý khách và sẵn sàng hỗ trợ lái thử tận nhà miễn phí hoặc tư vấn phương án tài chính trả góp linh hoạt. Quý khách vui lòng để lại số điện thoại hoặc chọn câu hỏi gợi ý bên dưới để được kết nối chuyên viên tư vấn.";
    }

    private List<String> generateSuggestedPrompts(String userPrompt) {
        String lower = userPrompt.toLowerCase();
        if (lower.contains("giá") || lower.contains("tiền") || lower.contains("chi phí")) {
            return List.of(
                    "Dự toán chi phí lăn bánh tại Hà Nội",
                    "Dự toán chi phí lăn bánh tại TP.HCM",
                    "Đặt cọc giữ chỗ 72h ngay"
            );
        }
        if (lower.contains("pin") || lower.contains("sạc") || lower.contains("km")) {
            return List.of(
                    "Công nghệ pin 800V SiC sạc bao lâu đầy?",
                    "Giải pháp trạm sạc tại nhà chuẩn AutoHub",
                    "Đăng ký lái thử xe trải nghiệm"
            );
        }
        return List.of(
                "So sánh các phiên bản xe điện",
                "Dự toán chi phí lăn bánh",
                "Đăng ký lái thử xe miễn phí"
        );
    }
}
