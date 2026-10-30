package com.autohub.core.payment.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.enums.PhuongThucThanhToan;
import com.autohub.core.enums.TrangThaiThanhToan;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "giao_dich_thanh_toan")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GiaoDichThanhToan extends BaseEntity {

    @Column(name = "ma_tham_chieu", nullable = false, unique = true, length = 100)
    private String maThamChieu; // Mã gửi SePay (sepay_reference_code)

    @Column(name = "ma_giao_dich_sepay", unique = true, length = 100)
    private String maGiaoDichSePay; // Mã SePay trả về (sepay_transaction_id)

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc", nullable = false, length = 20)
    private PhuongThucThanhToan phuongThuc;

    @Column(name = "so_tien", nullable = false, precision = 18, scale = 2)
    private BigDecimal soTien;

    @Column(name = "thoi_gian_khoi_tao")
    @Builder.Default
    private LocalDateTime thoiGianKhoiTao = LocalDateTime.now();

    @Column(name = "thoi_gian_thanh_toan")
    private LocalDateTime thoiGianThanhToan;

    @Column(name = "ma_ket_qua", length = 50)
    private String maKetQua; // sepay_status

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiThanhToan trangThai = TrangThaiThanhToan.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phieu_coc")
    private PhieuDatCoc phieuDatCoc; // Hoặc phiếu cọc

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_hang")
    private DonHangPhuKien donHangPhuKien; // Hoặc đơn hàng (DR35)
}
