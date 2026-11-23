package com.autohub.core.ai.service;

import com.autohub.core.ai.config.AiConfig;
import com.autohub.core.ai.dto.AiChatMessageDto;
import com.autohub.core.ai.dto.AiChatRequest;
import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import com.autohub.core.ai.executor.AiIntentExecutor;
import com.autohub.core.ai.router.AiQueryRouter;
import com.autohub.core.engagement.entity.NhatKyTuVan;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.NhatKyTuVanRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
public class AiOrchestratorService {

    private final AiQueryRouter aiQueryRouter;
    private final List<AiIntentExecutor> executors;
    private final ChatClient plainChatClient;
    private final NhatKyTuVanRepository nhatKyTuVanRepository;
    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final NguoiDungRepository nguoiDungRepository;

    public AiOrchestratorService(
            AiQueryRouter aiQueryRouter,
            List<AiIntentExecutor> executors,
            @Qualifier("plainChatClient") ChatClient plainChatClient,
            NhatKyTuVanRepository nhatKyTuVanRepository,
            YeuCauTuVanRepository yeuCauTuVanRepository,
            NguoiDungRepository nguoiDungRepository) {
        this.aiQueryRouter = aiQueryRouter;
        this.executors = executors;
        this.plainChatClient = plainChatClient;
        this.nhatKyTuVanRepository = nhatKyTuVanRepository;
        this.yeuCauTuVanRepository = yeuCauTuVanRepository;
        this.nguoiDungRepository = nguoiDungRepository;
    }

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    @Transactional
    public AiChatMessageDto processUserChat(AiChatRequest request) {
        String prompt = request.getPrompt() != null ? request.getPrompt().trim() : "";
        long startMs = System.currentTimeMillis();

        // 1. ROUTER: Định tuyến ý định qua Spring AI Structured Output
        AiRouteDecision decision = aiQueryRouter.routeUserPrompt(prompt);
        log.info("[AiOrchestrator] Quyết định điều hướng: Intent={}, sortOrder={}", decision.intent(),
                decision.sortOrder());

        // Không kế thừa ngữ cảnh xe cũ khi người dùng hỏi toàn bộ danh mục / danh sách
        // xe
        String pLower = prompt.toLowerCase();
        boolean isPriceRankingOrNewCatalog = "PRICE_DESC".equalsIgnoreCase(decision.sortOrder())
                || "PRICE_ASC".equalsIgnoreCase(decision.sortOrder())
                || pLower.contains("danh sách")
                || pLower.contains("tất cả")
                || pLower.contains("các xe")
                || pLower.contains("các loại")
                || pLower.contains("những xe")
                || pLower.contains("toàn bộ")
                || pLower.contains("bảng giá")
                || pLower.contains("tìm xe")
                || pLower.contains("rẻ nhất")
                || pLower.contains("đắt nhất");

        final AiRouteDecision finalDecision = (!isPriceRankingOrNewCatalog
                && (decision.targetVehicleName() == null || decision.targetVehicleName().isBlank())
                && ((request.getContextCarName() != null && !request.getContextCarName().isBlank())
                        || request.getContextCarId() != null))
                                ? decision.withContext(request.getContextCarName(), request.getContextCarId())
                                : decision;

        if (finalDecision != decision) {
            log.info("[AiOrchestrator] Gán ngữ cảnh xe từ phiên chat: carId={}, carName={}",
                    finalDecision.contextCarId(), finalDecision.targetVehicleName());
        }

        // 2. EXECUTOR: Tìm Executor chuyên trách theo Strategy Pattern
        AiIntentExecutor executor = executors.stream()
                .filter(e -> e.supports(finalDecision.intent()))
                .findFirst()
                .orElseGet(() -> executors.stream()
                        .filter(e -> e.supports(AiIntent.CAR_CONSULTATION))
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException("Không tìm thấy Executor khả dụng")));

        // 3. EXECUTION: Thực thi nghiệp vụ trên SQL Server AutoHubDB & chuẩn bị
        // Generative UI block
        AiExecutionResult result = executor.execute(finalDecision, prompt);
        // 4. LLM SYNTHESIS: Sử dụng Gemini để tổng hợp câu trả lời
        String finalAnswer = null;
        if (finalDecision.intent() == AiIntent.BOOK_TEST_DRIVE
                || (result.getAiAnswerText() != null && result.getAiAnswerText().contains("Mã phiếu cọc"))) {
            // Đối với giao dịch (Lái thử hoặc Lập phiếu cọc): Dùng trực tiếp dữ liệu từ
            // Executor để bảo đảm mã CSDL chuẩn 100%
            finalAnswer = result.getAiAnswerText();
        } else {
            try {
                String synthesisPrompt = buildSynthesisSystemPrompt(result.getRetrievedContext(), finalDecision);
                log.info("[AiOrchestrator] Gửi prompt tới Gemini để tổng hợp câu trả lời thông minh");
                finalAnswer = plainChatClient.prompt()
                        .system(synthesisPrompt)
                        .user(prompt)
                        .call()
                        .content();
                log.info("[AiOrchestrator] Gemini đã sinh lời phản hồi thành công!");
            } catch (Exception ex) {
                log.warn("[AiOrchestrator] Gemini synthesis gặp sự cố [{}]: {}, sử dụng fallback text của Executor",
                        ex.getClass().getSimpleName(), ex.getMessage());
            }
        }

