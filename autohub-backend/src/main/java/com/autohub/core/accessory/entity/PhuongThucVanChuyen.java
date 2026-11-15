package com.autohub.core.accessory.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "phuong_thuc_van_chuyen")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhuongThucVanChuyen extends BaseEntity {

    @Column(name = "ma_phuong_thuc", nullable = false, unique = true, length = 50)
    private String maPhuongThuc;

    @Column(name = "ten_phuong_thuc", nullable = false, length = 150, columnDefinition = "NVARCHAR(150)")
    private String tenPhuongThuc;

    @Column(name = "mo_ta", length = 255, columnDefinition = "NVARCHAR(255)")
    private String moTa;

    @Column(name = "sub_mo_ta", length = 255, columnDefinition = "NVARCHAR(255)")
    private String subMoTa;

    @Column(name = "tag", length = 50, columnDefinition = "NVARCHAR(50)")
    private String tag;

    @Column(name = "thoi_gian_du_kien", nullable = false, length = 100, columnDefinition = "NVARCHAR(100)")
    private String thoiGianDuKien;

    @Column(name = "chi_phi", nullable = false, precision = 18, scale = 0, columnDefinition = "DECIMAL(18,0)")
    @Builder.Default
    private BigDecimal chiPhi = BigDecimal.ZERO;

    @Column(name = "dieu_kien_mien_phi", precision = 18, scale = 0, columnDefinition = "DECIMAL(18,0)")
    private BigDecimal dieuKienMienPhi;

    @Column(name = "thu_tu", nullable = false)
    @Builder.Default
    private Integer thuTu = 1;

    @Column(name = "dang_hoat_dong", nullable = false)
    @Builder.Default
    private boolean dangHoatDong = true;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;
}
