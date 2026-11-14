package com.autohub.modules.admin.dto;

import com.autohub.core.enums.TrangThaiTaiKhoan;
import com.autohub.core.enums.VaiTroNguoiDung;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    private Long id;
    private String userCode; // USR-001
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String soCCCD;
    private String anhDaiDien;
    private VaiTroNguoiDung vaiTro;
    private String vaiTroLabel; // Quản Trị Viên (Admin), Tư Vấn Showroom (Staff), Khách Hàng (Customer)
    private Long showroomId;
    private String tenShowroom;
    private TrangThaiTaiKhoan trangThaiTaiKhoan;
    private boolean dangHoatDong; // true if HOAT_DONG
    private LocalDateTime ngayTao;
    private LocalDateTime updatedAt;
}
