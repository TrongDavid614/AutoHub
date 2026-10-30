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
    @JoinColumn(name = "ma_tinh", nullable = false)
    private TinhThanh tinhThanh;

    @Column(name = "ty_le_phi_truoc_ba")
    private Double tyLePhiTruocBa; // 10% hoặc 12%

    @Column(name = "phi_cap_bien_so", precision = 18, scale = 2)
    private BigDecimal phiCapBienSo;

    @Column(name = "phi_dang_kiem", precision = 18, scale = 2)
    private BigDecimal phiDangKiem;

    @Column(name = "phi_bao_tri_duong_bo", precision = 18, scale = 2)
    private BigDecimal phiBaoTriDuongBo;

    @Column(name = "phi_bao_hiem_tnds", precision = 18, scale = 2)
    private BigDecimal phiBaoHiemTNDS;

    @Column(name = "ngay_ap_dung")
    private LocalDate ngayApDung;

    @Column(name = "ngay_het_hieu_luc")
    private LocalDate ngayHetHieuLuc; // rỗng nếu đang hiệu lực (DR25)
}
