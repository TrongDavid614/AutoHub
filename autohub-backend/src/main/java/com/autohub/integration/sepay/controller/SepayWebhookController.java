package com.autohub.integration.sepay.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.integration.sepay.dto.SepayWebhookRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class SepayWebhookController {

    private final PhieuDatCocRepository depositRepository;

    @Value("${sepay.api-token:autohub_sepay_secret_2026_998877}")
    private String sepayApiToken;

    private static final Pattern AH_DEP_PATTERN = Pattern.compile("(?i)AH\\s*DEP\\s*([A-Za-z0-9\\-_]+)");
    private static final Pattern DEP_CODE_PATTERN = Pattern.compile("(?i)(DEP-[A-Za-z0-9\\-_]+)");

    @PostMapping("/sepay-webhook")
    @Transactional
    public ResponseEntity<ApiResponse<String>> handleSepayWebhook(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody SepayWebhookRequest payload
    ) {
        log.info("[SePay Webhook] Received transaction: id={}, code={}, amount={}, content={}",
                payload.getId(), payload.getCode(), payload.getTransferAmount(), payload.getContent());

        // 1. Xác thực bảo mật API Token từ SePay
        if (!isAuthorized(authorizationHeader)) {
            log.warn("[SePay Webhook] Unauthorized request. Authorization header: {}", authorizationHeader);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("SePay API key không hợp lệ hoặc thiếu Authorization header"));
        }

        String content = payload.getContent();
        if (content == null || content.isBlank()) {
            log.warn("[SePay Webhook] Transaction content is empty");
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Nội dung chuyển khoản rỗng"));
        }

        // 2. Bóc tách mã phiếu cọc từ trường content (ví dụ: AH DEP DEP-8812, AH DEP 8812, DEP-8812)
        String extractedCode = extractDepositCode(content);
        if (extractedCode == null) {
            log.warn("[SePay Webhook] Cannot parse deposit code from content: {}", content);
            return ResponseEntity.ok(ApiResponse.ok("Không tìm thấy mã phiếu cọc trong nội dung chuyển khoản. Đã lưu log đối soát"));
        }

        log.info("[SePay Webhook] Extracted deposit code: {}", extractedCode);

        // 3. Tìm phiếu cọc trong Database
        Optional<PhieuDatCoc> depositOpt = findDepositByCode(extractedCode);
        if (depositOpt.isEmpty()) {
            log.warn("[SePay Webhook] Deposit ticket not found for code: {}", extractedCode);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy phiếu đặt cọc với mã: " + extractedCode));
        }

        PhieuDatCoc deposit = depositOpt.get();

        // Kiểm tra nếu phiếu đã thanh toán trước đó
        if (TrangThaiPhieuCoc.PAID.equals(deposit.getTrangThai())) {
            log.info("[SePay Webhook] Deposit ticket {} already PAID previously", deposit.getMaPhieuCoc());
            return ResponseEntity.ok(ApiResponse.ok("Phiếu cọc " + deposit.getMaPhieuCoc() + " đã được xác nhận thanh toán trước đó"));
        }

        // 4. Đối soát số tiền thanh toán (transferAmount) - áp dụng thuật toán giảm giá 1/1000
        BigDecimal transferAmount = payload.getTransferAmount();
        BigDecimal requiredAmount = deposit.getSoTienCoc() != null ? deposit.getSoTienCoc() : BigDecimal.valueOf(20000000);
        BigDecimal minAcceptableAmount = requiredAmount.compareTo(BigDecimal.valueOf(100000)) > 0
                ? calculateScaledPaymentAmount(requiredAmount)
                : requiredAmount;

        if (transferAmount != null && transferAmount.compareTo(minAcceptableAmount) < 0) {
            log.warn("[SePay Webhook] Underpaid deposit {}: transferred={}, required={}, minAcceptable={}",
                    deposit.getMaPhieuCoc(), transferAmount, requiredAmount, minAcceptableAmount);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Số tiền chuyển khoản (" + transferAmount + " đ) không đủ mức cọc tối thiểu (" + minAcceptableAmount + " đ)"));
        }

        // 5. Cập nhật trạng thái phiếu cọc sang PAID và kích hoạt thời hạn giữ xe 72 giờ
        LocalDateTime now = LocalDateTime.now();
        deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
        deposit.setThoiGianThanhToan(now);
        deposit.setHanGiuXe(now.plusHours(72));

        depositRepository.save(deposit);

        log.info("[SePay Webhook] Successfully activated 72H car reservation for deposit: {}, amount: {} VND",
                deposit.getMaPhieuCoc(), transferAmount);

        return ResponseEntity.ok(ApiResponse.ok(
                "Xác nhận thanh toán SePay thành công cho phiếu cọc " + deposit.getMaPhieuCoc() + ". Đã kích hoạt thời hạn giữ xe 72 giờ!"
        ));
    }

    /**
     * Thuật toán tính toán số tiền thanh toán thử nghiệm (Scale 1/1000).
     * Nhân giá trị gốc với 1/1000 (0.001) để giảm số tiền cọc lớn (hàng chục triệu)
     * xuống mức tiền nhỏ (10.000đ - 20.000đ) phục vụ test thanh toán thực tế và kiểm tra tự động.
     *
     * @param originalAmount Giá trị tiền cọc / thanh toán gốc
     * @return Số tiền sau khi nhân 1/1000 (tối thiểu 10.000đ cho giao dịch ngân hàng)
     */
    public static BigDecimal calculateScaledPaymentAmount(BigDecimal originalAmount) {
        if (originalAmount == null) {
            return BigDecimal.valueOf(10000);
        }
        // Nếu giá trị đã ở mức kiểm tra thử nghiệm (<= 100.000đ) thì giữ nguyên mức đó
        if (originalAmount.compareTo(BigDecimal.valueOf(100000)) <= 0) {
            return originalAmount.compareTo(BigDecimal.valueOf(10000)) < 0 ? BigDecimal.valueOf(10000) : originalAmount;
        }
        // Thuật toán: Nhân giá đó cho 1/1000 (0.001)
        BigDecimal scaled = originalAmount.multiply(new BigDecimal("0.001")).setScale(0, RoundingMode.HALF_UP);
        // Đảm bảo mức tối thiểu cho giao dịch chuyển khoản ngân hàng là 10.000 VND
        return scaled.compareTo(BigDecimal.valueOf(10000)) < 0 ? BigDecimal.valueOf(10000) : scaled;
    }

    /**
     * API thực hiện thanh toán thử nghiệm (Test / Simulate Payment)
     * Tự động tính toán số tiền giảm giá 1/1000 và xác nhận thanh toán thành công
     * để kiểm tra luồng thanh toán ngay lập tức.
     *
     * @param code Mã phiếu cọc (ví dụ: DEP-180726858, nếu null sẽ lấy phiếu cọc PENDING_PAYMENT mới nhất)
     * @param amount Số tiền thanh toán truyền vào (tùy chọn)
     * @return Kết quả đối soát và kích hoạt giữ xe 72 giờ
     */
    @RequestMapping(value = {"/test-pay", "/simulate-pay"}, method = {RequestMethod.GET, RequestMethod.POST})
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> testPayment(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "amount", required = false) BigDecimal amount
    ) {
        log.info("[Payment Test] Yêu cầu kiểm tra thanh toán: code={}, amount={}", code, amount);

        PhieuDatCoc deposit = null;
        if (code != null && !code.isBlank()) {
            deposit = findDepositByCode(code.trim()).orElse(null);
            if (deposit == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy phiếu đặt cọc với mã: " + code));
            }
        } else {
            // Lấy phiếu đặt cọc mới nhất đang chờ thanh toán
            List<PhieuDatCoc> allDeposits = depositRepository.findAll();
            deposit = allDeposits.stream()
                    .filter(d -> TrangThaiPhieuCoc.PENDING_PAYMENT.equals(d.getTrangThai()))
                    .reduce((first, second) -> second)
                    .orElse(null);

            if (deposit == null && !allDeposits.isEmpty()) {
                deposit = allDeposits.get(allDeposits.size() - 1);
            }

            if (deposit == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Hệ thống chưa có phiếu đặt cọc nào để thanh toán thử nghiệm."));
            }
        }

        BigDecimal originalAmount = deposit.getSoTienCoc() != null ? deposit.getSoTienCoc() : BigDecimal.valueOf(20000000);
        // Áp dụng thuật toán nhân giá cho 1/1000
        BigDecimal finalPaidAmount = (amount != null && amount.compareTo(BigDecimal.ZERO) > 0)
                ? amount
                : calculateScaledPaymentAmount(originalAmount);

        // Cập nhật trạng thái phiếu cọc sang PAID và kích hoạt 72h
        LocalDateTime now = LocalDateTime.now();
        deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
        deposit.setThoiGianThanhToan(now);
        deposit.setHanGiuXe(now.plusHours(72));
        deposit.setSoTienCoc(finalPaidAmount);
        depositRepository.save(deposit);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("maPhieuCoc", deposit.getMaPhieuCoc());
        result.put("giaGoc", originalAmount);
        result.put("thuatToanGiamGia", "GiaGoc * 1/1000 (x0.001)");
        result.put("soTienThanhToan", finalPaidAmount);
        result.put("trangThai", deposit.getTrangThai().name());
        result.put("thoiGianThanhToan", deposit.getThoiGianThanhToan().toString());
        result.put("hanGiuXe72h", deposit.getHanGiuXe().toString());
        result.put("thongBao", "Thanh toán thành công! Đã áp dụng thuật toán giảm 1/1000 và kích hoạt giữ chỗ xe 72 giờ.");

        log.info("[Payment Test] Đã thanh toán thành công phiếu cọc: {}, số tiền: {} đ", deposit.getMaPhieuCoc(), finalPaidAmount);

        return ResponseEntity.ok(ApiResponse.ok(result, "Thanh toán thử nghiệm thành công! Phiếu cọc đã chuyển sang trạng thái PAID."));
    }

    private boolean isAuthorized(String header) {
        if (header == null || header.isBlank()) {
            return false;
        }
        String token = header.trim();
        if (token.startsWith("Apikey ") || token.startsWith("apikey ")) {
            token = token.substring(7).trim();
        } else if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
            token = token.substring(7).trim();
        }
        return sepayApiToken != null && sepayApiToken.trim().equals(token);
    }

    private String extractDepositCode(String content) {
        // Pattern 1: AH DEP <maPhieu> (e.g. AH DEP DEP-8812, AH DEP 8812)
        Matcher m1 = AH_DEP_PATTERN.matcher(content);
        if (m1.find()) {
            return m1.group(1).trim();
        }

        // Pattern 2: DEP-<numbers>
        Matcher m2 = DEP_CODE_PATTERN.matcher(content);
        if (m2.find()) {
            return m2.group(1).trim();
        }

        return null;
    }

    private Optional<PhieuDatCoc> findDepositByCode(String code) {
        // Tìm trực tiếp theo mã phiếu cọc
        Optional<PhieuDatCoc> opt = depositRepository.findByMaPhieuCoc(code);
        if (opt.isPresent()) return opt;

        // Thử thêm tiền tố #
        opt = depositRepository.findByMaPhieuCoc("#" + code);
        if (opt.isPresent()) return opt;

        // Thử tìm theo ID nếu code là số
        try {
            Long id = Long.parseLong(code);
            opt = depositRepository.findById(id);
            if (opt.isPresent()) return opt;
        } catch (NumberFormatException ignored) {}

        // Thử tìm nếu code không có DEP- nhưng là số: DEP-<code>
        if (!code.startsWith("DEP-")) {
            opt = depositRepository.findByMaPhieuCoc("DEP-" + code);
            if (opt.isPresent()) return opt;
            opt = depositRepository.findByMaPhieuCoc("#DEP-" + code);
            if (opt.isPresent()) return opt;
        }

        return Optional.empty();
    }
}
