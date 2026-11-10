package com.autohub.core.accessory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_gio_hang")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietGioHang implements Serializable {

    @EmbeddedId
    private ChiTietGioHangId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("gioHangId")
    @JoinColumn(name = "gio_hang_id", nullable = false)
    private GioHang gioHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("phuKienId")
    @JoinColumn(name = "phu_kien_id", nullable = false)
    private PhuKien phuKien;

    @Column(name = "so_luong", nullable = false)
    @Builder.Default
    private Integer soLuong = 1;

    @Column(name = "don_gia_tam_tinh", precision = 18, scale = 2)
    private BigDecimal donGiaTamTinh;
}
