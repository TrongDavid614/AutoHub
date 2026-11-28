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
    private final DonHangPhuKienRepository donHangRepository;

    @Value("${sepay.api-token:autohub_sepay_secret_2026_998877}")
    private String sepayApiToken;

    @Value("${sepay.sandbox-mode:true}")
    private boolean sandboxMode;

    private static final Pattern AH_DEP_PATTERN = Pattern.compile("(?i)AH[-_\\s]*DEP[-_\\s]*([A-Za-z0-9\\-_]+)");
    private static final Pattern DEP_CODE_PATTERN = Pattern.compile("(?i)(DEP[-_]?[0-9A-Za-z]+)");
    private static final Pattern AH_ACC_PATTERN = Pattern.compile("(?i)(#?AH[-_\\s]*ACC[-_\\s]*[A-Za-z0-9\\-_]+)");
    private static final Pattern ACC_ONLY_PATTERN = Pattern.compile("(?i)(#?ACC[-_\\s]*[A-Za-z0-9\\-_]+)");

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
                // Trong chế độ Sandbox, chấp nhận mọi số tiền chuyển khoản thử nghiệm từ 2.000 đ trở lên
                BigDecimal minRequired = sandboxMode ? BigDecimal.valueOf(Math.min(2000L, testAmount)) : originalAmount;

                // Cho phép nếu chuyển đủ số tiền test (>= minRequired) HOẶC chuyển đủ số tiền gốc (>= originalAmount)
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
        BigDecimal scaledAmount = calculateScaledPaymentAmount(originalAmount);
        BigDecimal minRequired = sandboxMode
                ? BigDecimal.valueOf(Math.min(2000L, Math.min(testAmount, scaledAmount.longValue())))
                : originalAmount;

        // Chấp nhận nếu người dùng chuyển tiền test (>= testAmount/scaled) HOẶC chuyển tiền thật (>= originalAmount)
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

        BigDecimal originalAmount = (deposit.getSoTienCoc() != null && deposit.getSoTienCoc().compareTo(BigDecimal.valueOf(100000)) > 0)
                ? deposit.getSoTienCoc()
                : (deposit.getSoTienCoc() != null && deposit.getSoTienCoc().compareTo(BigDecimal.ZERO) > 0
                        ? deposit.getSoTienCoc().multiply(BigDecimal.valueOf(1000))
                        : BigDecimal.valueOf(20000000));
        // Áp dụng thuật toán nhân giá cho 1/1000 (test payment)
        BigDecimal finalPaidAmount = (amount != null && amount.compareTo(BigDecimal.ZERO) > 0)
                ? amount
                : calculateScaledPaymentAmount(originalAmount);

        // Cập nhật trạng thái phiếu cọc sang PAID và kích hoạt 72h
        LocalDateTime now = LocalDateTime.now();
        deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
        deposit.setThoiGianThanhToan(now);
        deposit.setHanGiuXe(now.plusHours(72));
        deposit.setSoTienCoc(originalAmount); // Luôn giữ số tiền cọc xe thực tế của hợp đồng (20.000.000 đ)
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

    /**
     * API thực hiện thanh toán thử nghiệm cho đơn hàng phụ kiện (Test / Simulate Accessory Order Payment)
     *
     * @param code Mã đơn hàng (ví dụ: AH-ACC-2026-8067, AHACC20268067 hoặc null sẽ lấy đơn PENDING_PAYMENT mới nhất)
     * @param amount Số tiền thanh toán truyền vào (tùy chọn)
     * @return Kết quả đối soát và chuyển trạng thái đơn hàng sang PAID
     */
    @RequestMapping(value = {"/test-pay-order", "/simulate-pay-order"}, method = {RequestMethod.GET, RequestMethod.POST})
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> testPayOrder(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "amount", required = false) BigDecimal amount
    ) {
        log.info("[Payment Test Order] Yêu cầu kiểm tra thanh toán đơn phụ kiện: code={}, amount={}", code, amount);

        DonHangPhuKien order = null;
        if (code != null && !code.isBlank()) {
            order = findOrderByCode(code.trim()).orElse(null);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy đơn hàng phụ kiện với mã: " + code));
            }
        } else {
            List<DonHangPhuKien> allOrders = donHangRepository.findAll();
            order = allOrders.stream()
                    .filter(o -> TrangThaiDonHang.PENDING_PAYMENT.equals(o.getTrangThai()))
                    .reduce((first, second) -> second)
                    .orElse(null);

            if (order == null && !allOrders.isEmpty()) {
                order = allOrders.get(allOrders.size() - 1);
            }

            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Hệ thống chưa có đơn hàng nào để thanh toán thử nghiệm."));
            }
        }

        BigDecimal originalAmount = order.getTongTien() != null ? order.getTongTien() : BigDecimal.valueOf(950000);
        BigDecimal finalPaidAmount = (amount != null && amount.compareTo(BigDecimal.ZERO) > 0)
                ? amount
                : BigDecimal.valueOf(PaymentSandboxHelper.calculateSandboxTestAmount(originalAmount, false));

        LocalDateTime now = LocalDateTime.now();
        order.setTrangThai(TrangThaiDonHang.PAID);
        order.setThoiGianThanhToan(now);
        donHangRepository.save(order);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("orderCode", order.getMaDonHang());
        result.put("originalAmount", originalAmount);
        result.put("paidAmount", finalPaidAmount);
        result.put("status", order.getTrangThai().name());
        result.put("paymentTime", now.toString());
        result.put("message", "Thanh toán thành công! Đơn hàng đã chuyển sang trạng thái PAID.");

        log.info("[Payment Test Order] Đã thanh toán thành công đơn: {}, số tiền: {} đ", order.getMaDonHang(), finalPaidAmount);

        return ResponseEntity.ok(ApiResponse.ok(result, "Thanh toán thử nghiệm thành công! Đơn hàng đã chuyển sang trạng thái PAID."));
    }

    private boolean isAuthorized(String header) {
        if (sandboxMode && (header == null || header.isBlank())) {
            log.info("[SePay Webhook] Sandbox mode active: Allowing webhook request without Authorization header");
            return true;
        }
        if (header == null || header.isBlank()) {
            return false;
        }
        String token = header.trim();
        if (token.startsWith("Apikey ") || token.startsWith("apikey ")) {
            token = token.substring(7).trim();
        } else if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
            token = token.substring(7).trim();
        }
        boolean matched = sepayApiToken != null && sepayApiToken.trim().equals(token);
        if (!matched && sandboxMode) {
            log.warn("[SePay Webhook] Sandbox mode active: Authorization header '{}' did not match configured token '{}', but bypassing for sandbox testing",
                    header, sepayApiToken);
            return true;
        }
        return matched;
    }

    private String extractOrderCode(String content) {
        if (content == null || content.isBlank()) {
            return null;
        }
        Matcher m1 = AH_ACC_PATTERN.matcher(content);
        if (m1.find()) {
            return m1.group(1).trim().replaceAll("\\s+", "-");
        }
        Matcher m2 = ACC_ONLY_PATTERN.matcher(content);
        if (m2.find()) {
            return m2.group(1).trim().replaceAll("\\s+", "-");
        }
        return null;
    }

    private Optional<DonHangPhuKien> findOrderByCode(String code) {
        if (code == null || code.isBlank()) {
            return Optional.empty();
        }
        String clean = code.trim();

        // 1. Tìm trực tiếp theo mã nguyên bản hoặc có/không có #
        Optional<DonHangPhuKien> opt = donHangRepository.findByMaDonHang(clean);
        if (opt.isPresent()) return opt;

        if (!clean.startsWith("#")) {
            opt = donHangRepository.findByMaDonHang("#" + clean);
            if (opt.isPresent()) return opt;
        } else {
            opt = donHangRepository.findByMaDonHang(clean.substring(1));
            if (opt.isPresent()) return opt;
        }

        // 2. Tái tạo định dạng chuẩn AH-ACC-YYYY-XXXX từ chuỗi không dấu gạch nối (Ví dụ MoMo bỏ dấu: AHACC20268067 -> AH-ACC-2026-8067)
        String alphaNum = clean.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (alphaNum.startsWith("AHACC")) {
            String rest = alphaNum.substring(5); // e.g. 20268067 hoặc 8067
            if (rest.length() > 4) {
                String year = rest.substring(0, 4);
                String num = rest.substring(4);
                String reconstructed = "AH-ACC-" + year + "-" + num;
                opt = donHangRepository.findByMaDonHang(reconstructed);
                if (opt.isPresent()) return opt;
                opt = donHangRepository.findByMaDonHang("#" + reconstructed);
                if (opt.isPresent()) return opt;
            } else if (!rest.isBlank()) {
                String reconstructed = "AH-ACC-2026-" + rest;
                opt = donHangRepository.findByMaDonHang(reconstructed);
                if (opt.isPresent()) return opt;
                opt = donHangRepository.findByMaDonHang("#" + reconstructed);
                if (opt.isPresent()) return opt;
            }
        } else if (alphaNum.startsWith("ACC")) {
            String rest = alphaNum.substring(3);
            if (rest.length() > 4) {
                String year = rest.substring(0, 4);
                String num = rest.substring(4);
                String reconstructed = "AH-ACC-" + year + "-" + num;
                opt = donHangRepository.findByMaDonHang(reconstructed);
                if (opt.isPresent()) return opt;
                opt = donHangRepository.findByMaDonHang("#" + reconstructed);
                if (opt.isPresent()) return opt;
            } else if (!rest.isBlank()) {
                String reconstructed = "AH-ACC-2026-" + rest;
                opt = donHangRepository.findByMaDonHang(reconstructed);
                if (opt.isPresent()) return opt;
                opt = donHangRepository.findByMaDonHang("#" + reconstructed);
                if (opt.isPresent()) return opt;
            }
        }

        // 3. Quét đối soát linh hoạt toàn bộ đơn hàng trong Database
        List<DonHangPhuKien> allOrders = donHangRepository.findAll();
        for (DonHangPhuKien order : allOrders) {
            if (order.getMaDonHang() != null) {
                String orderAlphaNum = order.getMaDonHang().replaceAll("[^A-Za-z0-9]", "").toUpperCase();
                if (orderAlphaNum.equals(alphaNum) || orderAlphaNum.endsWith(alphaNum) || alphaNum.endsWith(orderAlphaNum)) {
                    return Optional.of(order);
                }
            }
        }

        return Optional.empty();
    }

    private String extractDepositCode(String content) {
        if (content == null || content.isBlank()) {
            return null;
        }
        // Pattern 1: AH DEP <maPhieu> (e.g. AH DEP DEP-46879, AH DEP DEP46879, AH DEP 46879)
        Matcher m1 = AH_DEP_PATTERN.matcher(content);
        if (m1.find()) {
            return m1.group(1).trim();
        }

        // Pattern 2: DEP-<numbers> hoặc DEP<numbers> (e.g. DEP-46879, DEP46879)
        Matcher m2 = DEP_CODE_PATTERN.matcher(content);
        if (m2.find()) {
            return m2.group(1).trim();
        }

        return null;
    }

    private Optional<PhieuDatCoc> findDepositByCode(String code) {
        if (code == null || code.isBlank()) {
            return Optional.empty();
        }
        String clean = code.trim();

        // 1. Tìm trực tiếp theo mã phiếu cọc nguyên bản
        Optional<PhieuDatCoc> opt = depositRepository.findByMaPhieuCoc(clean);
        if (opt.isPresent()) return opt;

        // 2. Thử thêm/bớt tiền tố #
        if (!clean.startsWith("#")) {
            opt = depositRepository.findByMaPhieuCoc("#" + clean);
            if (opt.isPresent()) return opt;
        } else {
            opt = depositRepository.findByMaPhieuCoc(clean.substring(1));
            if (opt.isPresent()) return opt;
        }

        // 3. Chuẩn hóa trích xuất phần lõi số (loại bỏ #, DEP-, DEP, _)
        // Ví dụ: DEP-46879 -> 46879, DEP46879 -> 46879, #DEP-46879 -> 46879
        String rawCore = clean.replaceAll("(?i)^#?DEP[-_]?", "").trim();
        if (!rawCore.isBlank()) {
            // Thử "DEP-" + rawCore (chuẩn mặc định hệ thống: DEP-46879)
            opt = depositRepository.findByMaPhieuCoc("DEP-" + rawCore);
            if (opt.isPresent()) return opt;

            opt = depositRepository.findByMaPhieuCoc("#DEP-" + rawCore);
            if (opt.isPresent()) return opt;

            // Thử "DEP" + rawCore (trường hợp ngân hàng/MoMo bỏ dấu gạch ngang: DEP46879)
            opt = depositRepository.findByMaPhieuCoc("DEP" + rawCore);
            if (opt.isPresent()) return opt;

            opt = depositRepository.findByMaPhieuCoc("#DEP" + rawCore);
            if (opt.isPresent()) return opt;

            // Thử tìm theo ID nếu rawCore là số nguyên
            try {
                Long id = Long.parseLong(rawCore);
                opt = depositRepository.findById(id);
                if (opt.isPresent()) return opt;
            } catch (NumberFormatException ignored) {}
        }

        // 4. Tìm kiếm linh hoạt trong danh sách phiếu cọc đang chờ thanh toán (PENDING_PAYMENT)
        List<PhieuDatCoc> pendingList = depositRepository.findByTrangThai(TrangThaiPhieuCoc.PENDING_PAYMENT);
        for (PhieuDatCoc dep : pendingList) {
            String depMa = dep.getMaPhieuCoc();
            if (depMa != null) {
                String depCore = depMa.replaceAll("(?i)^#?DEP[-_]?", "").trim();
                if (!rawCore.isBlank() && (depCore.equalsIgnoreCase(rawCore) || depMa.toLowerCase().contains(rawCore.toLowerCase()))) {
                    return Optional.of(dep);
                }
            }
        }

        return Optional.empty();
    }
}
