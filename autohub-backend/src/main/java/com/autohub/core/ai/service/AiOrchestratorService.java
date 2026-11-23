package com.autohub.core.ai.service;

import com.autohub.core.ai.config.AiConfig;
import com.autohub.core.ai.dto.AiChatMessageDto;
import com.autohub.core.ai.dto.AiChatRequest;
import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import com.autohub.core.ai.executor.AiIntentExecutor;
import com.autohub.core.ai.router.AiQueryRouter;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.engagement.entity.NhatKyTuVan;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.NhatKyTuVanRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.LoaiHanhViTracking;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.entity.NhatKyHanhVi;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.core.user.repository.NhatKyHanhViRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AiOrchestratorService {

    private final AiQueryRouter aiQueryRouter;
    private final List<AiIntentExecutor> executors;
    private final ChatClient plainChatClient;
    private final NhatKyTuVanRepository nhatKyTuVanRepository;
    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final NhatKyHanhViRepository nhatKyHanhViRepository;
    private final PhienBanXeRepository phienBanXeRepository;

    public AiOrchestratorService(
            AiQueryRouter aiQueryRouter,
            List<AiIntentExecutor> executors,
            @Qualifier("plainChatClient") ChatClient plainChatClient,
            NhatKyTuVanRepository nhatKyTuVanRepository,
            YeuCauTuVanRepository yeuCauTuVanRepository,
            NguoiDungRepository nguoiDungRepository,
            NhatKyHanhViRepository nhatKyHanhViRepository,
            PhienBanXeRepository phienBanXeRepository
    ) {
        this.aiQueryRouter = aiQueryRouter;
        this.executors = executors;
        this.plainChatClient = plainChatClient;
        this.nhatKyTuVanRepository = nhatKyTuVanRepository;
        this.yeuCauTuVanRepository = yeuCauTuVanRepository;
        this.nguoiDungRepository = nguoiDungRepository;
        this.nhatKyHanhViRepository = nhatKyHanhViRepository;
        this.phienBanXeRepository = phienBanXeRepository;
    }

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    @Transactional
    public AiChatMessageDto processUserChat(AiChatRequest request) {
        String prompt = request.getPrompt() != null ? request.getPrompt().trim() : "";
        long startMs = System.currentTimeMillis();

        // 0. TELEMETRY: Phân tích hành vi duyệt web trong phiên hiện tại để cá nhân hóa
        String telemetryContext = extractTelemetryContext(request);

        // 1. ROUTER: Định tuyến ý định qua Spring AI Structured Output
        AiRouteDecision decision = aiQueryRouter.routeUserPrompt(prompt);
        log.info("[AiOrchestrator] Quyết định điều hướng: Intent={}, sortOrder={}", decision.intent(), decision.sortOrder());

        // Ưu tiên ngữ cảnh contextCarId / contextCarName từ request nếu decision chưa có tên xe mới
        // LƯU Ý: Không kế thừa ngữ cảnh xe cũ khi người dùng hỏi tìm kiếm giá (đắt nhất / rẻ nhất / bảng giá toàn hệ thống)
        boolean isPriceRankingOrNewCatalog = "PRICE_DESC".equalsIgnoreCase(decision.sortOrder())
                || "PRICE_ASC".equalsIgnoreCase(decision.sortOrder())
                || decision.intent() == AiIntent.CAR_CONSULTATION && (prompt.toLowerCase().contains("rẻ nhất")
                || prompt.toLowerCase().contains("đắt nhất") || prompt.toLowerCase().contains("bảng giá") || prompt.toLowerCase().contains("tìm xe"));

        final AiRouteDecision finalDecision = (!isPriceRankingOrNewCatalog
                && (decision.targetVehicleName() == null || decision.targetVehicleName().isBlank())
                && ((request.getContextCarName() != null && !request.getContextCarName().isBlank()) || request.getContextCarId() != null))
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

        // 3. EXECUTION: Thực thi nghiệp vụ trên SQL Server AutoHubDB & chuẩn bị Generative UI block
        AiExecutionResult result = executor.execute(finalDecision, prompt);

        // 4. LLM SYNTHESIS: Sử dụng Gemini 3.5 Flash để tổng hợp câu trả lời tự nhiên, trả lời đúng trọng tâm
        String finalAnswer = null;
        try {
            String synthesisPrompt = buildSynthesisSystemPrompt(result.getRetrievedContext(), finalDecision, telemetryContext);
            log.info("[AiOrchestrator] Gửi prompt tới Gemini 3.5 Flash để tổng hợp câu trả lời thông minh");
            finalAnswer = plainChatClient.prompt()
                    .system(synthesisPrompt)
                    .user(prompt)
                    .call()
                    .content();
            log.info("[AiOrchestrator] Gemini 3.5 Flash đã sinh lời phản hồi thành công!");
        } catch (Exception ex) {
            log.warn("[AiOrchestrator] Gemini synthesis gặp sự cố [{}]: {}, sử dụng fallback text của Executor",
                    ex.getClass().getSimpleName(), ex.getMessage());
        }

        if (finalAnswer == null || finalAnswer.isBlank()) {
            finalAnswer = result.getAiAnswerText();
        }

        long latencyMs = System.currentTimeMillis() - startMs;
        log.info("[AiOrchestrator] Hoàn tất phản hồi trong {} ms với uiBlockType: {}", latencyMs, result.getUiBlockType());

        // 5. TELEMETRY: Ghi nhật ký tư vấn vào dbo.nhat_ky_tu_van
        saveConsultationLog(prompt, finalAnswer, (int) latencyMs, request.getConsultationId());

        // 6. CONTRACT RESPONSE
        String nowTime = LocalDateTime.now().format(TIME_FMT);
        return AiChatMessageDto.builder()
                .id("ai-msg-" + System.currentTimeMillis())
                .sender("AI")
                .senderTitle("AutoHub AI Specialist (Google Gemini 3.5 & Spring AI)")
                .timestamp(nowTime)
                .content(finalAnswer)
                .uiBlockType(result.getUiBlockType())
                .recommendedVehicle(result.getRecommendedVehicle())
                .recommendedAccessory(result.getRecommendedAccessory())
                .rolloutFeeData(result.getRolloutFeeData())
                .inventoryData(result.getInventoryData())
                .suggestedPrompts(result.getSuggestedPrompts() != null ? result.getSuggestedPrompts() : List.of(
                        "Dự toán chi phí lăn bánh tại Hà Nội",
                        "Kiểm tra số lượng xe có sẵn tại Showroom",
                        "Chính sách bảo hành pin xe điện 800V SiC",
                        "Đặt cọc giữ xe 72h ngay bây giờ"
                ))
                .build();
    }

    private String buildSynthesisSystemPrompt(String retrievedContext, AiRouteDecision decision, String userTelemetryContext) {
        StringBuilder sb = new StringBuilder();
        sb.append(AiConfig.SYSTEM_PROMPT).append("\n\n");
        sb.append("DỮ LIỆU ĐỐI SOÁT THỜI GIAN THỰC TỪ CƠ SỞ DỮ LIỆU SQL SERVER AUTOHUBDB:\n");
        if (retrievedContext != null && !retrievedContext.isBlank()) {
            sb.append(retrievedContext).append("\n\n");
        } else {
            sb.append("Hệ thống AutoHub hiện phân phối các dòng xe điện và xe đa dụng chính hãng tại Việt Nam, chính sách cọc giữ xe 72h hoàn tiền 100% không mất phí, pin bảo hành 10 năm/200.000km.\n\n");
        }

        if (userTelemetryContext != null && !userTelemetryContext.isBlank()) {
            sb.append("HÀNH TRÌNH TƯƠNG TÁC THỰC TẾ CỦA KHÁCH HÀNG (USER TELEMETRY TRONG PHIÊN):\n");
            sb.append(userTelemetryContext).append("\n");
            sb.append("LƯU Ý CÁ NHÂN HÓA: Khéo léo lồng ghép dữ liệu hành vi trên (nếu phù hợp với câu hỏi) để cá nhân hóa lời tư vấn tự nhiên, thân thiện và thấu hiểu nhu cầu của khách hàng.\n\n");
        }

        sb.append("HƯỚNG DẪN & NGUYÊN TẮC BẮT BUỘC DÀNH CHO AI SPECIALIST:\n");
        sb.append("1. NGUYÊN TẮC TRUNG THỰC VỚI CSDL (GROUNDING - SINGLE SOURCE OF TRUTH):\n");
        sb.append("   - CHỈ ĐƯỢC PHÉP tư vấn các mẫu xe và mức giá có trong phần 'DỮ LIỆU ĐỐI SOÁT THỜI GIAN THỰC' ở trên.\n");
        sb.append("   - TUYỆT ĐỐI CẤM tự bịa ra bất kỳ mẫu xe, dòng xe hoặc mức giá nào khác không tồn tại trong dữ liệu được cung cấp.\n");
        sb.append("   - Mẫu xe được đánh dấu [XE TRỌNG TÂM #1] (hoặc đứng đầu danh sách) ĐÃ ĐƯỢC HỆ THỐNG KHÓA CHẶT VÀO THẺ XE HIỂN THỊ TRỰC QUAN (recommendedCar) bên dưới giao diện người dùng. Câu trả lời của bạn BẮT BUỘC phải đồng bộ 100% với mẫu xe này (khẳng định rõ ràng mẫu xe này là rẻ nhất / đắt nhất / phù hợp nhất theo câu hỏi).\n");
        sb.append("2. Nếu người dùng hỏi về bảo hành pin/xe điện: giải thích rõ ràng chính sách bảo hành 10 năm hoặc 200.000km, cam kết đổi mới bộ pin miễn phí khi dung lượng (SOH) < 70%, công nghệ sạc 800V SiC sạc 10-80% trong 18 phút.\n");
        sb.append("3. Nếu người dùng hỏi về bảo mật, xóa CSDL, can thiệp hệ thống: khẳng định lịch sự rằng bạn là AI tư vấn chuyên môn của AutoHub, chỉ có quyền đọc tra cứu thông tin hỗ trợ khách hàng, hoàn toàn KHÔNG có quyền can thiệp hay xóa cơ sở dữ liệu hệ thống (được bảo vệ nghiêm ngặt bởi Spring Security và chính sách an toàn của AutoHub).\n");
        sb.append("4. Phong cách trình bày: Ngắn gọn, chuyên nghiệp, sử dụng định dạng in đậm (**tên xe**, **giá bán**) và gạch đầu dòng rõ ràng, ngắt đoạn tự nhiên, tôn trọng sự thật dữ liệu.\n");
        return sb.toString();
    }

    private String extractTelemetryContext(AiChatRequest request) {
        if (request.getSessionId() == null || request.getSessionId().isBlank()) {
            return null;
        }
        try {
            List<NhatKyHanhVi> sessionLogs = nhatKyHanhViRepository.findByMaPhien(request.getSessionId());
            if (sessionLogs == null || sessionLogs.isEmpty()) {
                return null;
            }

            // Tìm xe được xem gần nhất hoặc có dwell time cao nhất trong phiên
            Optional<NhatKyHanhVi> recentCarLog = sessionLogs.stream()
                    .filter(l -> "CAR".equalsIgnoreCase(l.getLoaiThucThe()) && l.getMaThucThe() != null)
                    .max(Comparator.comparing(NhatKyHanhVi::getId));

            StringBuilder sb = new StringBuilder();

            if (recentCarLog.isPresent()) {
                Long carId = recentCarLog.get().getMaThucThe();
                Optional<PhienBanXe> carOpt = phienBanXeRepository.findById(carId);
                if (carOpt.isPresent()) {
                    PhienBanXe car = carOpt.get();
                    String carName = (car.getDongXe() != null ? car.getDongXe().getTenDongXe() + " " : "") + car.getTenPhienBan();

                    // Nếu request chưa có context car, tự động gán từ telemetry!
                    if (request.getContextCarId() == null && (request.getContextCarName() == null || request.getContextCarName().isBlank())) {
                        request.setContextCarId(car.getId());
                        request.setContextCarName(carName);
                        log.info("[AiOrchestrator] Tự động suy diễn ngữ cảnh xe từ Telemetry hành vi phiên {}: carId={}, carName={}",
                                request.getSessionId(), car.getId(), carName);
                    }

                    sb.append("- Khách hàng đang quan tâm mẫu xe: ").append(carName);
                    if (recentCarLog.get().getThoiGianDungXem() != null && recentCarLog.get().getThoiGianDungXem() > 0) {
                        sb.append(" (Thời gian dừng xem: ").append(recentCarLog.get().getThoiGianDungXem()).append("s)");
                    }
                    sb.append(".\n");
                }
            }

            // Kiểm tra xem khách có tính dự toán lăn bánh hay xoay 360 độ không
            boolean has360 = sessionLogs.stream().anyMatch(l -> l.getLoaiHanhVi() == LoaiHanhViTracking.INTERACT_360);
            boolean hasEstimator = sessionLogs.stream().anyMatch(l -> l.getLoaiHanhVi() == LoaiHanhViTracking.CALCULATE_ESTIMATOR);
            boolean hasComparison = sessionLogs.stream().anyMatch(l -> l.getLoaiHanhVi() == LoaiHanhViTracking.COMPARE_CARS);

            if (has360) {
                sb.append("- Khách hàng đã chủ động tương tác xoay 360 độ xem ngoại thất/nội thất xe trong Studio.\n");
            }
            if (hasEstimator) {
                sb.append("- Khách hàng đã sử dụng công cụ Dự toán chi phí lăn bánh & bảng tính trả góp ngân hàng.\n");
            }
            if (hasComparison) {
                sb.append("- Khách hàng đã đặt các mẫu xe lên bàn cân so sánh chi tiết.\n");
            }

            if (!sb.isEmpty()) {
                return sb.toString().trim();
            }
        } catch (Exception e) {
            log.warn("[AiOrchestrator] Lỗi khi trích xuất ngữ cảnh telemetry: {}", e.getMessage());
        }
        return null;
    }

    private void saveConsultationLog(String prompt, String answer, int latencyMs, Long consultationId) {
        try {
            YeuCauTuVan lead = null;
            if (consultationId != null) {
                lead = yeuCauTuVanRepository.findById(consultationId).orElse(null);
            }
            if (lead == null) {
                lead = yeuCauTuVanRepository.findAll(PageRequest.of(0, 1)).getContent().stream().findFirst().orElse(null);
            }

            NguoiDung staff = nguoiDungRepository.findAll(PageRequest.of(0, 1)).getContent().stream().findFirst().orElse(null);

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
                log.info("[AiOrchestrator] Đã ghi telemetry nhat_ky_tu_van ID: {}, latency: {} ms", logEntity.getId(), latencyMs);
            }
        } catch (Exception e) {
            log.error("[AiOrchestrator] Không thể lưu nhat_ky_tu_van: {}", e.getMessage());
        }
    }
}
