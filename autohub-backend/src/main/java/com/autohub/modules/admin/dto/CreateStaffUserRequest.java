package com.autohub.modules.admin.dto;

import com.autohub.core.enums.VaiTroNguoiDung;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStaffUserRequest {

    @NotBlank(message = "Họ tên không được để trống")
    private String hoTen;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    private String soDienThoai;
    private String soCCCD;

    @NotNull(message = "Vai trò không được để trống")
    private VaiTroNguoiDung vaiTro;

    private Long showroomId;
}
