package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
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

    @Column(name = "ten_showroom", nullable = false, length = 150)
    private String tenShowroom;

    @Column(name = "dia_chi", nullable = false, length = 255)
    private String diaChi;

    @Column(name = "so_dien_thoai", length = 20)
    private String soDienThoai;

    @Column(name = "gio_mo_cua")
    private LocalTime gioMoCua;

    @Column(name = "gio_dong_cua")
    private LocalTime gioDongCua;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;
}
