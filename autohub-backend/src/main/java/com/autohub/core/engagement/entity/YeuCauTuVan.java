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
    @JoinColumn(name = "ma_nguoi_dung")
    private NguoiDung nguoiDung; // Khách hàng (có thể rỗng)

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "so_dien_thoai", nullable = false, length = 15)
    private String soDienThoai;

    @Column(length = 100)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phien_ban")
    private PhienBanXe phienBanXe; // Mẫu xe quan tâm (có thể rỗng theo DR24)

    @Column(name = "noi_dung_can_tu_van", length = 500)
    private String noiDungCanTuVan;

    @Column(name = "khung_gio_tiep_nhan", length = 50)
    private String khungGioTiepNhan;

    @Column(name = "ngay_gui")
    @Builder.Default
    private LocalDateTime ngayGui = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiYeuCauTuVan trangThai = TrangThaiYeuCauTuVan.PENDING;

    @Column(name = "ghi_chu_cskh", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChuCSKH; // Lịch sử chăm sóc của Staff

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nhan_vien_phu_trach")
    private NguoiDung nhanVienPhuTrach; // Staff nhận xử lý
}
