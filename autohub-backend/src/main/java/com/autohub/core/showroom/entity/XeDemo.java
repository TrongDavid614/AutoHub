package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.enums.TrangThaiXeDemo;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "xe_demo")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class XeDemo extends BaseEntity {

    @Column(name = "bien_so", nullable = false, unique = true, length = 20)
    private String bienSo;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiXeDemo trangThai = TrangThaiXeDemo.SAN_SANG;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phien_ban_id", nullable = false)
    private PhienBanXe phienBanXe;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;
}
