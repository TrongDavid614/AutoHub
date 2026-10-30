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
    @JoinColumn(name = "ma_phien_ban", nullable = false)
    private PhienBanXe phienBanXe;

    @Column(name = "duong_dan", nullable = false, length = 500)
    private String duongDan;

    @Column(name = "loai_anh", length = 30)
    private String loaiAnh; // NGOAI_THAT hoặc NOI_THAT

    @Column(name = "thu_tu_hien_thi")
    private Integer thuTuHienThi;
}
