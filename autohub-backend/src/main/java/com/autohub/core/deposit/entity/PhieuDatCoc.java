package com.autohub.core.deposit.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.showroom.entity.TonKhoXe;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "phieu_dat_coc")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhieuDatCoc extends BaseEntity {

    @Column(name = "ma_phieu_coc", nullable = false, unique = true, length = 50)
    private String maPhieuCoc; // #DEP-GTE-2026-8812

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_dung", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_ton_kho", nullable = false)
    private TonKhoXe tonKhoXe;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "so_khung_vin")
    private XeDinhDanh xeDinhDanh; // Gán VIN sau khi đối soát (DR12)

    @Column(name = "so_cccd", nullable = false, length = 20)
    private String soCCCD; // Sao chụp 12 chữ số khi cọc (DR02)

    @Column(name = "so_tien_coc", nullable = false, precision = 18, scale = 2)
    private BigDecimal soTienCoc;

    @Column(name = "ngay_dat_coc")
    @Builder.Default
    private LocalDateTime ngayDatCoc = LocalDateTime.now();

    @Column(name = "han_thanh_toan")
    private LocalDateTime hanThanhToan; // ngayDatCoc + 15 phút (DR11)

    @Column(name = "thoi_gian_thanh_toan")
    private LocalDateTime thoiGianThanhToan; // Khi SePay báo Webhook

    @Column(name = "han_giu_xe")
    private LocalDateTime hanGiuXe; // thoiGianThanhToan + 72 giờ

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 30)
    @Builder.Default
    private TrangThaiPhieuCoc trangThai = TrangThaiPhieuCoc.PENDING_PAYMENT;

    @Column(name = "thoi_gian_hoan_tat")
    private LocalDateTime thoiGianHoanTat; // Ký hợp đồng mua bán
}
