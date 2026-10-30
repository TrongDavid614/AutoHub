package com.autohub.core.accessory.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.DongXe;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "phu_kien")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhuKien extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_danh_muc", nullable = false)
    private DanhMucPhuKien danhMucPhuKien;

    @Column(name = "ten_phu_kien", nullable = false, length = 150)
    private String tenPhuKien;

    @Column(name = "thuong_hieu", length = 50)
    private String thuongHieu;

    @Column(name = "gia_ban", nullable = false, precision = 18, scale = 2)
    private BigDecimal giaBan;

    @Column(name = "so_luong_ton", nullable = false)
    @Builder.Default
    private Integer soLuongTon = 0; // CHECK (soLuongTon >= 0)

    @Column(name = "quy_cach_lap_dat", length = 255)
    private String quyCachLapDat;

    @Column(name = "hinh_anh", length = 500)
    private String hinhAnh;

    @Column(name = "dung_chung")
    @Builder.Default
    private boolean dungChung = false; // true nếu dùng chung cho mọi dòng xe (DR34)

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;

    @ManyToMany
    @JoinTable(
        name = "phu_kien_dong_xe_tuong_thich",
        joinColumns = @JoinColumn(name = "ma_phu_kien"),
        inverseJoinColumns = @JoinColumn(name = "ma_dong_xe")
    )
    private List<DongXe> dongXes;
}
