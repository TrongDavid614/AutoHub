package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.accessory.entity.PhuKien;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "ton_kho_phu_kien_showroom",
        uniqueConstraints = @UniqueConstraint(name = "UQ_tkpk_pk_sr", columnNames = {"phu_kien_id", "showroom_id"})
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TonKhoPhuKienShowroom extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_kien_id", nullable = false)
    private PhuKien phuKien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    @Column(name = "ma_sku", length = 50)
    private String maSku;

    @Column(name = "vi_tri_ke", length = 100)
    private String viTriKe;

    @Column(name = "so_luong_ton", nullable = false)
    @Builder.Default
    private Integer soLuongTon = 0;

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Version
    @Column(name = "row_version", nullable = false)
    @Builder.Default
    private Long rowVersion = 0L;
}
