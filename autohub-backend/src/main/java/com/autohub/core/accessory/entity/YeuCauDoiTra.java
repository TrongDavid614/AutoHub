package com.autohub.core.accessory.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.enums.TrangThaiDoiTra;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "yeu_cau_doi_tra")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YeuCauDoiTra extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_hang_id", nullable = false)
    private DonHangPhuKien donHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chi_tiet_don_hang_id", nullable = false)
    private ChiTietDonHang chiTietDonHang;

    @Column(name = "so_luong_doi_tra", nullable = false)
    private Integer soLuongDoiTra;

    @Column(nullable = false, length = 1000)
    private String lyDo;

    @Column(name = "phuong_an_mong_muon", nullable = false, length = 20)
    private String phuongAnMongMuon; // DOI_HANG hoặc HOAN_TIEN

    @Column(length = 1000)
    private String minhChung;

    @Column(name = "phuong_an_giai_quyet", length = 20)
    private String phuongAnGiaiQuyet;

    @Column(name = "ma_van_don_moi", length = 50)
    private String maVanDonMoi;

    @Column(name = "ngay_gui")
    @Builder.Default
    private LocalDateTime ngayGui = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiDoiTra trangThai = TrangThaiDoiTra.PENDING;

    @Column(name = "ghi_chu_xu_ly", length = 1000)
    private String ghiChuXuLy;
}
