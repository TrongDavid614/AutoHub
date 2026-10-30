package com.autohub.core.engagement.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.user.entity.NguoiDung;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lich_hen_lai_thu")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LichHenLaiThu extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_dung", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phien_ban", nullable = false)
    private PhienBanXe phienBanXe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_xe_demo")
    private XeDemo xeDemo; // Staff gán khi duyệt lịch

    @Column(name = "thoi_gian_hen", nullable = false)
    private LocalDateTime thoiGianHen;

    @Column(name = "dia_diem_lai_thu", length = 255)
    private String diaDiemLaiThu; // Showroom hoặc Lái thử tại nhà

    @Column(name = "ho_ten_khach", length = 100)
    private String hoTenKhach;

    @Column(name = "so_dien_thoai_khach", length = 15)
    private String soDienThoaiKhach;

    @Column(name = "cam_ket_gplx", nullable = false)
    @Builder.Default
    private boolean camKetGPLX = true; // Bắt buộc true (DR21)

    @Column(name = "ngay_tao")
    @Builder.Default
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiLichHen trangThai = TrangThaiLichHen.PENDING;

    @Column(length = 255)
    private String ghiChu;

    @Column(name = "da_gui_nhac_lich")
    @Builder.Default
    private boolean daGuiNhacLich = false;

    @Column(name = "thoi_gian_gui_nhac")
    private LocalDateTime thoiGianGuiNhac;

    @Column(name = "bien_ban_danh_gia", columnDefinition = "NVARCHAR(MAX)")
    private String bienBanDanhGia;
}
