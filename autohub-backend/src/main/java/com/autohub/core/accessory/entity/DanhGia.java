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
    @JoinColumn(name = "ma_nguoi_dung", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phu_kien", nullable = false)
    private PhuKien phuKien;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_chi_tiet_don_hang", nullable = false, unique = true)
    private ChiTietDonHang chiTietDonHang; // Mỗi dòng chi tiết đơn đánh giá tối đa 1 lần (DR33)

    @Column(name = "so_sao", nullable = false)
    private Integer soSao; // 1 đến 5 sao

    @Column(name = "noi_dung", length = 1000)
    private String noiDung;

    @Column(name = "hinh_anh_danh_gia", length = 500)
    private String hinhAnhDanhGia;

    @Column(name = "ngay_danh_gia")
    @Builder.Default
    private LocalDateTime ngayDanhGia = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_duyet", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiDanhGia trangThaiDuyet = TrangThaiDanhGia.PENDING;
}
