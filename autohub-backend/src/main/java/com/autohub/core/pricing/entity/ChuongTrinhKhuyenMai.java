package com.autohub.core.pricing.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.enums.LoaiUuDai;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "ten_chuong_trinh", nullable = false, length = 150)
    private String tenChuongTrinh;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_uu_dai", nullable = false, length = 30)
    private LoaiUuDai loaiUuDai;

    @Column(name = "gia_tri")
    private Double giaTri; // Số tiền hoặc % hỗ trợ lệ phí trước bạ

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;

    @ManyToMany
    @JoinTable(
        name = "khuyen_mai_phien_ban_xe",
        joinColumns = @JoinColumn(name = "ma_chuong_trinh"),
        inverseJoinColumns = @JoinColumn(name = "ma_phien_ban")
    )
    private List<PhienBanXe> phienBanXes;
}
