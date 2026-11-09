package com.autohub.core.deposit.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.enums.TrangThaiHoanCoc;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "yeu_cau_hoan_coc")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YeuCauHoanCoc extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phieu_dat_coc_id", nullable = false)
    private PhieuDatCoc phieuDatCoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_doi_soat_id")
    private NguoiDung nhanVienDoiSoat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quan_tri_phe_duyet_id")
    private NguoiDung quanTriPheDuyet;

    @Column(name = "loai_ly_do", nullable = false, length = 40)
    private String loaiLyDo;

    @Column(nullable = false, length = 1000)
    private String lyDo;

    @Column(length = 500)
    private String minhChung;

    @Column(name = "ngay_gui")
    @Builder.Default
    private LocalDateTime ngayGui = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiHoanCoc trangThai = TrangThaiHoanCoc.PENDING;

    @Column(name = "ly_do_tu_choi", length = 500)
    private String lyDoTuChoi;

    @Column(name = "ngay_xu_ly")
    private LocalDateTime ngayXuLy;
}
