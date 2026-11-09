package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.enums.TrangThaiTaiKhoan;
import com.autohub.core.enums.VaiTroNguoiDung;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserRbacController {

    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NguoiDung>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(nguoiDungRepository.findAll(), "Lấy danh sách người dùng thành công"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<String>> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam TrangThaiTaiKhoan status) {
        
        Optional<NguoiDung> opt = nguoiDungRepository.findById(id);
        if (opt.isPresent()) {
            NguoiDung u = opt.get();
            u.setTrangThaiTaiKhoan(status);
            nguoiDungRepository.save(u);
            return ResponseEntity.ok(ApiResponse.ok(status.name(), "Cập nhật trạng thái tài khoản thành công"));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy người dùng với ID: " + id));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<String>> updateUserRole(
            @PathVariable Long id,
            @RequestParam VaiTroNguoiDung role) {
        
        Optional<NguoiDung> opt = nguoiDungRepository.findById(id);
        if (opt.isPresent()) {
            NguoiDung u = opt.get();
            u.setVaiTro(role);
            nguoiDungRepository.save(u);
            return ResponseEntity.ok(ApiResponse.ok(role.name(), "Cập nhật vai trò người dùng thành công"));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy người dùng với ID: " + id));
    }
}
