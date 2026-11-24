package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phieu_dieu_chuyen_phu_kien")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhieuDieuChuyenPhuKien extends BaseEntity {

    @Column(name = "ma_phieu_chuyen", nullable = false, unique = true, length = 50)
    private String maPhieuChuyen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_kien_id", nullable = false)
    private PhuKien phuKien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_xuat_id", nullable = false)
    private Showroom showroomXuat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_nhap_id", nullable = false)
    private Showroom showroomNhap;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_tao_id", nullable = false)
    private NguoiDung nguoiTao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_xac_nhan_id")
    private NguoiDung nguoiXacNhan;

    @Column(name = "ly_do", length = 500)
    private String lyDo;

    @Column(name = "trang_thai", nullable = false, length = 30)
    @Builder.Default
    private String trangThai = "DANG_VAN_CHUYEN";

    @Column(name = "ngay_tao", nullable = false)
    @Builder.Default
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "ngay_hoan_tat")
    private LocalDateTime ngayHoanTat;
}
