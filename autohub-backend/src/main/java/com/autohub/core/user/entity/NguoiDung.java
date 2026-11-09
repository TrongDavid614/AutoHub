package com.autohub.core.user.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.enums.TrangThaiTaiKhoan;
import com.autohub.core.enums.VaiTroNguoiDung;
import com.autohub.core.showroom.entity.Showroom;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "nguoi_dung")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NguoiDung extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_id")
    private Showroom showroom;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "mat_khau_bam", nullable = false, length = 100)
    private String matKhauBam;

    @Column(name = "so_dien_thoai", nullable = false, length = 10)
    private String soDienThoai;

    @Column(name = "anh_dai_dien", length = 500)
    private String anhDaiDien;

    @Column(name = "so_cccd", length = 12)
    private String soCCCD;

    @Enumerated(EnumType.STRING)
    @Column(name = "vai_tro", nullable = false, length = 30)
    @Builder.Default
    private VaiTroNguoiDung vaiTro = VaiTroNguoiDung.ROLE_CUSTOMER;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_tai_khoan", nullable = false, length = 30)
    @Builder.Default
    private TrangThaiTaiKhoan trangThaiTaiKhoan = TrangThaiTaiKhoan.CHUA_KICH_HOAT;

    @Column(name = "ngay_tao")
    @Builder.Default
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
