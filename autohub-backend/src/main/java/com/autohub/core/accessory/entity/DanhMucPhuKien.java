package com.autohub.core.accessory.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "danh_muc_phu_kien")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DanhMucPhuKien extends BaseEntity {

    @Column(name = "ten_danh_muc", nullable = false, unique = true, length = 100)
    private String tenDanhMuc;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;
}
