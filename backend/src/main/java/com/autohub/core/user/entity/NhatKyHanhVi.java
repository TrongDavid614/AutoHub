package com.autohub.core.user.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.enums.LoaiHanhViTracking;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "nhat_ky_hanh_vi")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NhatKyHanhVi extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_dung")
    private NguoiDung nguoiDung; // Có thể null với khách vãng lai

    @Column(name = "ma_phien", length = 100)
    private String maPhien; // UUID Session của trình duyệt

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_hanh_vi", nullable = false, length = 30)
    private LoaiHanhViTracking loaiHanhVi;

    @Column(name = "loai_thuc_the", length = 20)
    private String loaiThucThe; // CAR hoặc ACCESSORY

    @Column(name = "ma_thuc_the")
    private Long maThucThe; // ID xe hoặc phụ kiện

    @Column(name = "thoi_gian_dung_xem")
    @Builder.Default
    private Integer thoiGianDungXem = 0; // Dwell time (giây)

    @Column(name = "du_lieu_bo_sung", columnDefinition = "NVARCHAR(MAX)")
    private String duLieuBoSung; // JSON lưu 360, màu xe...

    @Column(name = "thoi_gian_tao")
    @Builder.Default
    private LocalDateTime thoiGianTao = LocalDateTime.now();
}
