package com.autohub.core.pricing.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bieu_phi_lan_banh")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BieuPhiLanBanh extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tinh_thanh_id", nullable = false)
    private TinhThanh tinhThanh;

    @Column(name = "ty_le_phi_truoc_ba", nullable = false, precision = 5, scale = 2)
    private BigDecimal tyLePhiTruocBa; // 10% hoặc 12%

    @Column(name = "phi_cap_bien_so", nullable = false, precision = 18, scale = 0)
    private BigDecimal phiCapBienSo;

    @Column(name = "phi_dang_kiem", nullable = false, precision = 18, scale = 0)
    private BigDecimal phiDangKiem;

    @Column(name = "phi_bao_tri_duong_bo", nullable = false, precision = 18, scale = 0)
    private BigDecimal phiBaoTriDuongBo;

    @Column(name = "phi_bao_hiem_tnds", nullable = false, precision = 18, scale = 0)
    private BigDecimal phiBaoHiemTnds;

    @Column(name = "ngay_ap_dung", nullable = false)
    private LocalDate ngayApDung;

    @Column(name = "ngay_het_hieu_luc")
    private LocalDate ngayHetHieuLuc;
}
