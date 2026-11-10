package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bien_ban_ban_giao_ca")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BienBanBanGiaoCa extends BaseEntity {

    @Column(name = "ma_ban_giao", nullable = false, unique = true, length = 50)
    private String maBanGiao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_ban_giao_id", nullable = false)
    private NguoiDung nguoiBanGiao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_nhan_ca_id", nullable = false)
    private NguoiDung nguoiNhanCa;

    @Column(name = "thoi_gian_ban_giao")
    @Builder.Default
    private LocalDateTime thoiGianBanGiao = LocalDateTime.now();

    @Column(name = "ca_ban_giao", nullable = false, length = 30)
    private String caBanGiao;

    @Column(name = "tien_mat_dau_ca", nullable = false, precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal tienMatDauCa = BigDecimal.ZERO;

    @Column(name = "tien_mat_cuoi_ca", nullable = false, precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal tienMatCuoiCa = BigDecimal.ZERO;

    @Column(name = "so_hop_dong_phat_sinh", nullable = false)
    @Builder.Default
    private Integer soHopDongPhatSinh = 0;

    @Column(name = "ghi_chu_cong_viec", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChuCongViec;

    @Column(name = "chu_ky_nguoi_giao", length = 500)
    private String chuKyNguoiGiao;

    @Column(name = "chu_ky_nguoi_nhan", length = 500)
    private String chuKyNguoiNhan;
}
