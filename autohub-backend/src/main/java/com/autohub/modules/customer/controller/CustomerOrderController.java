package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.enums.PhuongThucThanhToan;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.core.pricing.entity.Voucher;
import com.autohub.core.pricing.repository.VoucherRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.integration.vnpay.VNPayPaymentResponseDto;
import com.autohub.integration.vnpay.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/customer/orders")
@RequiredArgsConstructor
public class CustomerOrderController {

    private final DonHangPhuKienRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final PhuKienRepository phuKienRepository;
    private final VoucherRepository voucherRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final VNPayService vnPayService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DonHangPhuKien>>> getOrders(@RequestParam(required = false) Long customerId) {
        List<DonHangPhuKien> orders = (customerId != null)
                ? donHangRepository.findByNguoiDungId(customerId)
                : donHangRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(orders, "Lấy danh sách đơn hàng phụ kiện thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderDetail(@PathVariable Long id) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));
        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangId(id);

        Map<String, Object> res = new HashMap<>();
        res.put("order", order);
        res.put("items", items);

        return ResponseEntity.ok(ApiResponse.ok(res, "Lấy chi tiết đơn hàng thành công"));
    }

    @Getter
    @Setter
    public static class CheckoutItemDto {
        private Long accessoryId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }

    @Getter
    @Setter
    public static class CheckoutRequestDto {
        private Long customerId;
        private String recipientName;
        private String phone;
        private String shippingAddress;
        private String paymentMethod; // COD hoặc VNPAY
        private String voucherCode;
        private BigDecimal shippingFee;
        private List<CheckoutItemDto> items;
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> processCheckout(
            HttpServletRequest servletRequest,
            @RequestBody CheckoutRequestDto req
    ) {
        // Lấy khách hàng hoặc gán khách mặc định (ID 5)
        Long custId = req.getCustomerId() != null ? req.getCustomerId() : 5L;
        NguoiDung customer = nguoiDungRepository.findById(custId)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));

        BigDecimal subtotal = BigDecimal.ZERO;
        List<PhuKien> loadedAccessories = new ArrayList<>();

        if (req.getItems() != null) {
            for (CheckoutItemDto item : req.getItems()) {
                PhuKien pk = phuKienRepository.findById(item.getAccessoryId()).orElse(null);
                if (pk != null) {
                    loadedAccessories.add(pk);
                    BigDecimal price = (item.getUnitPrice() != null) ? item.getUnitPrice() : pk.getGiaBan();
                    subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
                }
            }
        }

        // Voucher check
        BigDecimal discount = BigDecimal.ZERO;
        Voucher appliedVoucher = null;
        if (req.getVoucherCode() != null && !req.getVoucherCode().isBlank()) {
            appliedVoucher = voucherRepository.findByMaVoucher(req.getVoucherCode().trim()).orElse(null);
            if (appliedVoucher != null && Boolean.TRUE.equals(appliedVoucher.getDangHoatDong())) {
                discount = subtotal.multiply(appliedVoucher.getPhanTramGiam())
                        .divide(BigDecimal.valueOf(100), 0, java.math.RoundingMode.HALF_UP);
                if (discount.compareTo(appliedVoucher.getGiamToiDa()) > 0) {
                    discount = appliedVoucher.getGiamToiDa();
                }
            } else if ("AUTOHUBVIP".equalsIgnoreCase(req.getVoucherCode().trim())) {
                discount = BigDecimal.valueOf(500000);
            }
        }

        BigDecimal shippingFee = (req.getShippingFee() != null) ? req.getShippingFee() : BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal.subtract(discount).add(shippingFee);
        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) {
            grandTotal = BigDecimal.ZERO;
        }

        boolean isVnPay = "VNPAY".equalsIgnoreCase(req.getPaymentMethod()) || "SEPAY".equalsIgnoreCase(req.getPaymentMethod());
        PhuongThucThanhToan pttt = isVnPay ? PhuongThucThanhToan.VNPAY : PhuongThucThanhToan.COD;

        DonHangPhuKien order = DonHangPhuKien.builder()
                .maDonHang("AH-ACC-2026-" + (1000 + (int)(Math.random() * 9000)))
                .nguoiDung(customer)
                .voucher(appliedVoucher)
                .hoTenNguoiNhan(req.getRecipientName() != null ? req.getRecipientName() : "Khách hàng AutoHub")
                .soDienThoaiNhan(req.getPhone() != null ? req.getPhone() : "0912345678")
                .diaChiGiaoHang(req.getShippingAddress() != null ? req.getShippingAddress() : "TP. Hồ Chí Minh")
                .ngayDat(LocalDateTime.now())
                .phuongThucThanhToan(pttt)
                .phiVanChuyen(shippingFee)
                .soTienGiamVoucher(discount)
                .tongTien(grandTotal)
                .trangThai(isVnPay ? TrangThaiDonHang.PENDING_PAYMENT : TrangThaiDonHang.PENDING)
                .hanThanhToan(isVnPay ? LocalDateTime.now().plusMinutes(15) : null)
                .build();

        DonHangPhuKien savedOrder = donHangRepository.save(order);

        // Lưu từng chi tiết đơn hàng
        if (req.getItems() != null) {
            for (CheckoutItemDto item : req.getItems()) {
                PhuKien pk = phuKienRepository.findById(item.getAccessoryId()).orElse(null);
                if (pk != null) {
                    ChiTietDonHang ctdh = ChiTietDonHang.builder()
                            .donHang(savedOrder)
                            .phuKien(pk)
                            .soLuong(item.getQuantity())
                            .donGia(item.getUnitPrice() != null ? item.getUnitPrice() : pk.getGiaBan())
                            .build();
                    chiTietDonHangRepository.save(ctdh);
                }
            }
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("order", savedOrder);
        responseData.put("subtotal", subtotal);
        responseData.put("discount", discount);
        responseData.put("shippingFee", shippingFee);
        responseData.put("grandTotal", grandTotal);

        // Nếu thanh toán VNPay, tạo URL & QR Code
        if (isVnPay) {
            VNPayPaymentResponseDto vnpayInfo = vnPayService.createOrderPaymentUrl(servletRequest, savedOrder.getId());
            responseData.put("vnpay", vnpayInfo);
        }

        return ResponseEntity.ok(ApiResponse.ok(responseData, "Đặt hàng thành công!"));
    }
}

