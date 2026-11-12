package com.autohub.core.showroom.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lich_truc_nhan_vien")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LichTrucNhanVien extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id", nullable = false)
    private NguoiDung nhanVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    @Column(name = "ngay_truc", nullable = false)
    private LocalDate ngayTruc;

    @Column(name = "ca_truc", nullable = false, length = 30)
    private String caTruc; // CA_SANG, CA_CHIEU, CA_TOI, CA_FULL

    @Column(name = "ghi_chu", length = 255)
    private String ghiChu;

    @Column(name = "ngay_tao")
    @Builder.Default
    private LocalDateTime ngayTao = LocalDateTime.now();
}
