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
    private final DanhGiaRepository danhGiaRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOrders(@RequestParam(required = false) Long customerId) {
        if (customerId == null) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList(), "Vui lòng cung cấp customerId để tra cứu đơn hàng"));
        }
        List<DonHangPhuKien> orders = donHangRepository.findByNguoiDungId(customerId);

        if (orders.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList(), "Lấy danh sách đơn hàng thành công"));
        }

        List<Map<String, Object>> result = orders.stream()
                .map(order -> mapOrderToDto(order, chiTietDonHangRepository.findByDonHangId(order.getId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đơn hàng thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderDetail(
            @PathVariable Long id,
            @RequestParam(required = false) Long customerId
    ) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));

        if (customerId != null && order.getNguoiDung() != null && !customerId.equals(order.getNguoiDung().getId())) {
            return ResponseEntity.status(403).body(ApiResponse.error("Bạn không có quyền xem đơn hàng này"));
        }

        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangId(id);
        return ResponseEntity.ok(ApiResponse.ok(mapOrderToDto(order, items), "Chi tiết đơn hàng"));
    }

    @PostMapping("/{id}/cancel")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> cancelOrder(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));

        if (order.getTrangThai() == TrangThaiDonHang.DELIVERED || order.getTrangThai() == TrangThaiDonHang.CANCELLED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể hủy đơn hàng ở trạng thái hiện tại."));
        }

        order.setTrangThai(TrangThaiDonHang.CANCELLED);
        if (body != null && body.containsKey("reason")) {
            order.setGhiChuKhachHang("[Khách hủy: " + body.get("reason") + "] " + (order.getGhiChuKhachHang() != null ? order.getGhiChuKhachHang() : ""));
        }
        donHangRepository.save(order);

        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangId(id);
        return ResponseEntity.ok(ApiResponse.ok(mapOrderToDto(order, items), "Hủy đơn hàng thành công!"));
    }

    @PostMapping("/{id}/return")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> requestReturn(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));

        order.setTrangThai(TrangThaiDonHang.REFUND_REQUIRED);
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "Yêu cầu đổi/trả hàng";
        order.setGhiChuKhachHang("[Yêu cầu đổi trả: " + reason + "] " + (order.getGhiChuKhachHang() != null ? order.getGhiChuKhachHang() : ""));
        donHangRepository.save(order);

        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangId(id);
        return ResponseEntity.ok(ApiResponse.ok(mapOrderToDto(order, items), "Gửi yêu cầu đổi trả thành công!"));
    }

    @PostMapping("/{id}/delivered")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> confirmDelivered(@PathVariable Long id) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));

        order.setTrangThai(TrangThaiDonHang.DELIVERED);
        order.setNgayGiaoHang(LocalDateTime.now());
        donHangRepository.save(order);

        List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangId(id);
        return ResponseEntity.ok(ApiResponse.ok(mapOrderToDto(order, items), "Xác nhận đã nhận hàng thành công!"));
    }

    @Getter
    @Setter
    public static class ReviewItemDto {
        private Long orderDetailId;
        private Long accessoryId;
        private Integer rating;
        private String comment;
        private List<String> images;
    }

    @Getter
    @Setter
    public static class SubmitReviewRequestDto {
        private Long customerId;
        private List<ReviewItemDto> reviews;
    }

    @PostMapping("/{id}/reviews")
    @Transactional
    public ResponseEntity<ApiResponse<String>> submitReview(
            @PathVariable Long id,
            @RequestBody SubmitReviewRequestDto request
    ) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));

        Long customerId = request.getCustomerId() != null ? request.getCustomerId() :
                (order.getNguoiDung() != null ? order.getNguoiDung().getId() : 1L);
        NguoiDung customer = nguoiDungRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));

        if (request.getReviews() != null) {
            for (ReviewItemDto r : request.getReviews()) {
                PhuKien pk = null;
                ChiTietDonHang ctdh = null;

                if (r.getOrderDetailId() != null) {
                    ctdh = chiTietDonHangRepository.findById(r.getOrderDetailId()).orElse(null);
                    if (ctdh != null) {
                        pk = ctdh.getPhuKien();
                    }
                }
                if (pk == null && r.getAccessoryId() != null) {
                    pk = phuKienRepository.findById(r.getAccessoryId()).orElse(null);
                }

                if (pk != null && ctdh != null) {
                    final Long ctdhId = ctdh.getId();
                    Optional<DanhGia> existing = danhGiaRepository.findByPhuKienIdAndTrangThaiDuyet(pk.getId(), TrangThaiDanhGia.PENDING).stream()
                            .filter(d -> d.getChiTietDonHang() != null && ctdhId.equals(d.getChiTietDonHang().getId()))
                            .findFirst();

                    DanhGia dg = existing.orElseGet(() -> DanhGia.builder()
                            .chiTietDonHang(null)
                            .nguoiDung(null)
                            .phuKien(null)
                            .build());

                    dg.setNguoiDung(customer);
                    dg.setPhuKien(pk);
                    dg.setChiTietDonHang(ctdh);
                    dg.setSoSao(r.getRating() != null ? r.getRating() : 5);
                    dg.setNoiDung(r.getComment());
                    dg.setTrangThaiDuyet(TrangThaiDanhGia.APPROVED);
                    dg.setNgayDanhGia(LocalDateTime.now());

                    if (r.getImages() != null && !r.getImages().isEmpty()) {
                        String jsonImages = "[" + r.getImages().stream()
                                .map(img -> "\"" + img.replace("\"", "\\\"") + "\"")
                                .collect(Collectors.joining(",")) + "]";
                        dg.setHinhAnhDanhGia(jsonImages);
                    }

                    danhGiaRepository.save(dg);
                }
            }
        }

        return ResponseEntity.ok(ApiResponse.ok("Đánh giá sản phẩm đã được lưu trữ thành công!"));
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
    public static class CreateOrderRequestDto {
        private Long customerId;
        private String recipientName;
        private String phone;
        private String shippingAddress;
        private String customerNote;
        private String paymentMethod; // COD hoặc SEPAY
        private String voucherCode;
        private BigDecimal shippingFee;
        private List<CheckoutItemDto> items;
    }

    @PostMapping({"", "/checkout"})
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
            HttpServletRequest servletRequest,
            @RequestBody CreateOrderRequestDto req
    ) {
        Long customerId = req.getCustomerId();
        if (customerId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng cung cấp customerId để đặt hàng"));
        }
        NguoiDung customer = nguoiDungRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản người dùng ID: " + customerId));

        BigDecimal subtotal = BigDecimal.ZERO;
        if (req.getItems() != null) {
            for (CheckoutItemDto item : req.getItems()) {
                BigDecimal price = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
            }
        }

        Voucher appliedVoucher = null;
        BigDecimal discount = BigDecimal.ZERO;
        if (req.getVoucherCode() != null && !req.getVoucherCode().isBlank()) {
            Optional<Voucher> vOpt = voucherRepository.findByMaVoucher(req.getVoucherCode());
            if (vOpt.isPresent()) {
                appliedVoucher = vOpt.get();
                if (appliedVoucher.getPhanTramGiam() != null) {
                    discount = subtotal.multiply(BigDecimal.valueOf(appliedVoucher.getPhanTramGiam())).divide(BigDecimal.valueOf(100));
                }
                if (appliedVoucher.getGiamToiDa() != null && discount.compareTo(appliedVoucher.getGiamToiDa()) > 0) {
                    discount = appliedVoucher.getGiamToiDa();
                }
            }
        }

        BigDecimal shippingFee = (req.getShippingFee() != null) ? req.getShippingFee() : BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal.subtract(discount).add(shippingFee);
        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) {
            grandTotal = BigDecimal.ZERO;
        }

        PhuongThucThanhToan pttt = PhuongThucThanhToan.COD;
        if ("SEPAY".equalsIgnoreCase(req.getPaymentMethod()) || "BANK_TRANSFER".equalsIgnoreCase(req.getPaymentMethod()) || "ONLINE".equalsIgnoreCase(req.getPaymentMethod())) {
            pttt = PhuongThucThanhToan.SEPAY;
        }
        boolean isOnlinePayment = pttt == PhuongThucThanhToan.SEPAY;

        DonHangPhuKien order = DonHangPhuKien.builder()
                .maDonHang("AH-ACC-2026-" + (1000 + (int)(Math.random() * 9000)))
                .nguoiDung(customer)
                .voucher(appliedVoucher)
                .hoTenNguoiNhan(req.getRecipientName() != null ? req.getRecipientName() : "Khách hàng AutoHub")
                .soDienThoaiNhan(req.getPhone() != null ? req.getPhone() : "0912345678")
                .diaChiGiaoHang(req.getShippingAddress() != null ? req.getShippingAddress() : "TP. Hồ Chí Minh")
                .ghiChuKhachHang(req.getCustomerNote())
                .ngayDat(LocalDateTime.now())
                .phuongThucThanhToan(pttt)
                .phiVanChuyen(shippingFee)
                .soTienGiamVoucher(discount)
                .tongTien(grandTotal)
                .trangThai(isOnlinePayment ? TrangThaiDonHang.PENDING_PAYMENT : TrangThaiDonHang.PENDING)
                .hanThanhToan(isOnlinePayment ? LocalDateTime.now().plusMinutes(15) : null)
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

        if (isOnlinePayment) {
            Map<String, Object> sepayInfo = new HashMap<>();
            sepayInfo.put("accountNumber", "0912345678");
            sepayInfo.put("bankBrandName", "MBBank");
            sepayInfo.put("transferAmount", grandTotal);
            sepayInfo.put("transferContent", savedOrder.getMaDonHang());
            responseData.put("sepay", sepayInfo);
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
        map.put("customerNote", order.getGhiChuKhachHang());
        map.put("paymentMethod", order.getPhuongThucThanhToan() != null ? order.getPhuongThucThanhToan().name() : "SEPAY");
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
        map.put("sepayTransactionId", "SP_" + (Math.abs(code.hashCode()) % 10000000));
        map.put("createdAt", order.getNgayDat() != null ? order.getNgayDat().toString() : LocalDateTime.now().toString());

        List<Map<String, Object>> mappedItems = new ArrayList<>();
        if (items != null && !items.isEmpty()) {
            for (ChiTietDonHang it : items) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", it.getId());
                itemMap.put("quantity", it.getSoLuong());
                itemMap.put("unitPrice", it.getDonGia());
                itemMap.put("totalPrice", it.getDonGia() != null ? it.getDonGia().multiply(BigDecimal.valueOf(it.getSoLuong())) : BigDecimal.ZERO);

                PhuKien pk = it.getPhuKien();
                Map<String, Object> accMap = new HashMap<>();
                if (pk != null) {
                    itemMap.put("accessoryId", pk.getId());
                    accMap.put("id", pk.getId());
                    accMap.put("name", pk.getTenPhuKien());
                    accMap.put("code", "PK-" + pk.getId());
                    accMap.put("price", pk.getGiaBan());
                    accMap.put("imageUrl", pk.getHinhAnh());
                    accMap.put("category", pk.getDanhMucPhuKien() != null ? pk.getDanhMucPhuKien().getTenDanhMuc() : "Phụ kiện OEM");
                }
                itemMap.put("accessory", accMap);
                mappedItems.add(itemMap);
            }
        }
        map.put("items", mappedItems);
        return map;
    }
}
