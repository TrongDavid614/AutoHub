package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phieu_dieu_chuyen_kho")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhieuDieuChuyenKho extends BaseEntity {

    @Column(name = "ma_phieu_chuyen", nullable = false, unique = true, length = 50)
    private String maPhieuChuyen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_xuat_id", nullable = false)
    private Showroom showroomXuat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_nhap_id", nullable = false)
    private Showroom showroomNhap;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "xe_dinh_danh_id", nullable = false)
    private XeDinhDanh xeDinhDanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_tao_id", nullable = false)
    private NguoiDung nguoiTao;

    @Column(name = "ngay_tao")
    @Builder.Default
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "ngay_hoan_tat")
    private LocalDateTime ngayHoanTat;

    @Column(name = "trang_thai", nullable = false, length = 30)
    @Builder.Default
    private String trangThai = "DANG_VAN_CHUYEN";

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;
}
