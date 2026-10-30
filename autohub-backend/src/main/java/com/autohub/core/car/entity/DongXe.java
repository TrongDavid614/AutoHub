package com.autohub.core.car.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dong_xe")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DongXe extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_hang_xe", nullable = false)
    private HangXe hangXe;

    @Column(name = "ten_dong_xe", nullable = false, length = 100)
    private String tenDongXe;

    @Column(name = "phan_khuc", length = 50)
    private String phanKhuc; // Sedan, SUV, Bán tải, Thương mại

    @Column(name = "xuat_xu", length = 50)
    private String xuatXu; // Nhập khẩu hoặc Lắp ráp

    @Column(name = "mo_ta", columnDefinition = "NVARCHAR(MAX)")
    private String moTa;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;
}
