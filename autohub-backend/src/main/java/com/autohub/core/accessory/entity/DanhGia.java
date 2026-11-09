package com.autohub.core.accessory.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.enums.TrangThaiDanhGia;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "danh_gia")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DanhGia extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_kien_id", nullable = false)
    private PhuKien phuKien;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chi_tiet_don_hang_id", nullable = false, unique = true)
    private ChiTietDonHang chiTietDonHang;

    @Column(name = "so_sao", nullable = false)
    private Integer soSao;

    @Column(length = 2000)
    private String noiDung;

    @Column(name = "hinh_anh_danh_gia", columnDefinition = "NVARCHAR(MAX)")
    private String hinhAnhDanhGia;

    @Column(name = "ngay_danh_gia")
    @Builder.Default
    private LocalDateTime ngayDanhGia = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_duyet", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiDanhGia trangThaiDuyet = TrangThaiDanhGia.PENDING;
}
