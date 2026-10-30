package com.autohub.core.car.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hang_xe")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HangXe extends BaseEntity {

    @Column(name = "ten_hang_xe", nullable = false, unique = true, length = 100)
    private String tenHangXe;

    @Column(name = "dang_hoat_dong")
    @Builder.Default
    private boolean dangHoatDong = true;
}
