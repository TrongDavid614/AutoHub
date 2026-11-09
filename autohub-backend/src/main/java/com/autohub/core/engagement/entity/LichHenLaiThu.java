package com.autohub.core.engagement.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.showroom.entity.Showroom;
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
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phien_ban_id", nullable = false)
    private PhienBanXe phienBanXe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "xe_demo_id")
    private XeDemo xeDemo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_id")
    private Showroom showroom;

    @Column(name = "thoi_gian_hen", nullable = false)
    private LocalDateTime thoiGianHen;

    @Column(name = "thoi_luong_phut", nullable = false)
    @Builder.Default
    private Integer thoiLuongPhut = 60;

    @Column(name = "dia_diem_lai_thu", nullable = false, length = 255)
    private String diaDiemLaiThu;

    @Column(name = "ho_ten_khach", nullable = false, length = 100)
    private String hoTenKhach;

    @Column(name = "so_dien_thoai_khach", nullable = false, length = 10)
    private String soDienThoaiKhach;

    @Column(name = "cam_ket_gplx", nullable = false)
    @Builder.Default
    private Boolean camKetGplx = true;

    @Column(name = "so_gplx_kiem_tra", length = 20)
    private String soGplxKiemTra;

    @Column(name = "odo_bat_dau")
    private Integer odoBatDau;

    @Column(name = "odo_ket_thuc")
    private Integer odoKetThuc;

    @Column(name = "thoi_gian_checkin")
    private LocalDateTime thoiGianCheckin;

    @Column(name = "thoi_gian_checkout")
    private LocalDateTime thoiGianCheckout;

    @Column(name = "chu_ky_khach_hang", length = 500)
    private String chuKyKhachHang;

    @Column(name = "ngay_tao")
    @Builder.Default
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiLichHen trangThai = TrangThaiLichHen.PENDING;

    @Column(length = 500)
    private String ghiChu;

    @Column(name = "da_gui_nhac_lich", nullable = false)
    @Builder.Default
    private boolean daGuiNhacLich = false;

    @Column(name = "thoi_gian_gui_nhac")
    private LocalDateTime thoiGianGuiNhac;

    @Column(name = "bien_ban_danh_gia", columnDefinition = "NVARCHAR(MAX)")
    private String bienBanDanhGia;
}
