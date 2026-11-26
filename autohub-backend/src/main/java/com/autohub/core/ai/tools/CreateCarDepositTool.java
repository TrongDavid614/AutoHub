package com.autohub.core.ai.tools;

import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.showroom.entity.TonKhoXe;
import com.autohub.core.showroom.repository.TonKhoXeRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class CreateCarDepositTool {

    private final PhieuDatCocRepository phieuDatCocRepository;
    private final PhienBanXeRepository phienBanXeRepository;
    private final TonKhoXeRepository tonKhoXeRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Value("${sepay.account-number:9624767IMG}")
    private String sepayAccountNumber;

    @Value("${sepay.bank-brand-name:BIDV}")
    private String sepayBankBrandName;

    private static final NumberFormat VND_FORMAT = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm 'ngày' dd/MM/yyyy");

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepositActionResult {
        private boolean success;
        private String maPhieuCoc;
        private String message;
        private String tenXe;
        private String showroom;
        private String soTienCoc;
        private String hanThanhToan;
        private String vietQrUrl;
        private String huongDan;
    }

    @Tool(description = "Tạo phiếu đặt cọc giữ xe 72 giờ và sinh mã QR chuyển khoản VietQR cho khách hàng khi họ đồng ý đặt cọc một dòng xe cụ thể vào bảng dbo.phieu_dat_coc")
    @Transactional
    public DepositActionResult createCarDeposit(
            @ToolParam(description = "Tên mẫu xe hoặc từ khóa phiên bản muốn đặt cọc (ví dụ: VF8, SantaFe, Track Edition)") String vehicleKeyword,
            @ToolParam(description = "Số điện thoại của khách hàng (bắt buộc 10 chữ số)") String phoneNumber,
            @ToolParam(description = "Số CCCD hoặc CMND của khách hàng (12 chữ số) dùng để lập phiếu cọc") String citizenId,
            @ToolParam(description = "Tên thành phố hoặc showroom mong muốn nhận xe (tùy chọn)") String showroomLocation) {
        log.info("[Spring AI Tool] createCarDeposit: xe={}, sđt={}, cccd={}, showroom={}",
                vehicleKeyword, phoneNumber, citizenId, showroomLocation);

        try {
            // 1. Tìm phiên bản xe phù hợp
            List<PhienBanXe> cars = phienBanXeRepository.findAll();
            String vKw = vehicleKeyword != null ? vehicleKeyword.trim().toLowerCase() : "";
            PhienBanXe matchedCar = cars.stream()
                    .filter(c -> !c.isDeleted() && c.isDangHoatDong())
                    .filter(c -> c.getTenPhienBan().toLowerCase().contains(vKw)
                            || (c.getDongXe() != null && c.getDongXe().getTenDongXe().toLowerCase().contains(vKw)))
                    .findFirst()
                    .orElse(cars.isEmpty() ? null : cars.get(0));

            if (matchedCar == null) {
                return DepositActionResult.builder()
                        .success(false)
                        .message("Không tìm thấy mẫu xe tương ứng để đặt cọc: " + vehicleKeyword)
                        .build();
            }

            // 2. Tìm xe có sẵn trong kho (ưu tiên xe còn khả dụng)
            List<TonKhoXe> stocks = tonKhoXeRepository.findAll();
            String sKw = showroomLocation != null ? showroomLocation.trim().toLowerCase() : "";
            TonKhoXe matchedStock = stocks.stream()
                    .filter(t -> t.getPhienBanXe().getId().equals(matchedCar.getId()))
                    .filter(t -> sKw.isEmpty() || (t.getShowroom() != null
                            && t.getShowroom().getTenShowroom().toLowerCase().contains(sKw)))
                    .filter(t -> t.getSoLuongKhaDung() != null && t.getSoLuongKhaDung() > 0)
                    .findFirst()
                    .orElseGet(() -> stocks.stream()
                            .filter(t -> t.getPhienBanXe().getId().equals(matchedCar.getId()))
                            .findFirst()
                            .orElse(stocks.isEmpty() ? null : stocks.get(0)));

            if (matchedStock == null) {
                return DepositActionResult.builder()
                        .success(false)
                        .message("Dòng xe này hiện tạm hết hàng trong kho. Quý khách vui lòng chọn showroom khác.")
                        .build();
            }

            // 3. Khóa giữ chỗ 1 suất xe trong kho
            if (matchedStock.getSoLuongKhaDung() != null && matchedStock.getSoLuongKhaDung() > 0) {
                matchedStock.setSoLuongKhaDung(matchedStock.getSoLuongKhaDung() - 1);
                matchedStock.setSoLuongDangGiuCho(matchedStock.getSoLuongDangGiuCho() + 1);
                tonKhoXeRepository.save(matchedStock);
            }

            // 4. Tìm hoặc xác định người dùng
            NguoiDung user = (phoneNumber != null && !phoneNumber.isBlank())
                    ? nguoiDungRepository.findBySoDienThoai(phoneNumber.trim()).orElse(null)
                    : null;
            if (user == null) {
                user = nguoiDungRepository.findAll().stream().filter(u -> !u.isDeleted()).findFirst()
                        .orElseThrow(() -> new IllegalStateException("Hệ thống chưa có người dùng"));
            }

            // 5. Tính toán mức tiền cọc & thời hạn thanh toán 15 phút (DR11)
            BigDecimal rawDeposit = matchedCar.getMucTienCoc() != null
                    ? matchedCar.getMucTienCoc()
                    : BigDecimal.valueOf(10000000); // 10 triệu mặc định

            // Thuật toán giảm giá 1/1000 (nhân với 0.001) phục vụ test và kiểm tra thanh toán thực tế
            BigDecimal depositAmount = rawDeposit.multiply(new BigDecimal("0.001")).setScale(0, RoundingMode.HALF_UP);
            if (depositAmount.compareTo(BigDecimal.valueOf(10000)) < 0) {
                depositAmount = BigDecimal.valueOf(10000);
            }

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime paymentDeadline = now.plusMinutes(15);
            String depositCode = "DEP-" + (System.currentTimeMillis() % 1000000000L);

            // 6. Lưu phiếu cọc vào dbo.phieu_dat_coc
            PhieuDatCoc deposit = PhieuDatCoc.builder()
                    .maPhieuCoc(depositCode)
                    .nguoiDung(user)
                    .tonKhoXe(matchedStock)
                    .soCCCD(citizenId != null && !citizenId.isBlank() ? citizenId.trim()
                            : (user.getSoCCCD() != null ? user.getSoCCCD() : "001099001234"))
                    .soTienCoc(depositAmount)
                    .ngayDatCoc(now)
                    .hanThanhToan(paymentDeadline)
                    .trangThai(TrangThaiPhieuCoc.PENDING_PAYMENT)
                    .build();

            phieuDatCocRepository.save(deposit);
            log.info("[Spring AI Tool] Tạo phiếu cọc thành công! Mã: {}", depositCode);

            // 7. Sinh link mã QR thanh toán chuẩn VietQR SePay BIDV
            String bankAcc = (sepayAccountNumber != null && !sepayAccountNumber.isBlank()) ? sepayAccountNumber : "9624767IMG";
            String bankBrand = (sepayBankBrandName != null && !sepayBankBrandName.isBlank()) ? sepayBankBrandName.toLowerCase() : "bidv";
            String transferContent = "AH DEP " + depositCode;
            String qrUrl;
            try {
                qrUrl = String.format("https://img.vietqr.io/image/%s-%s-compact2.png?amount=%s&addInfo=%s&accountName=NGUYEN%%20VAN%%20TRONG",
                        bankBrand, bankAcc, depositAmount.longValue(), URLEncoder.encode(transferContent, StandardCharsets.UTF_8));
            } catch (Exception e) {
                qrUrl = String.format("https://img.vietqr.io/image/%s-%s-compact2.png?amount=%s", bankBrand, bankAcc, depositAmount.longValue());
            }

            return DepositActionResult.builder()
                    .success(true)
                    .maPhieuCoc(depositCode)
                    .message("Tạo phiếu đặt cọc giữ xe 72h thành công! Vui lòng quét mã VietQR để hoàn tất giữ xe.")
                    .tenXe(matchedCar.getTenPhienBan())
                    .showroom(matchedStock.getShowroom() != null ? matchedStock.getShowroom().getTenShowroom()
                            : "Showroom AutoHub")
                    .soTienCoc(VND_FORMAT.format(depositAmount))
                    .hanThanhToan(paymentDeadline.format(TIME_FMT))
                    .vietQrUrl(qrUrl)
                    .huongDan(
                            "Quý khách có 15 phút để chuyển khoản cọc. Sau khi nhận thanh toán, hệ thống sẽ kích hoạt đồng hồ giữ xe 72h và hoàn cọc 100% nếu đổi ý.")
                    .build();

        } catch (Exception ex) {
            log.error("[Spring AI Tool] Lỗi tạo phiếu đặt cọc: {}", ex.getMessage(), ex);
            return DepositActionResult.builder()
                    .success(false)
                    .message("Không thể khởi tạo phiếu đặt cọc: " + ex.getMessage())
                    .build();
        }
    }
}