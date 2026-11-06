package com.autohub.core.car.entity;

import com.autohub.core.enums.TrangThaiXeVIN;
import com.autohub.core.showroom.entity.TonKhoXe;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "xe_dinh_danh")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class XeDinhDanh extends com.autohub.common.entity.BaseEntity {

    @Column(name = "so_khung_vin", length = 17, nullable = false, unique = true)
    private String soKhungVIN; // 17 ký tự duy nhất

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiXeVIN trangThai = TrangThaiXeVIN.CO_SAN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ton_kho_id", nullable = false)
    private TonKhoXe tonKhoXe;
}
