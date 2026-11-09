package com.autohub.integration.vnpay;

import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.PhuongThucThanhToan;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.enums.TrangThaiThanhToan;
import com.autohub.core.payment.entity.GiaoDichThanhToan;
import com.autohub.core.payment.repository.GiaoDichThanhToanRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class VNPayService {

    private final VNPayConfig vnPayConfig;
    private final GiaoDichThanhToanRepository giaoDichRepository;
    private final PhieuDatCocRepository phieuDatCocRepository;
    private final DonHangPhuKienRepository donHangRepository;

    /**
     * Tạo URL thanh toán VNPay cho Phiếu đặt cọc xe
     */
    @Transactional
    public VNPayPaymentResponseDto createDepositPaymentUrl(HttpServletRequest request, Long depositId) {
        PhieuDatCoc deposit = phieuDatCocRepository.findById(depositId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu đặt cọc với ID: " + depositId));

        String txnRef = "DEP_" + deposit.getId() + "_" + System.currentTimeMillis();
        String orderInfo = "Thanh toan coc xe " + deposit.getMaPhieuCoc();

        // Lưu bản ghi giao dịch chờ thanh toán
        GiaoDichThanhToan txn = GiaoDichThanhToan.builder()
                .phieuDatCoc(deposit)
                .maThamChieu(txnRef)
                .phuongThuc(PhuongThucThanhToan.VNPAY)
                .loaiGiaoDich("THANH_TOAN")
                .soTien(deposit.getSoTienCoc())
                .thoiGianKhoiTao(LocalDateTime.now())
                .trangThai(TrangThaiThanhToan.PENDING)
                .build();
        giaoDichRepository.save(txn);

        String paymentUrl = buildVnPayUrl(request, deposit.getSoTienCoc(), orderInfo, txnRef);

        return VNPayPaymentResponseDto.builder()
                .paymentUrl(paymentUrl)
                .txnRef(txnRef)
                .amount(deposit.getSoTienCoc())
                .orderInfo(orderInfo)
                .expiresInMinutes(15)
                .build();
    }

    /**
     * Tạo URL thanh toán VNPay cho Đơn hàng phụ kiện
     */
    @Transactional
    public VNPayPaymentResponseDto createOrderPaymentUrl(HttpServletRequest request, Long orderId) {
        DonHangPhuKien order = donHangRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng phụ kiện với ID: " + orderId));

        String txnRef = "ACC_" + order.getId() + "_" + System.currentTimeMillis();
        String orderInfo = "Thanh toan don phu kien " + order.getMaDonHang();

        GiaoDichThanhToan txn = GiaoDichThanhToan.builder()
                .donHangPhuKien(order)
                .maThamChieu(txnRef)
                .phuongThuc(PhuongThucThanhToan.VNPAY)
                .loaiGiaoDich("THANH_TOAN")
                .soTien(order.getTongTien())
                .thoiGianKhoiTao(LocalDateTime.now())
                .trangThai(TrangThaiThanhToan.PENDING)
                .build();
        giaoDichRepository.save(txn);

        String paymentUrl = buildVnPayUrl(request, order.getTongTien(), orderInfo, txnRef);

        return VNPayPaymentResponseDto.builder()
                .paymentUrl(paymentUrl)
                .txnRef(txnRef)
                .amount(order.getTongTien())
                .orderInfo(orderInfo)
                .expiresInMinutes(15)
                .build();
    }

    /**
     * Xử lý callback kết quả thanh toán từ VNPay
     */
    @Transactional
    public boolean processPaymentCallback(Map<String, String> params) {
        String secureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        String calculatedHash = VNPayConfig.hashAllFields(params, vnPayConfig.getHashSecret());
        if (!calculatedHash.equalsIgnoreCase(secureHash)) {
            log.error("Sai chữ ký bảo mật VNPay (Invalid Checksum)");
            return false;
        }

        String txnRef = params.get("vnp_TxnRef");
        String vnpResponseCode = params.get("vnp_ResponseCode");
        String vnpTransactionNo = params.get("vnp_TransactionNo");

        Optional<GiaoDichThanhToan> optTxn = giaoDichRepository.findByMaThamChieu(txnRef);
        if (optTxn.isEmpty()) {
            log.warn("Không tìm thấy giao dịch với mã tham chiếu: {}", txnRef);
            return false;
        }

        GiaoDichThanhToan txn = optTxn.get();
        txn.setMaGiaoDichVnpay(vnpTransactionNo);
        txn.setMaKetQua(vnpResponseCode);
        txn.setThoiGianThanhToan(LocalDateTime.now());

        boolean isSuccess = "00".equals(vnpResponseCode);
        txn.setTrangThai(isSuccess ? TrangThaiThanhToan.SUCCESS : TrangThaiThanhToan.FAILED);
        giaoDichRepository.save(txn);

        if (isSuccess) {
            // Nếu giao dịch cho Phiếu đặt cọc xe
            if (txn.getPhieuDatCoc() != null) {
                PhieuDatCoc deposit = txn.getPhieuDatCoc();
                deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
                deposit.setThoiGianThanhToan(LocalDateTime.now());
                deposit.setHanGiuXe(LocalDateTime.now().plusHours(72)); // Giữ xe 72h
                phieuDatCocRepository.save(deposit);
                log.info("Xác nhận thanh toán cọc thành công cho phiếu cọc #{}", deposit.getMaPhieuCoc());
            }

            // Nếu giao dịch cho Đơn hàng phụ kiện
            if (txn.getDonHangPhuKien() != null) {
                DonHangPhuKien order = txn.getDonHangPhuKien();
                order.setTrangThai(TrangThaiDonHang.PAID);
                order.setThoiGianThanhToan(LocalDateTime.now());
                donHangRepository.save(order);
                log.info("Xác nhận thanh toán thành công cho đơn hàng phụ kiện #{}", order.getMaDonHang());
            }
        }

        return isSuccess;
    }

    /**
     * Giả lập thanh toán thành công (Môi trường Test / Sandbox)
     */
    @Transactional
    public boolean simulateSuccess(String txnRef) {
        Optional<GiaoDichThanhToan> optTxn = giaoDichRepository.findByMaThamChieu(txnRef);
        if (optTxn.isEmpty()) {
            return false;
        }
        GiaoDichThanhToan txn = optTxn.get();
        txn.setMaGiaoDichVnpay("SIM_" + System.currentTimeMillis());
        txn.setMaKetQua("00");
        txn.setThoiGianThanhToan(LocalDateTime.now());
        txn.setTrangThai(TrangThaiThanhToan.SUCCESS);
        giaoDichRepository.save(txn);

        if (txn.getPhieuDatCoc() != null) {
            PhieuDatCoc deposit = txn.getPhieuDatCoc();
            deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
            deposit.setThoiGianThanhToan(LocalDateTime.now());
            deposit.setHanGiuXe(LocalDateTime.now().plusHours(72));
            phieuDatCocRepository.save(deposit);
            log.info("Giả lập thành công: Đã chuyển cọc xe #{} sang PAID", deposit.getMaPhieuCoc());
        }

        if (txn.getDonHangPhuKien() != null) {
            DonHangPhuKien order = txn.getDonHangPhuKien();
            order.setTrangThai(TrangThaiDonHang.PAID);
            order.setThoiGianThanhToan(LocalDateTime.now());
            donHangRepository.save(order);
            log.info("Giả lập thành công: Đã chuyển đơn hàng phụ kiện #{} sang PAID", order.getMaDonHang());
        }
        return true;
    }

    /**
     * Kiểm tra trạng thái giao dịch
     */
    public TrangThaiThanhToan getPaymentStatus(String txnRef) {
        return giaoDichRepository.findByMaThamChieu(txnRef)
                .map(GiaoDichThanhToan::getTrangThai)
                .orElse(null);
    }

    private String buildVnPayUrl(HttpServletRequest request, BigDecimal amount, String orderInfo, String txnRef) {
        long vnpAmount = amount.multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", VNPayConfig.VNP_VERSION);
        vnpParams.put("vnp_Command", VNPayConfig.VNP_COMMAND);
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(vnpAmount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", getIpAddress(request));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        // Hạn thanh toán (15 phút)
        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        String queryUrl = VNPayConfig.buildQueryUrl(vnpParams, vnPayConfig.getHashSecret());
        return vnPayConfig.getPayUrl() + "?" + queryUrl;
    }

    private String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = "127.0.0.1";
        }
        return ipAddress;
    }
}

