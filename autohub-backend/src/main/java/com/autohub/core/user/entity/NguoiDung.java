package com.autohub.core.user.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.enums.TrangThaiTaiKhoan;
import com.autohub.core.enums.VaiTroNguoiDung;
import com.autohub.core.showroom.entity.Showroom;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
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

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email; // Định danh đăng nhập duy nhất (BR01)

    @Column(name = "mat_khau_bam", nullable = false)
    private String matKhauBam; // BCrypt hash

    @Column(name = "so_dien_thoai", length = 15)
    private String soDienThoai; // 10 chữ số

    @Column(name = "anh_dai_dien", length = 500)
    private String anhDaiDien;

    @Column(name = "so_cccd", length = 20)
    private String soCCCD; // 12 chữ số, bắt buộc khi cọc xe (BR01)

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "gioi_tinh", length = 10)
    private String gioiTinh;

    @Enumerated(EnumType.STRING)
    @Column(name = "vai_tro", nullable = false, length = 20)
    private VaiTroNguoiDung vaiTro;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_tai_khoan", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiTaiKhoan trangThaiTaiKhoan = TrangThaiTaiKhoan.HOAT_DONG;

    @Column(name = "ngay_tao")
    @Builder.Default
    private LocalDateTime ngayTao = LocalDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;
}
