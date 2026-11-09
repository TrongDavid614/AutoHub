package com.autohub.core.engagement.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "yeu_cau_tu_van")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YeuCauTuVan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id")
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phien_ban_id")
    private PhienBanXe phienBanXe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    private NguoiDung nhanVien;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "so_dien_thoai", nullable = false, length = 10)
    private String soDienThoai;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "noi_dung_can_tu_van", nullable = false, length = 1000)
    private String noiDungCanTuVan;

    @Column(name = "khung_gio_tiep_nhan", length = 100)
    private String khungGioTiepNhan;

    @Column(name = "ngay_gui")
    @Builder.Default
    private LocalDateTime ngayGui = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiYeuCauTuVan trangThai = TrangThaiYeuCauTuVan.PENDING;

    @Column(name = "ghi_chu_cskh", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChuCSKH;
}
