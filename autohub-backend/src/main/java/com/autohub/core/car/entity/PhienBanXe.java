package com.autohub.core.car.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "phien_ban_xe")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhienBanXe extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dong_xe_id", nullable = false)
    private DongXe dongXe;

    @Column(name = "ten_phien_ban", nullable = false, length = 150)
    private String tenPhienBan;

    @Column(name = "nam_san_xuat", nullable = false)
    private Integer namSanXuat;

    @Column(name = "hop_so", nullable = false, length = 50)
    private String hopSo;

    @Column(name = "loai_nhien_lieu", nullable = false, length = 50)
    private String loaiNhienLieu;

    @Column(name = "so_cho_ngoi", nullable = false)
    private Integer soChoNgoi;

    @Column(name = "gia_niem_yet", nullable = false, precision = 18, scale = 0)
    private BigDecimal giaNiemYet;

    @Column(name = "muc_tien_coc", nullable = false, precision = 18, scale = 0)
    @Builder.Default
    private BigDecimal mucTienCoc = new BigDecimal("20000000");

    @Column(name = "tam_hoat_dong_km")
    private Integer tamHoatDongKm;

    @Column(name = "dung_luong_pin_kwh", precision = 6, scale = 2)
    private BigDecimal dungLuongPinKwh;

    @Column(name = "thong_so_ky_thuat", columnDefinition = "NVARCHAR(MAX)")
    private String thongSoKyThuat;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;
}
