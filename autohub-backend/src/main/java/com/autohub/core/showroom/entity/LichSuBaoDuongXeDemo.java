package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_bao_duong_xe_demo")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LichSuBaoDuongXeDemo extends BaseEntity {

    @Column(name = "ma_phieu_bao_duong", nullable = false, unique = true, length = 50)
    private String maPhieuBaoDuong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "xe_demo_id", nullable = false)
    private XeDemo xeDemo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_tao_id")
    private NguoiDung nguoiTao;

    @Column(name = "hang_muc_bao_duong", nullable = false, length = 500)
    private String hangMucBaoDuong;

    @Column(name = "so_odo_luc_bao_duong", nullable = false)
    @Builder.Default
    private Integer soOdoLucBaoDuong = 0;

    @Column(name = "ngay_bat_dau", nullable = false)
    @Builder.Default
    private LocalDate ngayBatDau = LocalDate.now();

    @Column(name = "ngay_du_kien_hoan_tat")
    private LocalDate ngayDuKienHoanTat;

    @Column(name = "ngay_hoan_tat_thuc_te")
    private LocalDate ngayHoanTatThucTe;

    @Column(name = "trang_thai", nullable = false, length = 30)
    @Builder.Default
    private String trangThai = "DANG_BAO_DUONG";

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;

    @Column(name = "ngay_tao", nullable = false)
    @Builder.Default
    private LocalDateTime ngayTao = LocalDateTime.now();
}
