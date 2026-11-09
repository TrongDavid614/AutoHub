package com.autohub.core.pricing.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.enums.LoaiUuDai;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "chuong_trinh_khuyen_mai")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChuongTrinhKhuyenMai extends BaseEntity {

    @Column(name = "ten_chuong_trinh", nullable = false, length = 200)
    private String tenChuongTrinh;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_uu_dai", nullable = false, length = 30)
    private LoaiUuDai loaiUuDai;

    @Column(name = "gia_tri", nullable = false, precision = 18, scale = 2)
    private BigDecimal giaTri;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDate ngayKetThuc;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;

    @ManyToMany
    @JoinTable(
        name = "khuyen_mai_phien_ban",
        joinColumns = @JoinColumn(name = "chuong_trinh_id"),
        inverseJoinColumns = @JoinColumn(name = "phien_ban_id")
    )
    private List<PhienBanXe> phienBanXes;
}
