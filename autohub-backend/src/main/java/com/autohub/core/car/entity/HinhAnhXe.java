package com.autohub.core.car.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hinh_anh_xe")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HinhAnhXe extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phien_ban_id", nullable = false)
    private PhienBanXe phienBanXe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mau_sac_id")
    private MauSac mauSac;

    @Column(name = "duong_dan", nullable = false, length = 500)
    private String duongDan;

    @Column(name = "loai_anh", nullable = false, length = 20)
    private String loaiAnh; // NGOAI_THAT, NOI_THAT, XOAY_360

    @Column(name = "goc_quay")
    private Integer gocQuay;

    @Column(name = "thu_tu_hien_thi")
    @Builder.Default
    private Integer thuTuHienThi = 0;
}
