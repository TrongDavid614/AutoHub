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
    @JoinColumn(name = "ma_dong_xe", nullable = false)
    private DongXe dongXe;

    @Column(name = "ten_phien_ban", nullable = false, length = 150)
    private String tenPhienBan;

    @Column(name = "nam_san_xuat")
    private Integer namSanXuat;

    @Column(name = "hop_so", length = 50)
    private String hopSo;

    @Column(name = "loai_nhien_lieu", length = 50)
    private String loaiNhienLieu; // Thuần điện 800V SiC

    @Column(name = "so_cho_ngoi")
    private Integer soChoNgoi;

    @Column(name = "gia_niem_yet", nullable = false, precision = 18, scale = 2)
    private BigDecimal giaNiemYet;

    @Column(name = "muc_tien_coc", nullable = false, precision = 18, scale = 2)
    private BigDecimal mucTienCoc; // 10.000.000 hoặc 20.000.000 VNĐ (DR08)

    @Column(name = "thong_so_ky_thuat", columnDefinition = "NVARCHAR(MAX)")
    private String thongSoKyThuat; // JSON hoặc text thông số công suất, pin, LiDAR

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;
}
