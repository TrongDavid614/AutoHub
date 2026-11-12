package com.autohub.core.accessory.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_don_hang", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"don_hang_id", "phu_kien_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietDonHang extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_hang_id", nullable = false)
    private DonHangPhuKien donHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_kien_id", nullable = false)
    private PhuKien phuKien;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "don_gia", nullable = false, precision = 18, scale = 0)
    private BigDecimal donGia; // Chốt tại thời điểm đặt (BR07)

    @Column(name = "thanh_tien", insertable = false, updatable = false)
    private BigDecimal thanhTien;
}
