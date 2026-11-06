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

    @Column(name = "loai_ly_do", length = 50)
    private String loaiLyDo; // NGAN_HANG_TU_CHOI_TIN_DUNG hoặc NGOAI_LE_ADMIN (DR14)

    @Column(name = "ly_do", length = 500)
    private String lyDo;

    @Column(name = "minh_chung", length = 500)
    private String minhChung; // File đính kèm văn bản ngân hàng

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_doi_soat_id")
    private NguoiDung nhanVienDoiSoat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quan_tri_phe_duyet_id")
    private NguoiDung adminPheDuyet;
}
