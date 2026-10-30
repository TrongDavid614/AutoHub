package com.autohub.core.accessory.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.enums.PhuongThucThanhToan;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.core.pricing.entity.Voucher;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "don_hang_phu_kien")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonHangPhuKien extends BaseEntity {

    @Column(name = "ma_don_hang", nullable = false, unique = true, length = 50)
    private String maDonHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_dung", nullable = false)
    private NguoiDung nguoiDung;

    @Column(name = "ngay_dat")
    @Builder.Default
    private LocalDateTime ngayDat = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc_thanh_toan", nullable = false, length = 20)
    private PhuongThucThanhToan phuongThucThanhToan;

    @Column(name = "dia_chi_giao_hang", nullable = false, length = 255)
    private String diaChiGiaoHang;

    @Column(name = "phi_van_chuyen", precision = 18, scale = 2)
    private BigDecimal phiVanChuyen;

    @Column(name = "so_tien_giam_voucher", precision = 18, scale = 2)
    private BigDecimal soTienGiamVoucher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_voucher")
    private Voucher voucher;

    @Column(name = "don_vi_van_chuyen", length = 100)
    private String donViVanChuyen; // GHN Express...

    @Column(name = "ma_van_don", length = 50)
    private String maVanDon;

    @Column(name = "ngay_giao_hang")
    private LocalDateTime ngayGiaoHang;

    @Column(name = "tong_tien", nullable = false, precision = 18, scale = 2)
    private BigDecimal tongTien;

    @Column(name = "han_thanh_toan")
    private LocalDateTime hanThanhToan; // ngayDat + 15 phút (SePay)

    @Column(name = "thoi_gian_thanh_toan")
    private LocalDateTime thoiGianThanhToan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 30)
    @Builder.Default
    private TrangThaiDonHang trangThai = TrangThaiDonHang.PENDING;
}
