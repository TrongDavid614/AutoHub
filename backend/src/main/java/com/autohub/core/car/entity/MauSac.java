package com.autohub.core.car.entity;

import com.autohub.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mau_sac")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MauSac extends BaseEntity {

    @Column(name = "ten_mau", nullable = false, length = 50)
    private String tenMau;

    @Column(name = "ma_hex", length = 10)
    private String maHex; // Ví dụ: #00A6E0
}
