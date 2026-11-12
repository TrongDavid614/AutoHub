package com.autohub.core.engagement.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "nhat_ky_tu_van")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NhatKyTuVan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "yeu_cau_tu_van_id", nullable = false)
    private YeuCauTuVan yeuCauTuVan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id", nullable = false)
    private NguoiDung nhanVien;

    @Column(name = "loai_tuong_tac", nullable = false, length = 30)
    private String loaiTuongTac; // CUOC_GOI, TIN_NHAN_ZALO, EMAIL, GAP_TRUC_TIEP

    @Column(name = "noi_dung_trao_doi", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String noiDungTraoDoi;

    @Column(name = "ngan_sach_du_kien", precision = 18, scale = 0)
    private BigDecimal nganSachDuKien;

    @Column(name = "ket_qua_cuoc_goi", length = 100)
    private String ketQuaCuocGoi;

    @Column(name = "thoi_gian_tuong_tac")
    @Builder.Default
    private LocalDateTime thoiGianTuongTac = LocalDateTime.now();
}
