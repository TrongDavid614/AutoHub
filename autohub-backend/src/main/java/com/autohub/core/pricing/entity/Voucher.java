package com.autohub.core.pricing.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "voucher")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Voucher extends BaseEntity {

    @Column(name = "ma_voucher", nullable = false, unique = true, length = 30)
    private String maVoucher;

    @Column(name = "phan_tram_giam", nullable = false, precision = 5, scale = 2)
    private BigDecimal phanTramGiam;

    @Column(name = "giam_toi_da", nullable = false, precision = 18, scale = 0)
    private BigDecimal giamToiDa;

    @Column(name = "ngay_het_han", nullable = false)
    private LocalDate ngayHetHan;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private Boolean dangHoatDong = true;
}
