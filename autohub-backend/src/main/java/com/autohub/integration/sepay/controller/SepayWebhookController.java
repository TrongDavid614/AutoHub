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
import java.time.LocalDateTime;
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

        // 4. Đối soát số tiền thanh toán (transferAmount)
        BigDecimal transferAmount = payload.getTransferAmount();
        BigDecimal requiredAmount = deposit.getSoTienCoc() != null ? deposit.getSoTienCoc() : BigDecimal.valueOf(20000000);

        if (transferAmount != null && transferAmount.compareTo(requiredAmount) < 0) {
            log.warn("[SePay Webhook] Underpaid deposit {}: transferred={}, required={}",
                    deposit.getMaPhieuCoc(), transferAmount, requiredAmount);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Số tiền chuyển khoản (" + transferAmount + " đ) không đủ mức cọc tối thiểu (" + requiredAmount + " đ)"));
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
