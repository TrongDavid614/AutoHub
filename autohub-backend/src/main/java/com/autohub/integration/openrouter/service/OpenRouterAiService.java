package com.autohub.integration.openrouter.service;

import com.autohub.core.car.entity.DongXe;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.DongXeRepository;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.integration.openrouter.config.OpenRouterProperties;
import com.autohub.integration.openrouter.dto.AiChatMessageDto;
import com.autohub.integration.openrouter.dto.AiChatRequest;
import com.autohub.integration.openrouter.dto.AiModelOptionDto;
import com.autohub.integration.openrouter.dto.openrouter.OpenRouterWireDtos.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenRouterAiService {

    private final OpenRouterProperties properties;
    private final DongXeRepository dongXeRepository;
    private final PhienBanXeRepository phienBanXeRepository;

    private RestClient restClient;
    private String currentActiveModel;
    private final List<AiModelOptionDto> supportedModels = new CopyOnWriteArrayList<>();

    @PostConstruct
    public void init() {
        this.currentActiveModel = properties.getDefaultModel();

        // Khởi tạo RestClient kết nối OpenRouter
        this.restClient = RestClient.builder()
                .baseUrl(properties.getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + properties.getApiKey())
                .defaultHeader("HTTP-Referer", properties.getSiteUrl())
                .defaultHeader("X-Title", properties.getAppName())
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();

        // Khởi tạo danh sách các Model OpenRouter hỗ trợ
        initSupportedModels();
        log.info("OpenRouterAiService initialized with active model: {}", currentActiveModel);
    }

    private void initSupportedModels() {
        supportedModels.clear();
        supportedModels.add(new AiModelOptionDto("liquid/lfm-3-1.7b:free", "Liquid LFM 3 1.7B (Free)", "Liquid AI", true, false));
        supportedModels.add(new AiModelOptionDto("google/gemma-4-31b-it:free", "Google Gemma 4 31B (Free)", "Google", true, false));
        supportedModels.add(new AiModelOptionDto("nvidia/nemotron-3.5-super-vl:free", "NVIDIA Nemotron 3.5 (Free)", "NVIDIA", true, false));
        supportedModels.add(new AiModelOptionDto("google/gemini-2.0-flash-001", "Google Gemini 2.0 Flash", "Google Cloud", false, false));
        supportedModels.add(new AiModelOptionDto("openai/gpt-4o-mini", "OpenAI GPT-4o Mini", "OpenAI", false, false));
        supportedModels.add(new AiModelOptionDto("deepseek/deepseek-chat", "DeepSeek V3", "DeepSeek", false, false));

        updateActiveFlag();
    }

    private void updateActiveFlag() {
        for (AiModelOptionDto m : supportedModels) {
            m.setActive(m.getId().equalsIgnoreCase(currentActiveModel));
        }
    }

    public List<AiModelOptionDto> getSupportedModels() {
        updateActiveFlag();
        return Collections.unmodifiableList(supportedModels);
    }

    public String getCurrentActiveModel() {
        return currentActiveModel;
    }

    public synchronized AiModelOptionDto switchModel(String modelId) {
        if (!StringUtils.hasText(modelId)) {
            throw new IllegalArgumentException("Mã model OpenRouter không được để trống");
        }
        this.currentActiveModel = modelId.trim();
        updateActiveFlag();
        log.info("Đã chuyển đổi OpenRouter model đang hoạt động sang: {}", currentActiveModel);

        return supportedModels.stream()
                .filter(m -> m.getId().equalsIgnoreCase(currentActiveModel))
                .findFirst()
                .orElse(new AiModelOptionDto(currentActiveModel, currentActiveModel, "Custom", false, true));
    }

    public AiChatMessageDto chat(AiChatRequest request) {
        String effectiveModel = StringUtils.hasText(request.getModel())
                ? request.getModel().trim()
                : currentActiveModel;

        String userPrompt = request.getPrompt();
        if (!StringUtils.hasText(userPrompt)) {
            throw new IllegalArgumentException("Nội dung câu hỏi không được để trống");
        }

        List<OpenRouterMessage> messages = new ArrayList<>();

        // 1. System Prompt kết hợp dữ liệu ngữ cảnh Showroom
        String systemPrompt = buildSystemPrompt();
        messages.add(OpenRouterMessage.builder()
                .role("system")
                .content(systemPrompt)
                .build());

        // 2. Lịch sử chat (nếu có)
        if (request.getHistory() != null) {
            for (var h : request.getHistory()) {
                if (StringUtils.hasText(h.getContent())) {
                    messages.add(OpenRouterMessage.builder()
                            .role(h.getRole())
                            .content(h.getContent())
                            .build());
                }
            }
        }

        // 3. User Prompt hiện tại
        messages.add(OpenRouterMessage.builder()
                .role("user")
                .content(userPrompt)
                .build());

        OpenRouterRequest payload = OpenRouterRequest.builder()
                .model(effectiveModel)
                .messages(messages)
                .temperature(0.7)
                .build();

        String nowTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));

        try {
            log.info("Sending request to OpenRouter API (model: {})", effectiveModel);
            OpenRouterResponse response = restClient.post()
                    .uri("/chat/completions")
                    .body(payload)
                    .retrieve()
                    .body(OpenRouterResponse.class);

            String replyContent = "";
            if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
                OpenRouterChoice choice = response.getChoices().get(0);
                if (choice.getMessage() != null && choice.getMessage().getContent() != null) {
                    replyContent = choice.getMessage().getContent().trim();
                }
            }

            if (!StringUtils.hasText(replyContent)) {
                replyContent = "Xin lỗi quý khách, mô hình AI hiện không thể tạo phản hồi. Vui lòng thử lại với model khác.";
            }

            return AiChatMessageDto.builder()
                    .id("msg-" + System.currentTimeMillis())
                    .sender("AI")
                    .senderTitle("AutoHub AI (" + getShortModelName(effectiveModel) + ")")
                    .timestamp(nowTime)
                    .content(replyContent)
                    .currentModel(effectiveModel)
                    .suggestedPrompts(generateSuggestedPrompts(userPrompt))
                    .build();

        } catch (Exception ex) {
            log.error("Lỗi khi gọi OpenRouter API với model [{}]: {}", effectiveModel, ex.getMessage());
            String friendlyMsg = "Không thể kết nối đến OpenRouter API (" + ex.getMessage() + "). Quý khách có thể thử chuyển sang Model OpenRouter khác.";
            
            return AiChatMessageDto.builder()
                    .id("err-" + System.currentTimeMillis())
                    .sender("AI")
                    .senderTitle("AutoHub AI (" + getShortModelName(effectiveModel) + ")")
                    .timestamp(nowTime)
                    .content(friendlyMsg)
                    .currentModel(effectiveModel)
                    .suggestedPrompts(List.of(
                            "Chuyển sang Model Google Gemma 4 (Free)",
                            "Chuyển sang Model Liquid LFM 3 (Free)",
                            "Dự toán chi phí lăn bánh",
                            "Chính sách cọc xe giữ chỗ 72h"
                    ))
                    .build();
        }
    }

    public List<AiChatMessageDto> getInitialMessages() {
        String nowTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
        AiChatMessageDto greeting = AiChatMessageDto.builder()
                .id("msg-init-1")
                .sender("AI")
                .senderTitle("AutoHub AI (" + getShortModelName(currentActiveModel) + ")")
                .timestamp(nowTime)
                .content("Xin chào quý khách! Tôi là trợ lý AutoHub AI Consultant (kết nối trực tiếp qua OpenRouter AI Proxy). Tôi có thể hỗ trợ quý khách tìm kiếm dòng xe điện ưng ý, tính toán chi phí lăn bánh, hoặc đề xuất gói phụ kiện chuẩn kỹ thuật. Quý khách cũng có thể linh hoạt chuyển đổi mô hình AI (Gemma, LFM, Gemini, GPT...) ngay trong cuộc trò chuyện!")
                .currentModel(currentActiveModel)
                .suggestedPrompts(List.of(
                        "Tư vấn mẫu xe điện tầm giá 2 tỷ",
                        "So sánh AutoHub GT-e Grand Touring vs Track Edition",
                        "Chi phí lăn bánh tại TP. Hồ Chí Minh",
                        "Chính sách cọc giữ chỗ 72h qua SePay"
                ))
                .build();

        return List.of(greeting);
    }

    private String buildSystemPrompt() {
        StringBuilder sb = new StringBuilder();
        sb.append("Bạn là Cố Vấn Bán Hàng & Chuyên Viên Kỹ Thuật Cao Cấp của hệ thống AutoHub Việt Nam (AutoHub AI Consultant).\n");
        sb.append("Phong cách: Lịch sự, chuyên nghiệp, am hiểu sâu về xe điện, pin, công nghệ sạc và chính sách bảo hành.\n");
        sb.append("Chính sách cốt lõi của AutoHub:\n");
        sb.append("- Đặt cọc giữ chỗ trực tuyến: Giữ xe trong 72 giờ qua cổng SePay, có quyền yêu cầu hoàn cọc theo quy định.\n");
        sb.append("- Lái thử xe: Hỗ trợ lái thử tại showroom hoặc giao xe lái thử tận nhà miễn phí.\n");
        sb.append("- Dự toán chi phí lăn bánh: Bao gồm lệ phí trước bạ, phí cấp biển số theo tỉnh thành, đăng kiểm, bảo hiểm TNDS.\n");

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

        sb.append("\nHãy luôn trả lời khách hàng bằng tiếng Việt tự nhiên, súc tích và kết thúc bằng một câu hỏi gợi mở hoặc hướng dẫn đặt cọc / lái thử khi phù hợp.");
        return sb.toString();
    }

    private String getShortModelName(String model) {
        if (model == null) return "AI";
        if (model.contains("/")) {
            String sub = model.substring(model.indexOf('/') + 1);
            return sub.replace(":free", "").trim();
        }
        return model;
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
