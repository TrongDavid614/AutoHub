package com.autohub.core.ai.tools;

import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
@RequiredArgsConstructor
public class CheckDepositPaymentTool {

    private final PhieuDatCocRepository phieuDatCocRepository;

    @Value("${sepay.account-number:962470372816614}")
    private String sepayAccountNumber;

    @Value("${sepay.bank-brand-name:BIDV}")
    private String sepayBankBrandName;

    private static final NumberFormat VND_FORMAT = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm 'ngày' dd/MM/yyyy");
    private static final Pattern CODE_PATTERN = Pattern.compile("(?i)(?:AH[-_\\s]*DEP[-_\\s]*)?#?(DEP[-_]?\\d+|\\d{4,10})");

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentCheckResult {
        private boolean found;
        private boolean isPaid;
        private String maPhieuCoc;
        private String tenXe;
        private String showroom;
        private String soTien;
        private String trangThai;
        private String thoiGianThanhToan;
        private String hanGiuXe72h;
        private String vietQrUrl;
        private String message;
    }

    @Tool(description = "Kiểm tra xem khách hàng đã chuyển khoản thành công tiền cọc qua cổng thanh toán tự động SePay BIDV hay chưa từ bảng dbo.phieu_dat_coc")
    @Transactional
    public PaymentCheckResult checkPaymentStatus(
            @ToolParam(description = "Mã phiếu cọc hoặc chuỗi tìm kiếm (ví dụ: DEP-625287, #DEP-625287, hoặc để trống nếu kiểm tra phiếu mới nhất)") String depositCode
    ) {
        log.info("[Spring AI Tool] checkPaymentStatus: code={}", depositCode);

        PhieuDatCoc deposit = findDeposit(depositCode);
        if (deposit == null) {
            return PaymentCheckResult.builder()
                    .found(false)
                    .isPaid(false)
                    .message("Hệ thống chưa tìm thấy thông tin phiếu đặt cọc tương ứng. Quý khách vui lòng cung cấp mã phiếu cọc (ví dụ: #DEP-625287) để AI tra cứu đối soát ngay.")
                    .build();
        }

        String code = deposit.getMaPhieuCoc() != null ? deposit.getMaPhieuCoc() : "DEP-" + deposit.getId();
        if (!code.startsWith("#")) {
            code = "#" + code;
        }

        String carName = (deposit.getTonKhoXe() != null && deposit.getTonKhoXe().getPhienBanXe() != null)
                ? deposit.getTonKhoXe().getPhienBanXe().getTenPhienBan()
                : "AutoHub GT-e Grand Touring";

        String showroom = (deposit.getTonKhoXe() != null && deposit.getTonKhoXe().getShowroom() != null)
                ? deposit.getTonKhoXe().getShowroom().getTenShowroom()
                : "Showroom AutoHub Flagship";

        BigDecimal amount = deposit.getSoTienCoc() != null ? deposit.getSoTienCoc() : BigDecimal.valueOf(20000);
        String amountFormatted = VND_FORMAT.format(amount);

        boolean isPaid = TrangThaiPhieuCoc.PAID.equals(deposit.getTrangThai());

        if (isPaid) {
            String paidAtStr = deposit.getThoiGianThanhToan() != null ? deposit.getThoiGianThanhToan().format(TIME_FMT) : "Vừa xong";
            String expireStr = deposit.getHanGiuXe() != null ? deposit.getHanGiuXe().format(TIME_FMT) : LocalDateTime.now().plusHours(72).format(TIME_FMT);

            String msg = String.format(
                    """
                    🎉 **XÁC NHẬN THANH TOÁN SEPAY THÀNH CÔNG!**

                    AutoHub Intelligence AI và cổng thanh toán tự động SePay ghi nhận quý khách đã hoàn tất chuyển khoản tiền cọc:
                    • 🔖 **Mã phiếu cọc:** **%s**
                    • 🚗 **Dòng xe giữ chỗ:** **%s**
                    • 🏢 **Showroom nhận xe:** %s
                    • 💰 **Số tiền đã thanh toán:** **%s**
                    • 💳 **Cổng thanh toán:** **SePay BIDV (Tự động khớp lệnh 24/7)**
                    • ⏱️ **Thời gian thanh toán:** %s
                    • ⏳ **Thời hạn bảo lưu suất xe 72 giờ:** Đến **%s**
                    • 🔑 **Trạng thái:** **PAID (Đã thanh toán - Suất xe đang được bảo chứng 100%%)**

                    🛡️ **CHÍNH SÁCH BẢO VỆ KHÁCH HÀNG:**
                    • Suất xe đã được khóa tồn kho độc quyền cho quý khách.
                    • Trong vòng **72 giờ** (đến %s), quý khách hoàn toàn có quyền đổi ý và nhận lại **100%% tiền cọc** trong vòng 24 giờ mà không mất bất kỳ khoản phí phạt nào!
                    """.trim(),
                    code, carName, showroom, amountFormatted, paidAtStr, expireStr, expireStr
            );

            return PaymentCheckResult.builder()
                    .found(true)
                    .isPaid(true)
                    .maPhieuCoc(code)
                    .tenXe(carName)
                    .showroom(showroom)
                    .soTien(amountFormatted)
                    .trangThai("PAID")
                    .thoiGianThanhToan(paidAtStr)
                    .hanGiuXe72h(expireStr)
                    .message(msg)
                    .build();
        } else {
            // Chưa thanh toán -> Sinh VietQR SePay BIDV chuẩn
            String cleanCode = code.startsWith("#") ? code.substring(1) : code;
            String transferContent = "AH DEP " + cleanCode;
            String bankAcc = (sepayAccountNumber != null && !sepayAccountNumber.isBlank()) ? sepayAccountNumber : "962470372816614";
            String bankBrand = (sepayBankBrandName != null && !sepayBankBrandName.isBlank()) ? sepayBankBrandName.toLowerCase() : "bidv";
            String amountDigits = amount.toBigInteger().toString();

            String qrUrl;
            try {
                qrUrl = String.format("https://img.vietqr.io/image/%s-%s-compact2.png?amount=%s&addInfo=%s&accountName=NGUYEN%%20VAN%%20TRONG",
                        bankBrand, bankAcc, amountDigits, URLEncoder.encode(transferContent, StandardCharsets.UTF_8));
            } catch (Exception e) {
                qrUrl = String.format("https://img.vietqr.io/image/%s-%s-compact2.png?amount=%s", bankBrand, bankAcc, amountDigits);
            }

            String msg = String.format(
                    """
                    ⏳ **HỆ THỐNG SEPAY ĐANG CHỜ CHUYỂN KHOẢN**

                    Phiếu cọc **%s** cho xe **%s** hiện đang ở trạng thái **PENDING_PAYMENT (Chờ chuyển khoản)**. Cổng SePay BIDV vẫn chưa nhận được thông báo biến động số dư từ tài khoản ngân hàng.

                    📲 **THÔNG TIN CHUYỂN KHOẢN SEPAY CHÍNH XÁC:**
                    • 🏦 **Ngân hàng thụ hưởng:** BIDV (Ngân hàng TMCP Đầu tư & Phát triển VN)
                    • 💳 **Số tài khoản:** **%s**
                    • 👤 **Chủ tài khoản:** **CONG TY CO PHAN AUTOHUB VIETNAM**
                    • 💵 **Số tiền cọc chính xác:** **%s**
                    • 📝 **Nội dung chuyển khoản (bắt buộc chính xác):** `%s`

                    *(Quý khách vui lòng mở App ngân hàng quét mã VietQR bên dưới để thông tin được điền tự động chính xác 100%%)*

                    ![Mã VietQR Thanh Toán SePay](%s)

                    🔄 **Lưu ý:** Ngay sau khi quý khách chuyển khoản qua Napas 247, hệ thống SePay sẽ tự động đối soát và kích hoạt trạng thái **PAID** chỉ trong vòng 3-5 giây!
                    """.trim(),
                    code, carName, bankAcc, amountFormatted, transferContent, qrUrl
            );

            return PaymentCheckResult.builder()
                    .found(true)
                    .isPaid(false)
                    .maPhieuCoc(code)
                    .tenXe(carName)
                    .showroom(showroom)
                    .soTien(amountFormatted)
                    .trangThai("PENDING_PAYMENT")
                    .vietQrUrl(qrUrl)
                    .message(msg)
                    .build();
        }
    }

