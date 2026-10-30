package com.autohub.core.pricing.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tinh_thanh")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TinhThanh extends BaseEntity {

    @Column(name = "ten_tinh", nullable = false, unique = true, length = 100)
    private String tenTinh;

    @Column(name = "phan_vung_bien_so", length = 20)
    private String phanVungBienSo; // Khu vực I, II, III (Hà Nội, TP.HCM...)
}
