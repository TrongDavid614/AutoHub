package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import com.autohub.core.ai.tools.CheckDepositPaymentTool;
import com.autohub.core.ai.tools.CreateCarDepositTool;
import com.autohub.core.ai.tools.CreateCarDepositTool.DepositActionResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class DepositPolicyExecutor implements AiIntentExecutor {

    private final VectorStore vectorStore;
    private final CreateCarDepositTool createCarDepositTool;
    private final CheckDepositPaymentTool checkDepositPaymentTool;

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.DEPOSIT_POLICY_72H;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        log.info("[DepositPolicyExecutor] Tiếp nhận yêu cầu: '{}'", originalPrompt);
        String pLower = originalPrompt != null ? originalPrompt.toLowerCase() : "";

        // =========================================================================
        // NHÁNH 0: KIỂM TRA THANH TOÁN SEPAY -> Gọi CheckDepositPaymentTool
        // =========================================================================
        boolean isCheckPayment = pLower.contains("đã chuyển khoản")
                || pLower.contains("chuyển khoản rồi")
                || pLower.contains("ck rồi")
                || pLower.contains("đã ck")
                || pLower.contains("vừa chuyển khoản")
                || pLower.contains("vừa ck")
                || pLower.contains("kiểm tra thanh toán")
                || pLower.contains("thanh toán rồi")
                || pLower.contains("kiểm tra cọc")
                || pLower.contains("kiểm tra tiền cọc")
                || pLower.contains("kiểm tra sepay")
                || pLower.contains("sepay")
                || pLower.contains("xác nhận thanh toán")
                || pLower.contains("đã nhận được tiền")
                || pLower.contains("đã nhận được cọc")
                || pLower.contains("thanh toán thành công chưa")
                || pLower.contains("check ck")
                || pLower.contains("check thanh toán");

        if (isCheckPayment) {
            log.info("[DepositPolicyExecutor] Nhận diện yêu cầu KIỂM TRA THANH TOÁN SEPAY: {}", originalPrompt);
            CheckDepositPaymentTool.PaymentCheckResult res = checkDepositPaymentTool.checkPaymentStatus(originalPrompt);
            return AiExecutionResult.builder()
                    .aiAnswerText(res.getMessage())
                    .retrievedContext(res.getMessage())
                    .uiBlockType("NONE")
                    .suggestedPrompts(res.isPaid()
                            ? List.of("Chính sách hoàn cọc 100% trong 72 giờ", "Đăng ký lái thử xe này", "Kiểm tra tồn kho xe")
                            : List.of("Tôi đã chuyển khoản rồi kiểm tra lại", "Chính sách cọc 72h hoàn tiền", "Đăng ký lái thử xe"))
                    .build();
        }

        // Kiểm tra xem người dùng đang muốn THỰC HIỆN ĐẶT CỌC hay chỉ HỎI CHÍNH SÁCH
        boolean isAction = pLower.contains("đặt cọc đi")
                || pLower.contains("cọc đi")
                || pLower.contains("cọc ngay")
                || pLower.contains("muốn cọc")
                || pLower.contains("lập phiếu cọc")
                || pLower.contains("đặt cọc xe")
                || pLower.contains("đặt cọc giữ xe")
                || pLower.contains("tiến hành cọc");

        // =========================================================================
        // NHÁNH 1: HÀNH ĐỘNG ĐẶT CỌC -> Gọi CreateCarDepositTool tạo phiếu cọc & VietQR SePay
        // =========================================================================
        if (isAction) {
            String targetCar = decision.targetVehicleName();
            if (targetCar == null || targetCar.isBlank()) {
                targetCar = "AutoHub GT-e Grand Touring";
            }

            log.info("[DepositPolicyExecutor] Thực hiện tạo phiếu đặt cọc cho xe: {}", targetCar);
            DepositActionResult res = createCarDepositTool.createCarDeposit(targetCar, null, null, null);

            if (res.isSuccess()) {
                String cleanCode = res.getMaPhieuCoc() != null
                        ? (res.getMaPhieuCoc().startsWith("#") ? res.getMaPhieuCoc().substring(1) : res.getMaPhieuCoc())
                        : "DEP-000000";

                String confirmText = String.format(
                        """
                                🎉 **LẬP PHIẾU ĐẶT CỌC GIỮ XE 72 GIỜ THÀNH CÔNG!**

                                Hệ thống AutoHub đã khóa suất xe độc quyền và khởi tạo phiếu cọc cho quý khách:
                                • 🔖 **Mã phiếu cọc:** **#%s**
                                • 🚗 **Mẫu xe:** **%s**
                                • 🏢 **Showroom nhận xe:** %s
                                • 💰 **Mức tiền cọc:** **%s**
                                • ⏳ **Thời hạn thanh toán:** %s (15 phút)
                                • 📋 **Trạng thái:** **PENDING_PAYMENT (Chờ chuyển khoản VietQR SePay)**

                                📲 **QUÉT MÃ VIETQR ĐỂ HOÀN TẤT ĐẶT CỌC:**
                                *(Quý khách mở ứng dụng Ngân hàng trên điện thoại và quét mã QR bên dưới, tiền cọc sẽ được kích hoạt tự động qua cổng SePay BIDV)*

                                ![Mã VietQR Thanh Toán SePay](%s)

                                • 🏦 **Ngân hàng thụ hưởng:** BIDV (Ngân hàng TMCP Đầu tư và Phát triển VN)
                                • 💳 **Số tài khoản (Tài khoản ảo):** **962470372816614**
                                • 👤 **Chủ tài khoản:** NGUYEN VAN TRONG
                                • 💵 **Số tiền cọc chính xác:** %s
                                • 📝 **Nội dung chuyển khoản (bắt buộc chính xác):** `AH DEP %s`

                                🛡️ **CHÍNH SÁCH BẢO CHỨNG GIỮ XE 72 GIỜ:**
                                • Sau khi quý khách chuyển khoản thành công, hệ thống SePay sẽ tự động đối soát trong 3 giây và kích hoạt đồng hồ đếm ngược giữ xe **72 giờ** độc quyền cho quý khách.
                                • **Cam kết hoàn tiền 100%%:** Trong vòng 72 giờ, nếu quý khách đổi ý vì bất kỳ lý do gì, AutoHub cam kết hoàn trả 100%% tiền cọc trong vòng 24 giờ làm việc mà không mất bất kỳ khoản phí phạt nào!
                                """
                                .trim(),
                        cleanCode,
                        res.getTenXe(),
                        res.getShowroom(),
                        res.getSoTienCoc(),
                        res.getHanThanhToan(),
                        res.getVietQrUrl(),
                        res.getSoTienCoc(),
                        cleanCode);

                return AiExecutionResult.builder()
                        .aiAnswerText(confirmText)
                        .retrievedContext(confirmText)
                        .uiBlockType("NONE")
                        .suggestedPrompts(List.of(
                                "Tôi đã chuyển khoản cọc thành công",
                                "Kiểm tra thanh toán cọc SePay #" + cleanCode,
                                "Chính sách hoàn cọc 100% trong 72 giờ"))
                        .build();
            } else {
                return AiExecutionResult.builder()
                        .aiAnswerText("⚠️ " + res.getMessage())
                        .retrievedContext(res.getMessage())
                        .uiBlockType("NONE")
                        .build();
            }
        }

        // =========================================================================
        // NHÁNH 2: HỎI CHÍNH SÁCH -> Truy vấn RAG VectorStore
        // =========================================================================
        String retrievedText = "";
        try {
            SearchRequest request = SearchRequest.builder()
                    .query(originalPrompt != null && !originalPrompt.isBlank() ? originalPrompt
                            : "chính sách đặt cọc giữ xe 72h hoàn tiền")
                    .topK(2)
                    .similarityThreshold(0.4)
                    .build();

            List<Document> matchedDocs = vectorStore.similaritySearch(request);
            if (!matchedDocs.isEmpty()) {
                retrievedText = matchedDocs.stream()
                        .map(Document::getText)
                        .collect(Collectors.joining("\n\n---\n\n"));
            }
        } catch (Exception ex) {
            log.warn("[DepositPolicyExecutor] Không thể truy vấn VectorStore: {}", ex.getMessage());
        }

        String fallbackText = """
                🛡️ **CHÍNH SÁCH ĐẶT CỌC GIỮ XE 72 GIỜ VÀ HOÀN TIỀN TẠI AUTOHUB**

                • **Mức tiền cọc:** 10.000.000 VNĐ (xe phổ thông) hoặc 20.000.000 VNĐ (xe cao cấp).
                • **Khóa giữ chỗ độc quyền 72 giờ:** Suất xe được bảo lưu nguyên giá trong 72h và tạm giữ tồn kho.
                • **Cam kết hoàn tiền 100%:** Trong vòng 72 giờ, nếu quý khách đổi ý vì bất kỳ lý do gì, AutoHub hoàn lại 100% tiền cọc trong 24 giờ làm việc không mất phí phạt.
                """;

        return AiExecutionResult.builder()
                .aiAnswerText(fallbackText.trim())
                .retrievedContext(retrievedText.isBlank() ? fallbackText : retrievedText)
                .uiBlockType("DEPOSIT_POLICY")
                .suggestedPrompts(List.of(
                        "Đặt cọc giữ xe 72h ngay bây giờ",
                        "Quy trình kiểm tra xe xuất xưởng PDI 30 điểm",
                        "Chính sách bảo hành pin xe điện 800V SiC",
                        "Chính sách đổi trả phụ kiện trong 30 ngày"))
                .build();
    }
}