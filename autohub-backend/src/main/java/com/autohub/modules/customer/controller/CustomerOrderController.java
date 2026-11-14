package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.ChiTietGioHang;
import com.autohub.core.accessory.entity.DanhGia;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.entity.GioHang;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.entity.PhuongThucVanChuyen;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.ChiTietGioHangRepository;
import com.autohub.core.accessory.repository.DanhGiaRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.accessory.repository.GioHangRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.accessory.repository.PhuongThucVanChuyenRepository;
import com.autohub.core.enums.PhuongThucThanhToan;
import com.autohub.core.enums.TrangThaiDanhGia;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.core.pricing.entity.Voucher;
import com.autohub.core.pricing.repository.VoucherRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final GioHangRepository gioHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final PhuongThucVanChuyenRepository phuongThucVanChuyenRepository;

    @Value("${sepay.account-number:5811676579}")
    private String sepayAccountNumber;

    @Value("${sepay.bank-brand-name:BIDV}")
    private String sepayBankBrandName;

    private NguoiDung resolveCurrentUser(Long requestedCustomerId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getName() != null && !"anonymousUser".equals(auth.getName())) {
                Optional<NguoiDung> byEmail = nguoiDungRepository.findByEmail(auth.getName());
                if (byEmail.isPresent()) {
                    return byEmail.get();
                }
            }
        } catch (Exception ignored) {}

        if (requestedCustomerId != null) {
            return nguoiDungRepository.findById(requestedCustomerId).orElse(null);
        }
        return null;
    }

    @GetMapping({"", "/my-orders"})
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOrders(@RequestParam(required = false) Long customerId) {
        NguoiDung user = resolveCurrentUser(customerId);
        List<DonHangPhuKien> orders;
        if (user != null) {
            orders = donHangRepository.findByNguoiDungIdOrderByNgayDatDesc(user.getId());
            if (orders.isEmpty()) {
                orders = donHangRepository.findAllByOrderByNgayDatDesc();
            }
        } else if (customerId != null) {
            orders = donHangRepository.findByNguoiDungIdOrderByNgayDatDesc(customerId);
            if (orders.isEmpty()) {
                orders = donHangRepository.findAllByOrderByNgayDatDesc();
            }
        } else {
            orders = donHangRepository.findAllByOrderByNgayDatDesc();
        }

        if (orders.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList(), "Lấy danh sách đơn hàng thành công"));
        }

        List<Map<String, Object>> result = orders.stream()
                .map(order -> mapOrderToDto(order, chiTietDonHangRepository.findByDonHangId(order.getId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đơn hàng thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderDetail(@PathVariable Long id) {
        DonHangPhuKien order = donHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + id));

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
                    Optional<DanhGia> existing = danhGiaRepository.findAll().stream()
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
        private String shippingMethodId;
        private BigDecimal shippingFee;
        private List<CheckoutItemDto> items;
    }

    @PostMapping({"", "/checkout"})
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
            HttpServletRequest servletRequest,
            @RequestBody CreateOrderRequestDto req
    ) {
        Long customerId = req.getCustomerId() != null ? req.getCustomerId() : 1L;
        NguoiDung customer = nguoiDungRepository.findById(customerId)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));

        if (customer == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy tài khoản người dùng"));
        }

        // 1. Kiểm tra tồn kho thực tế của từng sản phẩm trước khi tạo đơn
        if (req.getItems() == null || req.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng phải chứa ít nhất 1 sản phẩm phụ kiện"));
        }

        for (CheckoutItemDto item : req.getItems()) {
            if (item.getAccessoryId() == null) continue;
            PhuKien pk = phuKienRepository.findById(item.getAccessoryId()).orElse(null);
            if (pk == null || !pk.isDangHoatDong()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Phụ kiện ID " + item.getAccessoryId() + " không tồn tại hoặc đã ngừng kinh doanh"));
            }
            int reqQty = item.getQuantity() != null && item.getQuantity() > 0 ? item.getQuantity() : 1;
            int stock = pk.getSoLuongTon() != null ? pk.getSoLuongTon() : 0;
            if (reqQty > stock) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Sản phẩm '" + pk.getTenPhuKien() + "' không đủ số lượng tồn kho (yêu cầu " + reqQty + " bộ, hiện chỉ còn " + stock + " bộ sẵn kho)"));
            }
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CheckoutItemDto item : req.getItems()) {
            PhuKien pk = phuKienRepository.findById(item.getAccessoryId()).orElse(null);
            BigDecimal price = item.getUnitPrice() != null ? item.getUnitPrice() : (pk != null ? pk.getGiaBan() : BigDecimal.ZERO);
            int qty = item.getQuantity() != null && item.getQuantity() > 0 ? item.getQuantity() : 1;
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(qty)));
        }

        Voucher appliedVoucher = null;
        BigDecimal discount = BigDecimal.ZERO;
        if (req.getVoucherCode() != null && !req.getVoucherCode().isBlank()) {
            Optional<Voucher> vOpt = voucherRepository.findByMaVoucher(req.getVoucherCode().trim().toUpperCase());
            if (vOpt.isPresent()) {
                Voucher v = vOpt.get();
                if (v.isDangHoatDong() && (v.getNgayHetHan() == null || !v.getNgayHetHan().isBefore(java.time.LocalDate.now()))) {
                    appliedVoucher = v;
                    if (appliedVoucher.getPhanTramGiam() != null) {
                        discount = subtotal.multiply(BigDecimal.valueOf(appliedVoucher.getPhanTramGiam())).divide(BigDecimal.valueOf(100));
                    }
                    if (appliedVoucher.getGiamToiDa() != null && discount.compareTo(appliedVoucher.getGiamToiDa()) > 0) {
                        discount = appliedVoucher.getGiamToiDa();
                    }
                }
            }
        }

        BigDecimal shippingFee = (req.getShippingFee() != null) ? req.getShippingFee() : BigDecimal.ZERO;
        String donViVanChuyen = "Giao hàng tiêu chuẩn AutoHub Logistics";

        if (req.getShippingMethodId() != null && !req.getShippingMethodId().isBlank()) {
            String methodKey = req.getShippingMethodId().trim().toUpperCase().replace('-', '_');
            Optional<PhuongThucVanChuyen> ptOpt = phuongThucVanChuyenRepository.findByMaPhuongThucIgnoreCase(methodKey);
            if (ptOpt.isPresent()) {
                PhuongThucVanChuyen pt = ptOpt.get();
                donViVanChuyen = pt.getTenPhuongThuc();
                if (pt.getDieuKienMienPhi() != null && subtotal.compareTo(pt.getDieuKienMienPhi()) >= 0) {
                    shippingFee = BigDecimal.ZERO;
                } else if (pt.getChiPhi() != null) {
                    shippingFee = pt.getChiPhi();
                }
            }
        }

        BigDecimal grandTotal = subtotal.subtract(discount).add(shippingFee);
        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) {
            grandTotal = BigDecimal.ZERO;
        }

        PhuongThucThanhToan pttt = PhuongThucThanhToan.COD;
        if ("SEPAY".equalsIgnoreCase(req.getPaymentMethod()) || "BANK_TRANSFER".equalsIgnoreCase(req.getPaymentMethod()) || "ONLINE".equalsIgnoreCase(req.getPaymentMethod())) {
            pttt = PhuongThucThanhToan.SEPAY;
        } else if ("VNPAY".equalsIgnoreCase(req.getPaymentMethod())) {
            pttt = PhuongThucThanhToan.VNPAY;
        }
        boolean isOnlinePayment = pttt == PhuongThucThanhToan.SEPAY;

        String generatedOrderCode = "AH-ACC-2026-" + (1000 + (int)(Math.random() * 9000));
        DonHangPhuKien order = DonHangPhuKien.builder()
                .maDonHang(generatedOrderCode)
                .nguoiDung(customer)
                .voucher(appliedVoucher)
                .hoTenNguoiNhan(req.getRecipientName() != null ? req.getRecipientName() : "Khách hàng AutoHub")
                .soDienThoaiNhan(req.getPhone() != null ? req.getPhone() : "0912345678")
                .diaChiGiaoHang(req.getShippingAddress() != null ? req.getShippingAddress() : "TP. Hồ Chí Minh")
                .ghiChuKhachHang(req.getCustomerNote())
                .ngayDat(LocalDateTime.now())
                .phuongThucThanhToan(pttt)
                .phiVanChuyen(shippingFee)
                .donViVanChuyen(donViVanChuyen)
                .soTienGiamVoucher(discount)
                .tongTien(grandTotal)
                .trangThai(isOnlinePayment ? TrangThaiDonHang.PENDING_PAYMENT : TrangThaiDonHang.PENDING)
                .hanThanhToan(isOnlinePayment ? LocalDateTime.now().plusMinutes(15) : null)
                .build();

        DonHangPhuKien savedOrder = donHangRepository.save(order);

        List<ChiTietDonHang> savedItems = new ArrayList<>();
        for (CheckoutItemDto item : req.getItems()) {
            PhuKien pk = phuKienRepository.findById(item.getAccessoryId()).orElse(null);
            if (pk != null) {
                int qty = item.getQuantity() != null && item.getQuantity() > 0 ? item.getQuantity() : 1;
                // Trừ tồn kho thực tế trong cơ sở dữ liệu
                int newStock = Math.max(0, (pk.getSoLuongTon() != null ? pk.getSoLuongTon() : 0) - qty);
                pk.setSoLuongTon(newStock);
                phuKienRepository.save(pk);

                ChiTietDonHang ctdh = ChiTietDonHang.builder()
                        .donHang(savedOrder)
                        .phuKien(pk)
                        .soLuong(qty)
                        .donGia(item.getUnitPrice() != null ? item.getUnitPrice() : pk.getGiaBan())
                        .build();
                savedItems.add(chiTietDonHangRepository.save(ctdh));
            }
        }

        // Làm trống giỏ hàng của người dùng dưới database sau khi đặt hàng thành công
        try {
            Optional<GioHang> cartOpt = gioHangRepository.findByNguoiDungId(customer.getId());
            if (cartOpt.isPresent()) {
                List<ChiTietGioHang> existingCartItems = chiTietGioHangRepository.findByGioHangId(cartOpt.get().getId());
                if (!existingCartItems.isEmpty()) {
                    chiTietGioHangRepository.deleteAll(existingCartItems);
                }
            }
        } catch (Exception ignored) {}

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("order", mapOrderToDto(savedOrder, savedItems));
        responseData.put("orderId", savedOrder.getId());
        responseData.put("maDonHang", savedOrder.getMaDonHang());
        responseData.put("orderCode", savedOrder.getMaDonHang());
        responseData.put("subtotal", subtotal);
        responseData.put("discount", discount);
        responseData.put("shippingFee", shippingFee);
        responseData.put("grandTotal", grandTotal);
        responseData.put("totalPayable", grandTotal);

        if (isOnlinePayment) {
            String accNum = sepayAccountNumber != null ? sepayAccountNumber : "5811676579";
            String bankBrand = sepayBankBrandName != null ? sepayBankBrandName : "BIDV";
            Map<String, Object> sepayInfo = new HashMap<>();
            sepayInfo.put("accountNumber", accNum);
            sepayInfo.put("bankBrandName", bankBrand);
            sepayInfo.put("accountName", "CONG TY TNHH AUTOHUB VIET NAM");
            sepayInfo.put("transferAmount", grandTotal);
            sepayInfo.put("transferContent", savedOrder.getMaDonHang());
            sepayInfo.put("qrUrl", "https://qr.sepay.vn/img?acc=" + accNum + "&bank=" + bankBrand + "&amount=" + grandTotal.longValue() + "&des=" + savedOrder.getMaDonHang());
            responseData.put("sepay", sepayInfo);
        }

        return ResponseEntity.ok(ApiResponse.ok(responseData, "Đặt hàng phụ kiện thành công!"));
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
                itemMap.put("quantity", it.getSoLuong() != null ? it.getSoLuong() : 1);
                itemMap.put("unitPrice", it.getDonGia() != null ? it.getDonGia() : BigDecimal.ZERO);
                BigDecimal lineTotal = (it.getDonGia() != null && it.getSoLuong() != null)
                        ? it.getDonGia().multiply(BigDecimal.valueOf(it.getSoLuong()))
                        : BigDecimal.ZERO;
                itemMap.put("totalPrice", lineTotal);

                PhuKien pk = it.getPhuKien();
                Map<String, Object> accMap = new HashMap<>();
                if (pk != null) {
                    itemMap.put("accessoryId", pk.getId());
                    accMap.put("id", pk.getId());
                    accMap.put("name", pk.getTenPhuKien() != null ? pk.getTenPhuKien() : "Phụ kiện AutoHub");
                    accMap.put("code", "PK-" + pk.getId());
                    accMap.put("sku", "PK-" + pk.getId());
                    accMap.put("price", pk.getGiaBan() != null ? pk.getGiaBan() : BigDecimal.ZERO);
                    accMap.put("imageUrl", pk.getHinhAnh() != null ? pk.getHinhAnh() : "");
                    accMap.put("thumbnailUrl", pk.getHinhAnh() != null ? pk.getHinhAnh() : "");
                    accMap.put("images", pk.getHinhAnh() != null ? List.of(pk.getHinhAnh()) : Collections.emptyList());
                    String catName = pk.getDanhMucPhuKien() != null ? pk.getDanhMucPhuKien().getTenDanhMuc() : "Linh Kiện EV";
                    accMap.put("category", catName);
                    accMap.put("categoryName", catName);
                } else {
                    itemMap.put("accessoryId", 0L);
                    accMap.put("id", 0L);
                    accMap.put("name", "Phụ kiện AutoHub");
                    accMap.put("categoryName", "Linh Kiện EV");
                    accMap.put("price", BigDecimal.ZERO);
                    accMap.put("images", Collections.emptyList());
                }
                itemMap.put("accessory", accMap);
                mappedItems.add(itemMap);
            }
        }
        map.put("orderItems", mappedItems);
        map.put("items", mappedItems);
        return map;
    }
}
