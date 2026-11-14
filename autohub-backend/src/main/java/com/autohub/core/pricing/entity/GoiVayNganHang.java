package com.autohub.core.pricing.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "goi_vay_ngan_hang")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoiVayNganHang extends BaseEntity {

    @Column(name = "ten_ngan_hang", nullable = false, length = 100)
    private String tenNganHang;

    @Column(name = "ma_ngan_hang", length = 30)
    private String maNganHang;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(name = "lai_suat_nam_dau")
    private Double laiSuatNamDau;

    @Column(name = "lai_suat_tha_noi")
    private Double laiSuatThaNoi;

    @Column(name = "ky_han_vay_toi_da_nam")
    private Integer kyHanVayToiDaNam;

    @Column(name = "han_muc_vay_toi_da_phan_tram")
    private Integer hanMucVayToiDaPhanTram;

    @Column(name = "ghi_chu", length = 255)
    private String ghiChu;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;
}