    public PhieuDatCoc findDeposit(String codeOrPrompt) {
        if (codeOrPrompt != null && !codeOrPrompt.isBlank()) {
            Matcher matcher = CODE_PATTERN.matcher(codeOrPrompt);
            if (matcher.find()) {
                String extracted = matcher.group(1).trim();
                Optional<PhieuDatCoc> opt = phieuDatCocRepository.findByMaPhieuCoc(extracted);
                if (opt.isPresent()) return opt.get();

                opt = phieuDatCocRepository.findByMaPhieuCoc("#" + extracted);
                if (opt.isPresent()) return opt.get();

                String rawCore = extracted.replaceAll("(?i)^#?DEP[-_]?", "").trim();
                if (!rawCore.isBlank()) {
                    opt = phieuDatCocRepository.findByMaPhieuCoc("DEP-" + rawCore);
                    if (opt.isPresent()) return opt.get();
                    opt = phieuDatCocRepository.findByMaPhieuCoc("#DEP-" + rawCore);
                    if (opt.isPresent()) return opt.get();
                    opt = phieuDatCocRepository.findByMaPhieuCoc("DEP" + rawCore);
                    if (opt.isPresent()) return opt.get();

                    try {
                        Long id = Long.parseLong(rawCore);
                        opt = phieuDatCocRepository.findById(id);
                        if (opt.isPresent()) return opt.get();
                    } catch (NumberFormatException ignored) {}
                }
            }
        }

        // Lấy phiếu cọc mới nhất trong hệ thống
        return phieuDatCocRepository.findTopByOrderByNgayDatCocDesc().orElse(null);
    }
}

