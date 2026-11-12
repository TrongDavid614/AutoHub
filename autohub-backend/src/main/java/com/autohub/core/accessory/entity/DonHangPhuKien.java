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

    @Column(name = "ma_don_hang", nullable = false, unique = true, length = 30)
    private String maDonHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @Column(name = "ho_ten_nguoi_nhan", nullable = false, length = 100)
    private String hoTenNguoiNhan;

    @Column(name = "so_dien_thoai_nhan", nullable = false, length = 15)
    private String soDienThoaiNhan;

    @Column(name = "dia_chi_giao_hang", nullable = false, length = 500)
    private String diaChiGiaoHang;

    @Column(name = "ghi_chu_khach_hang", length = 500)
    private String ghiChuKhachHang;

    @Column(name = "ngay_dat")
    @Builder.Default
    private LocalDateTime ngayDat = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc_thanh_toan", nullable = false, length = 10)
    private PhuongThucThanhToan phuongThucThanhToan;

    @Column(name = "phi_van_chuyen", nullable = false, precision = 18, scale = 0)
    @Builder.Default
    private BigDecimal phiVanChuyen = BigDecimal.ZERO;

    @Column(name = "so_tien_giam_voucher", nullable = false, precision = 18, scale = 0)
    @Builder.Default
    private BigDecimal soTienGiamVoucher = BigDecimal.ZERO;

    @Column(name = "don_vi_van_chuyen", length = 100)
    private String donViVanChuyen;

    @Column(name = "ma_van_don", length = 50)
    private String maVanDon;

    @Column(name = "ngay_giao_hang")
    private LocalDateTime ngayGiaoHang;

    @Column(name = "tong_tien", nullable = false, precision = 18, scale = 0)
    private BigDecimal tongTien;

    @Column(name = "han_thanh_toan")
    private LocalDateTime hanThanhToan;

    @Column(name = "thoi_gian_thanh_toan")
    private LocalDateTime thoiGianThanhToan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 30)
    @Builder.Default
    private TrangThaiDonHang trangThai = TrangThaiDonHang.PENDING;
}
