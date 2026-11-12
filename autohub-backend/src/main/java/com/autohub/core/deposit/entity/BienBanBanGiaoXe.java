package com.autohub.core.deposit.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bien_ban_ban_giao_xe")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BienBanBanGiaoXe extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phieu_dat_coc_id", nullable = false, unique = true)
    private PhieuDatCoc phieuDatCoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "xe_dinh_danh_id", nullable = false)
    private XeDinhDanh xeDinhDanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_ban_giao_id", nullable = false)
    private NguoiDung nhanVienBanGiao;

    @Column(name = "ma_bien_ban", nullable = false, unique = true, length = 50)
    private String maBienBan;

    @Column(name = "ngay_ban_giao")
    @Builder.Default
    private LocalDateTime ngayBanGiao = LocalDateTime.now();

    @Column(name = "so_odo_ban_giao", nullable = false)
    private Integer soOdoBanGiao;

    @Column(name = "ket_qua_pdi_json", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String ketQuaPdiJson;

    @Column(name = "file_bien_ban_url", length = 500)
    private String fileBienBanUrl;

    @Column(name = "chu_ky_khach", length = 500)
    private String chuKyKhach;

    @Column(name = "chu_ky_nhan_vien", length = 500)
    private String chuKyNhanVien;
}
