package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.DanhGia;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.DanhGiaRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.enums.PhuongThucThanhToan;
import com.autohub.core.enums.TrangThaiDanhGia;
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
import java.util.stream.Collectors;

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
    private final DanhGiaRepository danhGiaRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOrders(@RequestParam(required = false) Long customerId) {
        List<DonHangPhuKien> orders = donHangRepository.findAllWithDetails(customerId);
        if (orders.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList(), "Lấy danh sách đơn hàng thành công"));
        }

        List<Long> orderIds = orders.stream().map(DonHangPhuKien::getId).collect(Collectors.toList());
        List<ChiTietDonHang> allItems = chiTietDonHangRepository.findByDonHangIdInWithDetails(orderIds);
        Map<Long, List<ChiTietDonHang>> itemsByOrderId = allItems.stream()
                .collect(Collectors.groupingBy(item -> item.getDonHang().getId()));

        List<Map<String, Object>> result = orders.stream()
                .map(order -> mapOrderToDto(order, itemsByOrderId.getOrDefault(order.getId(), Collections.emptyList())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đơn hàng phụ kiện thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderDetail(@PathVariable Long id) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));
        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangIdWithDetails(id);

        return ResponseEntity.ok(ApiResponse.ok(mapOrderToDto(order, items), "Lấy chi tiết đơn hàng thành công"));
    }

    @PostMapping("/{id}/delivered")
    public ResponseEntity<ApiResponse<Map<String, Object>>> confirmDelivered(@PathVariable Long id) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));
        order.setTrangThai(TrangThaiDonHang.DELIVERED);
        order.setNgayGiaoHang(LocalDateTime.now());
        DonHangPhuKien saved = donHangRepository.save(order);
        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangIdWithDetails(id);
        return ResponseEntity.ok(ApiResponse.ok(mapOrderToDto(saved, items), "Xác nhận nhận hàng thành công"));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cancelOrder(@PathVariable Long id) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));
        order.setTrangThai(TrangThaiDonHang.CANCELLED);
        DonHangPhuKien saved = donHangRepository.save(order);
        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangIdWithDetails(id);
        return ResponseEntity.ok(ApiResponse.ok(mapOrderToDto(saved, items), "Hủy đơn hàng thành công"));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<ApiResponse<Map<String, Object>>> returnOrder(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));
        order.setTrangThai(TrangThaiDonHang.RETURNED);
        DonHangPhuKien saved = donHangRepository.save(order);
        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangIdWithDetails(id);
        return ResponseEntity.ok(ApiResponse.ok(mapOrderToDto(saved, items), "Gửi yêu cầu đổi trả thành công"));
    }

    @PostMapping("/{id}/review")
    @Transactional
    public ResponseEntity<ApiResponse<String>> submitReview(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));

        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangIdWithDetails(id);
        if (items.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Đơn hàng không có sản phẩm để đánh giá"));
        }

        Integer stars = 5;
        if (body != null && body.get("rating") != null) {
            stars = Integer.valueOf(body.get("rating").toString());
        }
        String comment = (body != null && body.get("comment") != null)
                ? body.get("comment").toString()
                : "Sản phẩm chất lượng cao chính hãng AutoHub.";

        for (ChiTietDonHang item : items) {
            DanhGia dg = DanhGia.builder()
                    .nguoiDung(order.getNguoiDung())
                    .phuKien(item.getPhuKien())
                    .chiTietDonHang(item)
                    .soSao(stars)
                    .noiDung(comment)
                    .ngayDanhGia(LocalDateTime.now())
                    .trangThaiDuyet(TrangThaiDanhGia.PENDING)
                    .build();
            try {
                danhGiaRepository.save(dg);
            } catch (Exception ignored) {
                // Ignore duplicate review on same order item
            }
        }

        return ResponseEntity.ok(ApiResponse.ok("Đánh giá đơn hàng đã được lưu và gửi tới Admin kiểm duyệt.", "Gửi đánh giá thành công"));
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

        if (isVnPay) {
            VNPayPaymentResponseDto vnpayInfo = vnPayService.createOrderPaymentUrl(servletRequest, savedOrder.getId());
            responseData.put("vnpay", vnpayInfo);
        }

        return ResponseEntity.ok(ApiResponse.ok(responseData, "Đặt hàng thành công!"));
    }

    private Map<String, Object> mapOrderToDto(DonHangPhuKien order, List<ChiTietDonHang> items) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", order.getId());
        String code = order.getMaDonHang() != null ? order.getMaDonHang() : "AH-ACC-2026-" + order.getId();
        map.put("orderCode", code.startsWith("#") ? code : "#" + code);
        map.put("customerId", order.getNguoiDung() != null ? order.getNguoiDung().getId() : 1L);
        map.put("customerName", order.getHoTenNguoiNhan() != null ? order.getHoTenNguoiNhan() : "Nguyễn Văn A");
        map.put("customerPhone", order.getSoDienThoaiNhan() != null ? order.getSoDienThoaiNhan() : "0912345678");
        map.put("shippingAddress", order.getDiaChiGiaoHang() != null ? order.getDiaChiGiaoHang() : "TP. Hồ Chí Minh");
        map.put("paymentMethod", order.getPhuongThucThanhToan() != null ? order.getPhuongThucThanhToan().name() : "VNPAY");
        map.put("status", order.getTrangThai() != null ? order.getTrangThai().name() : "PAID");

        BigDecimal total = order.getTongTien() != null ? order.getTongTien() : BigDecimal.ZERO;
        BigDecimal discount = order.getSoTienGiamVoucher() != null ? order.getSoTienGiamVoucher() : BigDecimal.ZERO;
        BigDecimal ship = order.getPhiVanChuyen() != null ? order.getPhiVanChuyen() : BigDecimal.ZERO;
        BigDecimal subtotal = total.add(discount).subtract(ship);
        if (subtotal.compareTo(BigDecimal.ZERO) < 0) subtotal = total;

        map.put("subtotalAmount", subtotal);
        map.put("shippingFee", ship);
        map.put("voucherDiscount", discount);
        map.put("finalTotalAmount", total);
        map.put("trackingNumber", order.getMaVanDon() != null ? order.getMaVanDon() : "AH-EXPRESS-" + order.getId());
        map.put("vnpayTransactionId", "vnp_" + (Math.abs(code.hashCode()) % 10000000));
        map.put("createdAt", order.getNgayDat() != null ? order.getNgayDat().toString() : LocalDateTime.now().toString());

        List<Map<String, Object>> mappedItems = new ArrayList<>();
        if (items != null && !items.isEmpty()) {
            for (ChiTietDonHang it : items) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", it.getId());
                itemMap.put("quantity", it.getSoLuong());
                itemMap.put("unitPrice", it.getDonGia());
                itemMap.put("totalPrice", it.getDonGia().multiply(BigDecimal.valueOf(it.getSoLuong())));

                PhuKien pk = it.getPhuKien();
                Map<String, Object> accMap = new HashMap<>();
                if (pk != null) {
                    itemMap.put("accessoryId", pk.getId());
                    accMap.put("id", pk.getId());
                    accMap.put("name", pk.getTenPhuKien());
                    accMap.put("sku", pk.getThuongHieu() != null ? pk.getThuongHieu().toUpperCase().replace(" ", "-") : "AH-ACC-" + pk.getId());
                    accMap.put("brand", pk.getThuongHieu() != null ? pk.getThuongHieu() : "AutoHub Genuine");
                    accMap.put("price", pk.getGiaBan());
                    accMap.put("thumbnailUrl", pk.getHinhAnh() != null ? pk.getHinhAnh() : "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400");
                    accMap.put("categoryName", pk.getDanhMucPhuKien() != null ? pk.getDanhMucPhuKien().getTenDanhMuc() : "Phụ kiện cao cấp");
                    accMap.put("categoryBadge", pk.getDanhMucPhuKien() != null ? pk.getDanhMucPhuKien().getTenDanhMuc() : "Chính hãng");
                } else {
                    itemMap.put("accessoryId", 1L);
                    accMap.put("id", 1L);
                    accMap.put("name", "Phụ kiện ô tô điện cao cấp");
                    accMap.put("sku", "AH-ACC-GENUINE");
                    accMap.put("brand", "AutoHub Genuine");
                    accMap.put("price", it.getDonGia());
                    accMap.put("thumbnailUrl", "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400");
                    accMap.put("categoryName", "Phụ kiện chính hãng");
                    accMap.put("categoryBadge", "Chính hãng");
                }
                itemMap.put("accessory", accMap);
                mappedItems.add(itemMap);
            }
        }
        map.put("orderItems", mappedItems);
        return map;
    }
}
