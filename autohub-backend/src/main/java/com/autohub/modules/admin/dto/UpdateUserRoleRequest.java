package com.autohub.modules.admin.dto;

import com.autohub.core.enums.VaiTroNguoiDung;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRoleRequest {
    @NotNull(message = "Vai trò không được để trống")
    private VaiTroNguoiDung vaiTro;
    private Long showroomId; // Gán showroom nếu là Staff
}
