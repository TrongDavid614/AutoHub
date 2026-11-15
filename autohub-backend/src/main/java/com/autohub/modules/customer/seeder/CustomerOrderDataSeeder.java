package com.autohub.modules.customer.seeder;

import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.enums.PhuongThucThanhToan;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@Order(3)
@RequiredArgsConstructor
public class CustomerOrderDataSeeder implements CommandLineRunner {

    private final DonHangPhuKienRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final PhuKienRepository phuKienRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (donHangRepository.count() >= 4) {
            log.info("[CustomerOrderDataSeeder] Đã có đủ dữ liệu đơn hàng ({}), bỏ qua seeder.", donHangRepository.count());
            return;
        }

        log.info("[CustomerOrderDataSeeder] Đang khởi tạo dữ liệu mẫu cho lịch sử đơn hàng khách hàng...");

        NguoiDung customer = nguoiDungRepository.findByEmail("customer.test@autohub.vn")
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));

        if (customer == null) {
            log.warn("[CustomerOrderDataSeeder] Không tìm thấy tài khoản khách hàng để gắn đơn mẫu.");
            return;
        }

        List<PhuKien> accessories = phuKienRepository.findAll();
        if (accessories.isEmpty()) {
            log.warn("[CustomerOrderDataSeeder] Danh sách phụ kiện trống, không thể tạo đơn mẫu.");
            return;
        }

        PhuKien pk1 = accessories.get(0);
        PhuKien pk2 = accessories.size() > 1 ? accessories.get(1) : pk1;
        PhuKien pk3 = accessories.size() > 2 ? accessories.get(2) : pk1;

        // 1. Đơn ĐÃ GIAO HÀNG (DELIVERED)
        createSampleOrder(
                "AH-ACC-2026-8801",
                customer,
                TrangThaiDonHang.DELIVERED,
                PhuongThucThanhToan.SEPAY,
                LocalDateTime.now().minusDays(5),
                LocalDateTime.now().minusDays(2),
                "GHN-VN-8849201",
                new BigDecimal("35000"),
                List.of(pk1, pk2)
        );

        // 2. Đơn ĐANG GIAO HÀNG (SHIPPING)
        createSampleOrder(
                "AH-ACC-2026-8802",
                customer,
                TrangThaiDonHang.SHIPPING,
                PhuongThucThanhToan.SEPAY,
                LocalDateTime.now().minusDays(2),
                null,
                "GHN-VN-8849202",
                new BigDecimal("45000"),
                List.of(pk2)
        );

        // 3. Đơn ĐANG XỬ LÝ (PROCESSING)
        createSampleOrder(
                "AH-ACC-2026-8803",
                customer,
                TrangThaiDonHang.PROCESSING,
                PhuongThucThanhToan.COD,
                LocalDateTime.now().minusDays(1),
                null,
                "AH-EXPRESS-8803",
                new BigDecimal("35000"),
                List.of(pk3)
        );

        // 4. Đơn CHỜ THANH TOÁN (PENDING_PAYMENT)
        createSampleOrder(
                "AH-ACC-2026-8804",
                customer,
                TrangThaiDonHang.PENDING_PAYMENT,
                PhuongThucThanhToan.SEPAY,
                LocalDateTime.now().minusMinutes(5),
                null,
                null,
                new BigDecimal("35000"),
                List.of(pk1)
        );

        log.info("[CustomerOrderDataSeeder] Khởi tạo thành công {} đơn hàng phụ kiện mẫu!", donHangRepository.count());
    }

    private void createSampleOrder(
            String code,
            NguoiDung customer,
            TrangThaiDonHang status,
            PhuongThucThanhToan paymentMethod,
            LocalDateTime orderDate,
            LocalDateTime deliveryDate,
            String trackingNumber,
            BigDecimal shippingFee,
            List<PhuKien> items
    ) {
        if (donHangRepository.findByMaDonHang(code).isPresent()) {
            return;
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (PhuKien pk : items) {
            BigDecimal price = pk.getGiaBan() != null ? pk.getGiaBan() : BigDecimal.ZERO;
            subtotal = subtotal.add(price);
        }
        BigDecimal grandTotal = subtotal.add(shippingFee);

        DonHangPhuKien order = DonHangPhuKien.builder()
                .maDonHang(code)
                .nguoiDung(customer)
                .hoTenNguoiNhan(customer.getHoTen() != null ? customer.getHoTen() : "Lê Hoàng Long")
                .soDienThoaiNhan(customer.getSoDienThoai() != null ? customer.getSoDienThoai() : "0911333444")
                .diaChiGiaoHang("72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP. Hồ Chí Minh")
                .ghiChuKhachHang("Giao hàng giờ hành chính, bọc chống sốc kỹ càng")
                .ngayDat(orderDate)
                .ngayGiaoHang(deliveryDate)
                .phuongThucThanhToan(paymentMethod)
                .phiVanChuyen(shippingFee)
                .soTienGiamVoucher(BigDecimal.ZERO)
                .tongTien(grandTotal)
                .trangThai(status)
                .maVanDon(trackingNumber)
                .hanThanhToan(status == TrangThaiDonHang.PENDING_PAYMENT ? orderDate.plusMinutes(15) : null)
                .build();

        DonHangPhuKien savedOrder = donHangRepository.save(order);

        for (PhuKien pk : items) {
            ChiTietDonHang ctdh = ChiTietDonHang.builder()
                    .donHang(savedOrder)
                    .phuKien(pk)
                    .soLuong(1)
                    .donGia(pk.getGiaBan() != null ? pk.getGiaBan() : BigDecimal.ZERO)
                    .build();
            chiTietDonHangRepository.save(ctdh);
        }
    }
}
