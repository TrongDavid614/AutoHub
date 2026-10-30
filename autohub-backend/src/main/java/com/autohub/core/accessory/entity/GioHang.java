package com.autohub.core.accessory.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "gio_hang")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GioHang extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_dung", nullable = false, unique = true)
    private NguoiDung nguoiDung;

    @Column(name = "ngay_cap_nhat")
    @Builder.Default
    private LocalDateTime ngayCapNhat = LocalDateTime.now();
}
