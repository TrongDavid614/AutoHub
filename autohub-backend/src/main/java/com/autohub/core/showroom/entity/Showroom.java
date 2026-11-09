package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.pricing.entity.TinhThanh;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "showroom")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Showroom extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tinh_thanh_id", nullable = false)
    private TinhThanh tinhThanh;

    @Column(name = "ten_showroom", nullable = false, length = 150)
    private String tenShowroom;

    @Column(name = "dia_chi", nullable = false, length = 255)
    private String diaChi;

    @Column(name = "so_dien_thoai", nullable = false, length = 15)
    private String soDienThoai;

    @Column(name = "gio_mo_cua", nullable = false)
    private LocalTime gioMoCua;

    @Column(name = "gio_dong_cua", nullable = false)
    private LocalTime gioDongCua;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;
}
