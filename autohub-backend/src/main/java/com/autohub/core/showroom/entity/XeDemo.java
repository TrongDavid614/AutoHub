package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.enums.TrangThaiXeDemo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "xe_demo")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class XeDemo extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phien_ban_id", nullable = false)
    private PhienBanXe phienBanXe;

    @Column(name = "bien_so", nullable = false, unique = true, length = 20)
    private String bienSo;

    @Column(name = "so_odo_hien_tai", nullable = false)
    @Builder.Default
    private Integer soOdoHienTai = 0;

    @Column(name = "ngay_bao_duong_gan_nhat")
    private LocalDate ngayBaoDuongGanNhat;

    @Column(name = "ngay_bao_duong_tiep_theo")
    private LocalDate ngayBaoDuongTiepTheo;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiXeDemo trangThai = TrangThaiXeDemo.SAN_SANG;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;
}
