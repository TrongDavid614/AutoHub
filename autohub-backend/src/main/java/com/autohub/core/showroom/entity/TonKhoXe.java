package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.MauSac;
import com.autohub.core.car.entity.PhienBanXe;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ton_kho_xe", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"ma_phien_ban", "ma_mau", "ma_showroom"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TonKhoXe extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phien_ban", nullable = false)
    private PhienBanXe phienBanXe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_mau", nullable = false)
    private MauSac mauSac;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_showroom", nullable = false)
    private Showroom showroom;

    @Column(name = "so_luong_kha_dung", nullable = false)
    @Builder.Default
    private Integer soLuongKhaDung = 0; // CHECK (soLuongKhaDung >= 0)

    @Column(name = "so_luong_dang_giu_cho", nullable = false)
    @Builder.Default
    private Integer soLuongDangGiuCho = 0; // Đang giữ tạm 15p hoặc giữ cọc 72h
}
