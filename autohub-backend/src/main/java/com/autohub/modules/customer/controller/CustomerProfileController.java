package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
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
    public static class UpdateAvatarDto {
        private Long customerId;
        private String avatarUrl;
    }

    @Getter
    @Setter
    public static class ChangePasswordDto {
        private Long customerId;
        private String currentPassword;
        private String newPassword;
    }

    private NguoiDung resolveUser(Long requestedCustomerId) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getName() != null && !"anonymousUser".equals(auth.getName())) {
            var byEmail = nguoiDungRepository.findByEmail(auth.getName());
            if (byEmail.isPresent()) {
                return byEmail.get();
            }
        }
        if (requestedCustomerId != null) {
            var byId = nguoiDungRepository.findById(requestedCustomerId);
            if (byId.isPresent()) {
                return byId.get();
            }
        }
        return nguoiDungRepository.findById(5L)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(@RequestParam(required = false) Long customerId) {
        NguoiDung user = resolveUser(customerId);

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
        NguoiDung user = resolveUser(req.getCustomerId());
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin tài khoản người dùng."));
        }

        if (req.getFullName() != null && !req.getFullName().isBlank()) user.setHoTen(req.getFullName().trim());
        if (req.getPhoneNumber() != null && !req.getPhoneNumber().isBlank()) user.setSoDienThoai(req.getPhoneNumber().trim());
        if (req.getIdentityCardNumber() != null && !req.getIdentityCardNumber().isBlank()) user.setSoCCCD(req.getIdentityCardNumber().trim());
        if (req.getAvatarUrl() != null && !req.getAvatarUrl().isBlank()) user.setAnhDaiDien(req.getAvatarUrl().trim());
        if (req.getDateOfBirth() != null) user.setNgaySinh(req.getDateOfBirth());
        if (req.getGender() != null && !req.getGender().isBlank()) user.setGioiTinh(req.getGender().trim());

        NguoiDung saved = nguoiDungRepository.save(user);

        Map<String, Object> map = new HashMap<>();
        map.put("id", saved.getId());
        map.put("fullName", saved.getHoTen());
        map.put("email", saved.getEmail());
        map.put("phoneNumber", saved.getSoDienThoai());
        map.put("identityCardNumber", saved.getSoCCCD());
        map.put("avatarUrl", saved.getAnhDaiDien());
        map.put("dateOfBirth", saved.getNgaySinh());
        map.put("gender", saved.getGioiTinh());
        return ResponseEntity.ok(ApiResponse.ok(map, "Cập nhật hồ sơ tài khoản thành công"));
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "customerId", required = false) Long customerId
    ) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng chọn file hình ảnh hợp lệ."));
        }

        // Kiểm tra dung lượng tối đa 5MB
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Dung lượng file tối đa cho phép là 5MB."));
        }

        // Kiểm tra định dạng ảnh
        String originalFilename = file.getOriginalFilename();
        String ext = StringUtils.getFilenameExtension(originalFilename);
        if (ext == null || ext.isBlank()) {
            ext = "jpg";
        }
        ext = ext.toLowerCase();

        if (!Set.of("jpg", "jpeg", "png", "webp", "gif").contains(ext)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG, WEBP, GIF."));
        }

        NguoiDung user = resolveUser(customerId);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin tài khoản người dùng."));
        }

        try {
            Path uploadDir = Paths.get("uploads", "avatars");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String filename = "avatar_user_" + user.getId() + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + "." + ext;
            Path destination = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String publicUrl = "/api/uploads/avatars/" + filename;
            user.setAnhDaiDien(publicUrl);
            nguoiDungRepository.save(user);

            log.info("[CustomerProfileController] Người dùng {} đã tải lên avatar mới: {}", user.getEmail(), publicUrl);

            Map<String, Object> map = new HashMap<>();
            map.put("avatarUrl", publicUrl);
            return ResponseEntity.ok(ApiResponse.ok(map, "Tải lên và cập nhật ảnh đại diện thành công!"));
        } catch (Exception e) {
            log.error("[CustomerProfileController] Lỗi khi lưu ảnh đại diện: ", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi khi lưu ảnh đại diện trên máy chủ: " + e.getMessage()));
        }
    }

    @PutMapping("/avatar")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateAvatarUrl(@RequestBody UpdateAvatarDto req) {
        if (req.getAvatarUrl() == null || req.getAvatarUrl().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đường dẫn ảnh đại diện không được để trống."));
        }
        if (req.getAvatarUrl().length() > 500) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đường dẫn ảnh đại diện quá dài (tối đa 500 ký tự)."));
        }

        NguoiDung user = resolveUser(req.getCustomerId());
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin người dùng."));
        }

        user.setAnhDaiDien(req.getAvatarUrl().trim());
        nguoiDungRepository.save(user);

        log.info("[CustomerProfileController] Người dùng {} đã đổi avatar sang URL: {}", user.getEmail(), user.getAnhDaiDien());

        Map<String, Object> map = new HashMap<>();
        map.put("avatarUrl", user.getAnhDaiDien());
        return ResponseEntity.ok(ApiResponse.ok(map, "Cập nhật ảnh đại diện thành công!"));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordDto req) {
        NguoiDung user = resolveUser(req.getCustomerId());
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin tài khoản người dùng."));
        }

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
