package com.autohub.core.ai.tools;

import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.ChiTietGioHang;
import com.autohub.core.accessory.entity.ChiTietGioHangId;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.entity.GioHang;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.ChiTietGioHangRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.accessory.repository.GioHangRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.enums.PhuongThucThanhToan;
import com.autohub.core.enums.TrangThaiDonHang;
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
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccessoryOrderTool {

    private final PhuKienRepository phuKienRepository;
    private final GioHangRepository gioHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final DonHangPhuKienRepository donHangPhuKienRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final NguoiDungRepository nguoiDungRepository;

    private static final NumberFormat VND_FORMAT = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartActionResult {
        private boolean success;
        private String message;
        private String tenPhuKien;
        private Integer soLuong;
        private String donGia;
        private String tongTienTamTinh;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderActionResult {
        private boolean success;
        private String maDonHang;
        private String message;
        private String tenNguoiNhan;
        private String soDienThoai;
        private String diaChiGiao;
        private String tenPhuKien;
        private Integer soLuong;
        private String tongTien;
        private String phuongThucThanhToan;
        private String trangThai;
    }

    /**
     * 1. TOOL THÊM PHỤ KIỆN VÀO GIỎ HÀNG
     */
    @Tool(description = "Thêm linh kiện hoặc phụ kiện ô tô vào giỏ hàng mua sắm của khách hàng trong bảng dbo.gio_hang và dbo.chi_tiet_gio_hang")
    @Transactional
    public CartActionResult addAccessoryToCart(
            @ToolParam(description = "Tên hoặc từ khóa phụ kiện cần thêm vào giỏ (ví dụ: sạc tại nhà 7.4kW, thảm sàn, camera hành trình...)") String accessoryKeyword,
            @ToolParam(description = "Số lượng muốn mua (mặc định là 1 nếu khách không chỉ rõ)") Integer quantity,
            @ToolParam(description = "Số điện thoại hoặc email của khách hàng để nhận diện giỏ hàng") String userIdentifier) {
        log.info("[Spring AI Tool] addAccessoryToCart: item={}, qty={}, user={}", accessoryKeyword, quantity,
                userIdentifier);

        try {
            int qty = (quantity == null || quantity <= 0) ? 1 : quantity;

            // 1. Tìm phụ kiện trong kho
            PhuKien item = findMatchingAccessory(accessoryKeyword);
            if (item == null) {
                return CartActionResult.builder()
                        .success(false)
                        .message("Không tìm thấy phụ kiện phù hợp với từ khóa: " + accessoryKeyword)
                        .build();
            }

            // 2. Tìm người dùng sở hữu giỏ hàng
            NguoiDung user = resolveUser(userIdentifier);

            // 3. Lấy hoặc khởi tạo giỏ hàng cho người dùng
            GioHang cart = gioHangRepository.findByNguoiDungId(user.getId())
                    .orElseGet(() -> gioHangRepository.save(GioHang.builder()
                            .nguoiDung(user)
                            .ngayCapNhat(LocalDateTime.now())
                            .build()));

            // 4. Kiểm tra xem phụ kiện đã có trong giỏ chưa, nếu có thì cộng dồn số lượng
            ChiTietGioHangId itemKey = new ChiTietGioHangId(cart.getId(), item.getId());
            ChiTietGioHang cartItem = chiTietGioHangRepository.findById(itemKey)
                    .orElse(ChiTietGioHang.builder()
                            .id(itemKey)
                            .gioHang(cart)
                            .phuKien(item)
                            .soLuong(0)
                            .donGiaTamTinh(item.getGiaBan())
                            .build());

            cartItem.setSoLuong(cartItem.getSoLuong() + qty);
            cartItem.setDonGiaTamTinh(item.getGiaBan());
            chiTietGioHangRepository.save(cartItem);

            cart.setNgayCapNhat(LocalDateTime.now());
            gioHangRepository.save(cart);

            BigDecimal subTotal = item.getGiaBan().multiply(BigDecimal.valueOf(cartItem.getSoLuong()));

            return CartActionResult.builder()
                    .success(true)
                    .message("Đã thêm thành công sản phẩm vào giỏ hàng của bạn!")
                    .tenPhuKien(item.getTenPhuKien())
                    .soLuong(cartItem.getSoLuong())
                    .donGia(VND_FORMAT.format(item.getGiaBan()))
                    .tongTienTamTinh(VND_FORMAT.format(subTotal))
                    .build();

        } catch (Exception ex) {
            log.error("[Spring AI Tool] Lỗi thêm vào giỏ hàng: {}", ex.getMessage(), ex);
            return CartActionResult.builder()
                    .success(false)
                    .message("Lỗi hệ thống khi thêm vào giỏ hàng: " + ex.getMessage())
                    .build();
        }
    }

    /**
     * 2. TOOL TỰ ĐỘNG CHỐT ĐƠN ĐẶT HÀNG PHỤ KIỆN TRỰC TIẾP
     */
    @Tool(description = "Tự động tạo đơn đặt hàng linh kiện/phụ kiện chính hãng cho khách hàng và lưu vào bảng dbo.don_hang_phu_kien và dbo.chi_tiet_don_hang")
    @Transactional
    public OrderActionResult createAccessoryOrder(
            @ToolParam(description = "Tên hoặc từ khóa phụ kiện khách muốn đặt (ví dụ: sạc treo tường, thảm cốp, sạc di động...)") String accessoryKeyword,
            @ToolParam(description = "Số lượng đặt (mặc định là 1)") Integer quantity,
            @ToolParam(description = "Họ và tên người nhận hàng") String recipientName,
            @ToolParam(description = "Số điện thoại người nhận hàng (10 chữ số)") String phoneNumber,
            @ToolParam(description = "Địa chỉ chi tiết nhận hàng (số nhà, đường, quận/huyện, tỉnh/thành)") String deliveryAddress,
            @ToolParam(description = "Phương thức thanh toán: 'COD' (Thanh toán khi nhận) hoặc 'VNPAY'") String paymentMethod,
            @ToolParam(description = "Ghi chú giao hàng nếu có") String note) {
        log.info("[Spring AI Tool] createAccessoryOrder: item={}, qty={}, recipient={}, phone={}",
                accessoryKeyword, quantity, recipientName, phoneNumber);

        try {
            int qty = (quantity == null || quantity <= 0) ? 1 : quantity;

            // 1. Tìm phụ kiện
            PhuKien item = findMatchingAccessory(accessoryKeyword);
            if (item == null) {
                return OrderActionResult.builder()
                        .success(false)
                        .message("Không tìm thấy phụ kiện phù hợp: " + accessoryKeyword)
                        .build();
            }

            // 2. Tìm người dùng
            NguoiDung user = resolveUser(phoneNumber);

            // 3. Tính toán tổng tiền
            BigDecimal unitPrice = item.getGiaBan() != null ? item.getGiaBan() : BigDecimal.ZERO;
            BigDecimal shippingFee = BigDecimal.valueOf(30000); // 30.000 VNĐ phí vận chuyển chuẩn
            BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(qty)).add(shippingFee);

            // 4. Xác định phương thức thanh toán
            PhuongThucThanhToan method = PhuongThucThanhToan.COD;
            if (paymentMethod != null && paymentMethod.toUpperCase().contains("VNPAY")) {
                method = PhuongThucThanhToan.VNPAY;
            }

            // 5. Tạo mã đơn hàng duy nhất: ví dụ ACC-1732001122
            String orderCode = "ACC-" + (System.currentTimeMillis() % 1000000000L);

            // 6. Lưu đơn hàng chính
            DonHangPhuKien order = DonHangPhuKien.builder()
                    .maDonHang(orderCode)
                    .nguoiDung(user)
                    .hoTenNguoiNhan(recipientName != null ? recipientName : user.getHoTen())
                    .soDienThoaiNhan(phoneNumber != null ? phoneNumber : user.getSoDienThoai())
                    .diaChiGiaoHang(deliveryAddress != null ? deliveryAddress : "Nhận tại Showroom AutoHub gần nhất")
                    .ghiChuKhachHang(note != null ? note : "Đặt hàng nhanh qua Trợ lý AI AutoHub")
                    .phuongThucThanhToan(method)
                    .phiVanChuyen(shippingFee)
                    .soTienGiamVoucher(BigDecimal.ZERO)
                    .trangThai(TrangThaiDonHang.PENDING)
                    .ngayDat(LocalDateTime.now())
                    .build();

            DonHangPhuKien savedOrder = donHangPhuKienRepository.save(order);

            // 7. Lưu chi tiết đơn hàng
            ChiTietDonHang orderDetail = ChiTietDonHang.builder()
                    .donHang(savedOrder)
                    .phuKien(item)
                    .soLuong(qty)
                    .donGia(unitPrice)
                    .build();
            chiTietDonHangRepository.save(orderDetail);

            log.info("[Spring AI Tool] Chốt đơn hàng thành công! Mã đơn: {}", orderCode);

            return OrderActionResult.builder()
                    .success(true)
                    .maDonHang(orderCode)
                    .message("Đặt hàng thành công! Đơn hàng phụ kiện chính hãng đã được chuyển tới trung tâm xử lý.")
                    .tenNguoiNhan(order.getHoTenNguoiNhan())
                    .soDienThoai(order.getSoDienThoaiNhan())
                    .diaChiGiao(order.getDiaChiGiaoHang())
                    .tenPhuKien(item.getTenPhuKien())
                    .soLuong(qty)
                    .tongTien(VND_FORMAT.format(totalAmount) + " (Đã bao gồm 30.000đ phí giao hàng tiêu chuẩn)")
                    .phuongThucThanhToan(method.name().equals("COD") ? "Thanh toán tiền mặt khi nhận hàng (COD)"
                            : "Chuyển khoản VNPay")
                    .trangThai("PENDING (Chờ đóng gói & xuất kho)")
                    .build();

        } catch (Exception ex) {
            log.error("[Spring AI Tool] Lỗi tạo đơn đặt hàng: {}", ex.getMessage(), ex);
            return OrderActionResult.builder()
                    .success(false)
                    .message("Không thể khởi tạo đơn hàng: " + ex.getMessage())
                    .build();
        }
    }

    // --- HÀM TRỢ GIÚP (HELPER METHODS) ---

    private PhuKien findMatchingAccessory(String keyword) {
        List<PhuKien> accessories = phuKienRepository.findAll();
        String kw = keyword != null ? keyword.trim().toLowerCase() : "";
        return accessories.stream()
                .filter(PhuKien::isDangHoatDong)
                .filter(a -> {
                    if (kw.isEmpty())
                        return true;
                    boolean matchName = a.getTenPhuKien() != null && a.getTenPhuKien().toLowerCase().contains(kw);
                    boolean matchBrand = a.getThuongHieu() != null && a.getThuongHieu().toLowerCase().contains(kw);
                    boolean matchDesc = a.getQuyCachLapDat() != null && a.getQuyCachLapDat().toLowerCase().contains(kw);
                    return matchName || matchBrand || matchDesc;
                })
                .findFirst()
                .orElse(accessories.isEmpty() ? null : accessories.get(0));
    }

    private NguoiDung resolveUser(String identifier) {
        if (identifier != null && !identifier.isBlank()) {
            return nguoiDungRepository.findBySoDienThoai(identifier.trim())
                    .or(() -> nguoiDungRepository.findByEmail(identifier.trim()))
                    .orElseGet(() -> nguoiDungRepository.findAll().stream().filter(u -> !u.isDeleted()).findFirst()
                            .orElse(null));
        }
        return nguoiDungRepository.findAll().stream().filter(u -> !u.isDeleted()).findFirst().orElse(null);
    }
}