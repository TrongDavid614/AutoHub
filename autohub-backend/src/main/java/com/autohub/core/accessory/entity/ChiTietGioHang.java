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
    private Integer soLuong;

    @Column(name = "don_gia_tam_tinh", nullable = false, precision = 18, scale = 0)
    private BigDecimal donGiaTamTinh;
}
