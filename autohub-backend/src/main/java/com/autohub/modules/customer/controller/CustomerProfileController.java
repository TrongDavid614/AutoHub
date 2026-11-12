package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/customer/profile")
@RequiredArgsConstructor
public class CustomerProfileController {

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;

    @Getter
    @Setter
    public static class UpdateProfileDto {
        private Long customerId;
        private String fullName;
        private String phoneNumber;
        private String identityCardNumber;
        private String avatarUrl;
        private LocalDate dateOfBirth;
        private String gender;
    }

    @Getter
    @Setter
    public static class ChangePasswordDto {
        private Long customerId;
        private String currentPassword;
        private String newPassword;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(@RequestParam(required = false) Long customerId) {
        Long id = customerId != null ? customerId : 5L;
        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("fullName", user.getHoTen());
        map.put("email", user.getEmail());
        map.put("phoneNumber", user.getSoDienThoai());
        map.put("identityCardNumber", user.getSoCCCD());
        map.put("avatarUrl", user.getAnhDaiDien());
        map.put("dateOfBirth", user.getNgaySinh());
        map.put("gender", user.getGioiTinh());
        map.put("role", user.getVaiTro());
        map.put("createdAt", user.getNgayTao());
        return ResponseEntity.ok(ApiResponse.ok(map, "Lấy thông tin tài khoản thành công"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(@RequestBody UpdateProfileDto req) {
        Long id = req.getCustomerId() != null ? req.getCustomerId() : 5L;
        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng ID: " + id));

        if (req.getFullName() != null && !req.getFullName().isBlank()) user.setHoTen(req.getFullName());
        if (req.getPhoneNumber() != null && !req.getPhoneNumber().isBlank()) user.setSoDienThoai(req.getPhoneNumber());
        if (req.getIdentityCardNumber() != null && !req.getIdentityCardNumber().isBlank()) user.setSoCCCD(req.getIdentityCardNumber());
        if (req.getAvatarUrl() != null && !req.getAvatarUrl().isBlank()) user.setAnhDaiDien(req.getAvatarUrl());
        if (req.getDateOfBirth() != null) user.setNgaySinh(req.getDateOfBirth());
        if (req.getGender() != null && !req.getGender().isBlank()) user.setGioiTinh(req.getGender());

        NguoiDung saved = nguoiDungRepository.save(user);

        Map<String, Object> map = new HashMap<>();
        map.put("id", saved.getId());
        map.put("fullName", saved.getHoTen());
        map.put("email", saved.getEmail());
        map.put("phoneNumber", saved.getSoDienThoai());
        map.put("identityCardNumber", saved.getSoCCCD());
        map.put("dateOfBirth", saved.getNgaySinh());
        map.put("gender", saved.getGioiTinh());
        return ResponseEntity.ok(ApiResponse.ok(map, "Cập nhật hồ sơ tài khoản thành công"));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordDto req) {
        Long id = req.getCustomerId() != null ? req.getCustomerId() : 5L;
        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng ID: " + id));

        if (req.getCurrentPassword() != null && !req.getCurrentPassword().isBlank() && user.getMatKhauBam() != null) {
            if (!passwordEncoder.matches(req.getCurrentPassword(), user.getMatKhauBam())) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Mật khẩu hiện tại không chính xác."));
            }
        }

        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            user.setMatKhauBam(passwordEncoder.encode(req.getNewPassword()));
            nguoiDungRepository.save(user);
        }

        return ResponseEntity.ok(ApiResponse.ok(null, "Đổi mật khẩu thành công"));
    }
}