        // 👈 THÊM LẠI CÁC DÒNG NÀY (ĐÃ BỊ XÓA NHẦM TRƯỚC ĐÓ)
        if (finalAnswer == null || finalAnswer.isBlank()) {
            finalAnswer = result.getAiAnswerText();
        }

        long latencyMs = System.currentTimeMillis() - startMs;
        log.info("[AiOrchestrator] Hoàn tất phản hồi trong {} ms với uiBlockType: {}", latencyMs,
                result.getUiBlockType());

        // 5. TELEMETRY: Ghi nhật ký tư vấn vào dbo.nhat_ky_tu_van
        saveConsultationLog(prompt, finalAnswer, (int) latencyMs, request.getConsultationId());
        // 6. CONTRACT RESPONSE
        String nowTime = LocalDateTime.now().format(TIME_FMT);
        return AiChatMessageDto.builder()
                .id("ai-msg-" + System.currentTimeMillis())
                .sender("AI")
                .senderTitle("AutoHub AI Specialist (Google Gemini 1.5 Flash & Spring AI)")
                .timestamp(nowTime)
                .content(finalAnswer)
                .uiBlockType(result.getUiBlockType())
                .recommendedVehicle(result.getRecommendedVehicle())
                .recommendedAccessory(result.getRecommendedAccessory())
                .rolloutFeeData(result.getRolloutFeeData())
                .inventoryData(result.getInventoryData())
                .suggestedPrompts(result.getSuggestedPrompts() != null ? result.getSuggestedPrompts()
                        : List.of(
                                "Dự toán chi phí lăn bánh tại Hà Nội",
                                "Kiểm tra số lượng xe có sẵn tại Showroom",
                                "Chính sách bảo hành pin xe điện 800V SiC",
                                "Đặt cọc giữ xe 72h ngay bây giờ"))
                .build();
    }

    private String buildSynthesisSystemPrompt(String retrievedContext, AiRouteDecision decision) {
        // Nếu là chào hỏi hoặc trò chuyện ngoài lề: Chỉ dẫn AI trả lời tự nhiên, thân
        // thiện, không gán xe
        if (decision.intent() == AiIntent.GENERAL_GREETING || decision.intent() == AiIntent.GENERAL_CONVERSATION) {
            return """
                    Bạn là Trợ lý AI Chuyên gia Ô tô của AutoHub.
                    Người dùng đang gửi lời chào hoặc trò chuyện thông thường ngoài lề (hỏi thăm sức khỏe, thời tiết, toán học, trò chuyện đời sống).

                    NGUYÊN TẮC PHẢN HỒI BẮT BUỘC:
                    1. Trả lời một cách tự nhiên, lịch sự, thông minh và thân thiện bằng Tiếng Việt.
                    2. Nếu là câu hỏi thường nhật hoặc ngoài lề, hãy trả lời đúng câu hỏi của người dùng một cách ngắn gọn, tự nhiên.
                    3. TUYỆT ĐỐI KHÔNG tự động gắn thẻ xe, không liệt kê thông số kỹ thuật xe và không ép buộc mua xe khi người dùng chưa hỏi về xe.
                    4. Có thể khéo léo gợi ý ở cuối câu: "Nếu quý khách cần tư vấn xe, tính chi phí lăn bánh hay đăng ký lái thử tại AutoHub, tôi luôn sẵn sàng hỗ trợ nhé!".
                    5. Nếu người dùng hỏi về xóa CSDL, hack, can thiệp hệ thống: trả lời lịch sự rằng bạn là AI tư vấn với quyền đọc tra cứu (Read-only), hệ thống CSDL AutoHubDB được bảo mật đa tầng bởi Spring Security RBAC.
                    """
                    .trim();
        }

        // Với các câu hỏi tư vấn xe, lăn bánh, tồn kho, cọc xe, phụ kiện: Giữ nguyên
        // grounding CSDL nghiêm ngặt
        StringBuilder sb = new StringBuilder();
        sb.append(AiConfig.SYSTEM_PROMPT).append("\n\n");
        sb.append("DỮ LIỆU ĐỐI SOÁT THỜI GIAN THỰC TỪ CƠ SỞ DỮ LIỆU SQL SERVER AUTOHUBDB:\n");
        if (retrievedContext != null && !retrievedContext.isBlank()) {
            sb.append(retrievedContext).append("\n\n");
        } else {
            sb.append(
                    "Hệ thống AutoHub hiện phân phối các dòng xe điện và xe đa dụng chính hãng tại Việt Nam, chính sách cọc giữ xe 72h hoàn tiền 100% không mất phí, pin bảo hành 10 năm/200.000km.\n\n");
        }
        sb.append("HƯỚNG DẪN & NGUYÊN TẮC BẮT BUỘC DÀNH CHO AI SPECIALIST:\n");
        sb.append("1. NGUYÊN TẮC TRUNG THỰC VỚI CSDL (GROUNDING - SINGLE SOURCE OF TRUTH):\n");
        sb.append(
                "   - CHỈ ĐƯỢC PHÉP tư vấn các mẫu xe và mức giá có trong phần 'DỮ LIỆU ĐỐI SOÁT THỜI GIAN THỰC' ở trên.\n");
        sb.append(
                "   - TUYỆT ĐỐI CẤM tự bịa ra bất kỳ mẫu xe, dòng xe hoặc mức giá nào khác không tồn tại trong dữ liệu được cung cấp.\n");
        sb.append(
                "   - Mẫu xe được đánh dấu [XE TRỌNG TÂM #1] (hoặc đứng đầu danh sách) ĐÃ ĐƯỢC HỆ THỐNG KHÓA CHẶT VÀO THẺ XE HIỂN THỊ TRỰC QUAN (recommendedCar) bên dưới giao diện người dùng. Câu trả lời của bạn BẮT BUỘC phải đồng bộ 100% với mẫu xe này (khẳng định rõ ràng mẫu xe này là rẻ nhất / đắt nhất / phù hợp nhất theo câu hỏi).\n");
        sb.append(
                "2. Nếu người dùng hỏi về bảo hành pin/xe điện: giải thích rõ ràng chính sách bảo hành 10 năm hoặc 200.000km, cam kết đổi mới bộ pin miễn phí khi dung lượng (SOH) < 70%, công nghệ sạc 800V SiC sạc 10-80% trong 18 phút.\n");
        sb.append(
                "3. Nếu người dùng hỏi về bảo mật, xóa CSDL, can thiệp hệ thống: khẳng định lịch sự rằng bạn là AI tư vấn chuyên môn của AutoHub, chỉ có quyền đọc tra cứu thông tin hỗ trợ khách hàng, hoàn toàn KHÔNG có quyền can thiệp hay xóa cơ sở dữ liệu hệ thống (được bảo vệ nghiêm ngặt bởi Spring Security và chính sách an toàn của AutoHub).\n");
        sb.append(
                "4. Phong cách trình bày: Ngắn gọn, chuyên nghiệp, sử dụng định dạng in đậm (**tên xe**, **giá bán**) và gạch đầu dòng rõ ràng, ngắt đoạn tự nhiên, tôn trọng sự thật dữ liệu.\n");
        return sb.toString();
    }

    private void saveConsultationLog(String prompt, String answer, int latencyMs, Long consultationId) {
        try {
            YeuCauTuVan lead = null;
            if (consultationId != null) {
                lead = yeuCauTuVanRepository.findById(consultationId).orElse(null);
            }
            if (lead == null) {
                lead = yeuCauTuVanRepository.findAll(PageRequest.of(0, 1)).getContent().stream().findFirst()
                        .orElse(null);
            }

            NguoiDung staff = nguoiDungRepository.findAll(PageRequest.of(0, 1)).getContent().stream().findFirst()
                    .orElse(null);

            if (lead != null && staff != null) {
                String exchangeContent = "[Khách]: " + prompt + "\n[AutoHub AI Router-Executor]: " + answer;
                if (exchangeContent.length() > 4000) {
                    exchangeContent = exchangeContent.substring(0, 3990) + "...";
                }

                NhatKyTuVan logEntity = NhatKyTuVan.builder()
                        .yeuCauTuVan(lead)
                        .nhanVien(staff)
                        .loaiTuongTac("AI_CHAT")
                        .noiDungTraoDoi(exchangeContent)
                        .thoiGianPhanHoiMs(latencyMs)
                        .thoiGianTuongTac(LocalDateTime.now())
                        .ketQuaCuocGoi("AI_RESOLVED")
                        .build();

                nhatKyTuVanRepository.save(logEntity);
                log.info("[AiOrchestrator] Đã ghi telemetry nhat_ky_tu_van ID: {}, latency: {} ms", logEntity.getId(),
                        latencyMs);
            }
        } catch (Exception e) {
            log.error("[AiOrchestrator] Không thể lưu nhat_ky_tu_van: {}", e.getMessage());
        }
    }
}