package com.autohub.integration.sepay.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.common.util.PaymentSandboxHelper;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.TrangThaiDonHang;
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
    private final DonHangPhuKienRepository donHangRepository;

    @Value("${sepay.api-token:autohub_sepay_secret_2026_998877}")
    private String sepayApiToken;

    @Value("${sepay.sandbox-mode:true}")
    private boolean sandboxMode;

    private static final Pattern AH_DEP_PATTERN = Pattern.compile("(?i)AH\\s*DEP\\s*([A-Za-z0-9\\-_]+)");
    private static final Pattern DEP_CODE_PATTERN = Pattern.compile("(?i)(DEP-[A-Za-z0-9\\-_]+)");
    private static final Pattern AH_ACC_PATTERN = Pattern.compile("(?i)(AH[-_\\s]*ACC[-_\\s]*[A-Za-z0-9\\-_]+)");

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

        BigDecimal transferAmount = payload.getTransferAmount();

        // 2. Kiểm tra nếu là thanh toán đơn hàng phụ kiện (AH-ACC-...)
        String extractedOrderCode = extractOrderCode(content);
        if (extractedOrderCode != null) {
            Optional<DonHangPhuKien> orderOpt = findOrderByCode(extractedOrderCode);
            if (orderOpt.isPresent()) {
                DonHangPhuKien order = orderOpt.get();
                if (TrangThaiDonHang.PAID.equals(order.getTrangThai()) || TrangThaiDonHang.PROCESSING.equals(order.getTrangThai())) {
                    log.info("[SePay Webhook] Order {} already PAID previously", order.getMaDonHang());
                    return ResponseEntity.ok(ApiResponse.ok("Đơn hàng " + order.getMaDonHang() + " đã được xác nhận thanh toán trước đó"));
                }

                BigDecimal originalAmount = order.getTongTien() != null ? order.getTongTien() : BigDecimal.ZERO;
                long testAmount = PaymentSandboxHelper.calculateSandboxTestAmount(originalAmount, false);
                BigDecimal minRequired = sandboxMode ? BigDecimal.valueOf(testAmount) : originalAmount;

                // Cho phép nếu chuyển đủ số tiền test (>= testAmount) HOẶC chuyển đủ số tiền gốc (>= originalAmount)
                if (transferAmount != null && transferAmount.compareTo(minRequired) < 0 && transferAmount.compareTo(originalAmount) < 0) {
                    log.warn("[SePay Webhook] Underpaid order {}: transferred={}, minRequired={}",
                            order.getMaDonHang(), transferAmount, minRequired);
                    return ResponseEntity.badRequest()
                            .body(ApiResponse.error("Số tiền chuyển khoản (" + transferAmount + " đ) không đủ mức tối thiểu (" + minRequired + " đ)"));
                }

                order.setTrangThai(TrangThaiDonHang.PAID);
                order.setThoiGianThanhToan(LocalDateTime.now());
                donHangRepository.save(order);

                log.info("[SePay Webhook] Successfully marked order {} as PAID (amount: {} VND, sandbox: {})",
                        order.getMaDonHang(), transferAmount, sandboxMode);

                return ResponseEntity.ok(ApiResponse.ok(
                        "Xác nhận thanh toán SePay thành công cho đơn hàng phụ kiện " + order.getMaDonHang() + "!"
                ));
            }
        }

        // 3. Nếu không phải đơn phụ kiện, bóc tách mã phiếu cọc từ trường content (AH DEP DEP-8812, DEP-8812)
        String extractedCode = extractDepositCode(content);
        if (extractedCode == null) {
            log.warn("[SePay Webhook] Cannot parse deposit/order code from content: {}", content);
            return ResponseEntity.ok(ApiResponse.ok("Không tìm thấy mã phiếu cọc hoặc đơn hàng trong nội dung chuyển khoản. Đã lưu log đối soát"));
        }

        log.info("[SePay Webhook] Extracted deposit code: {}", extractedCode);

        // 4. Tìm phiếu cọc trong Database
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

        // 5. Đối soát số tiền thanh toán (transferAmount)
        BigDecimal originalAmount = deposit.getSoTienCoc() != null ? deposit.getSoTienCoc() : BigDecimal.valueOf(20000000);
        long testAmount = PaymentSandboxHelper.calculateSandboxTestAmount(originalAmount, true);
        BigDecimal minRequired = sandboxMode ? BigDecimal.valueOf(testAmount) : originalAmount;

        // Chấp nhận nếu người dùng chuyển tiền test (>= testAmount) HOẶC chuyển tiền thật (>= originalAmount)
        if (transferAmount != null && transferAmount.compareTo(minRequired) < 0 && transferAmount.compareTo(originalAmount) < 0) {
            log.warn("[SePay Webhook] Underpaid deposit {}: transferred={}, minRequired={}",
                    deposit.getMaPhieuCoc(), transferAmount, minRequired);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Số tiền chuyển khoản (" + transferAmount + " đ) không đủ mức cọc tối thiểu (" + minRequired + " đ)"));
        }

        // 6. Cập nhật trạng thái phiếu cọc sang PAID và kích hoạt thời hạn giữ xe 72 giờ
        LocalDateTime now = LocalDateTime.now();
        deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
        deposit.setThoiGianThanhToan(now);
        deposit.setHanGiuXe(now.plusHours(72));

        depositRepository.save(deposit);

        log.info("[SePay Webhook] Successfully activated 72H car reservation for deposit: {}, amount: {} VND (sandbox: {})",
                deposit.getMaPhieuCoc(), transferAmount, sandboxMode);

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

    private String extractOrderCode(String content) {
        Matcher m = AH_ACC_PATTERN.matcher(content);
        if (m.find()) {
            return m.group(1).trim().replaceAll("\\s+", "-");
        }
        return null;
    }

    private Optional<DonHangPhuKien> findOrderByCode(String code) {
        Optional<DonHangPhuKien> opt = donHangRepository.findByMaDonHang(code);
        if (opt.isPresent()) return opt;

        opt = donHangRepository.findByMaDonHang("#" + code);
        if (opt.isPresent()) return opt;

        if (code.startsWith("#")) {
            opt = donHangRepository.findByMaDonHang(code.substring(1));
            if (opt.isPresent()) return opt;
        }

        return Optional.empty();
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
