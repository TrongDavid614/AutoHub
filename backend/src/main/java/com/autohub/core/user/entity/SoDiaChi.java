package com.autohub.core.user.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "so_dia_chi")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SoDiaChi extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_dung", nullable = false)
    private NguoiDung nguoiDung;

    @Column(name = "ho_ten_nguoi_nhan", nullable = false, length = 100)
    private String hoTenNguoiNhan;

    @Column(name = "so_dien_thoai", nullable = false, length = 15)
    private String soDienThoai;

    @Column(name = "tinh_thanh", nullable = false, length = 100)
    private String tinhThanh;

    @Column(name = "quan_huyen", nullable = false, length = 100)
    private String quanHuyen;

    @Column(name = "phuong_xa", nullable = false, length = 100)
    private String phuongXa;

    @Column(name = "dia_chi_chi_tiet", nullable = false, length = 255)
    private String diaChiChiTiet;

    @Column(name = "mac_dinh")
    @Builder.Default
    private boolean macDinh = false; // Tối đa 1 địa chỉ mặc định (DR06)
}
