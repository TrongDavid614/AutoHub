package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.enums.TrangThaiTaiKhoan;
import com.autohub.core.enums.VaiTroNguoiDung;
import com.autohub.core.showroom.entity.Showroom;
import com.autohub.core.showroom.repository.ShowroomRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.admin.dto.AdminUserDto;
import com.autohub.modules.admin.dto.AdminUserStatsDto;
import com.autohub.modules.admin.dto.CreateStaffUserRequest;
import com.autohub.modules.admin.dto.UpdateUserRoleRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserRbacController {

    private final NguoiDungRepository nguoiDungRepository;
    private final ShowroomRepository showroomRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminUserDto>>> getAllUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) VaiTroNguoiDung role,
            @RequestParam(required = false) TrangThaiTaiKhoan status
    ) {
        List<NguoiDung> users = nguoiDungRepository.findAll();

        List<AdminUserDto> dtos = users.stream()
                .filter(u -> !u.isDeleted())
                .filter(u -> {
                    if (role != null) {
                        return u.getVaiTro() == role;
                    }
                    return true;
                })
                .filter(u -> {
                    if (status != null) {
                        return u.getTrangThaiTaiKhoan() == status;
                    }
                    return true;
                })
                .filter(u -> {
                    if (keyword == null || keyword.trim().isEmpty()) {
                        return true;
                    }
                    String q = keyword.trim().toLowerCase();
                    boolean matchName = u.getHoTen() != null && u.getHoTen().toLowerCase().contains(q);
                    boolean matchEmail = u.getEmail() != null && u.getEmail().toLowerCase().contains(q);
                    boolean matchPhone = u.getSoDienThoai() != null && u.getSoDienThoai().contains(q);
                    boolean matchCccd = u.getSoCCCD() != null && u.getSoCCCD().contains(q);
                    return matchName || matchEmail || matchPhone || matchCccd;
                })
                .sorted(Comparator.comparing(NguoiDung::getId))
                .map(this::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponse.ok(dtos, "Lấy danh sách người dùng thành công"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminUserStatsDto>> getUserStats() {
        List<NguoiDung> users = nguoiDungRepository.findAll().stream()
                .filter(u -> !u.isDeleted())
                .toList();

        long total = users.size();
        long admins = users.stream().filter(u -> u.getVaiTro() == VaiTroNguoiDung.ROLE_ADMIN).count();
        long staffs = users.stream().filter(u -> u.getVaiTro() == VaiTroNguoiDung.ROLE_STAFF).count();
        long customers = users.stream().filter(u -> u.getVaiTro() == VaiTroNguoiDung.ROLE_CUSTOMER).count();
        long active = users.stream().filter(u -> u.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.HOAT_DONG).count();
        long locked = users.stream().filter(u -> u.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.BI_KHOA).count();

        AdminUserStatsDto stats = AdminUserStatsDto.builder()
                .totalUsers(total)
                .adminCount(admins)
                .staffCount(staffs)
                .customerCount(customers)
                .activeCount(active)
                .lockedCount(locked)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(stats, "Lấy thống kê phân quyền tài khoản thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserDto>> getUserById(@PathVariable Long id) {
        NguoiDung user = nguoiDungRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng có ID: " + id));

        return ResponseEntity.ok(ApiResponse.ok(toDto(user), "Lấy thông tin người dùng thành công"));
    }

    @PatchMapping("/{id}/toggle-status")
    @Transactional
    public ResponseEntity<ApiResponse<AdminUserDto>> toggleUserStatus(@PathVariable Long id) {
        NguoiDung user = nguoiDungRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng có ID: " + id));

        // Không cho phép tự khóa tài khoản Admin ID = 1
        if (id == 1L && user.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.HOAT_DONG) {
            throw new RuntimeException("Không thể khóa tài khoản Quản Trị Viên hệ thống gốc!");
        }

        if (user.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.HOAT_DONG) {
            user.setTrangThaiTaiKhoan(TrangThaiTaiKhoan.BI_KHOA);
        } else {
            user.setTrangThaiTaiKhoan(TrangThaiTaiKhoan.HOAT_DONG);
        }

        user.setUpdatedAt(LocalDateTime.now());
        nguoiDungRepository.save(user);

        String message = user.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.HOAT_DONG
                ? "Kích hoạt lại tài khoản thành công"
                : "Đã tạm khóa tài khoản người dùng";

        return ResponseEntity.ok(ApiResponse.ok(toDto(user), message));
    }

    @PutMapping("/{id}/role")
    @Transactional
    public ResponseEntity<ApiResponse<AdminUserDto>> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        NguoiDung user = nguoiDungRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng có ID: " + id));

        user.setVaiTro(request.getVaiTro());

        if (request.getShowroomId() != null) {
            Showroom showroom = showroomRepository.findById(request.getShowroomId())
                    .orElse(null);
            user.setShowroom(showroom);
        } else if (request.getVaiTro() == VaiTroNguoiDung.ROLE_CUSTOMER || request.getVaiTro() == VaiTroNguoiDung.ROLE_ADMIN) {
            user.setShowroom(null);
        }

        user.setUpdatedAt(LocalDateTime.now());
        nguoiDungRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok(toDto(user), "Cập nhật vai trò phân quyền thành công"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<AdminUserDto>> createStaffUser(
            @Valid @RequestBody CreateStaffUserRequest request
    ) {
        if (nguoiDungRepository.existsByEmail(request.getEmail().trim())) {
            throw new RuntimeException("Email '" + request.getEmail().trim() + "' đã được sử dụng trong hệ thống!");
        }

        Showroom showroom = null;
        if (request.getShowroomId() != null) {
            showroom = showroomRepository.findById(request.getShowroomId())
                    .orElse(null);
        }

        NguoiDung newUser = NguoiDung.builder()
                .hoTen(request.getHoTen().trim())
                .email(request.getEmail().trim().toLowerCase())
                .matKhauBam(passwordEncoder.encode(request.getPassword()))
                .soDienThoai(request.getSoDienThoai() != null ? request.getSoDienThoai().trim() : null)
                .soCCCD(request.getSoCCCD() != null ? request.getSoCCCD().trim() : null)
                .vaiTro(request.getVaiTro())
                .trangThaiTaiKhoan(TrangThaiTaiKhoan.HOAT_DONG)
                .showroom(showroom)
                .isDeleted(false)
                .ngayTao(LocalDateTime.now())
                .build();

        NguoiDung saved = nguoiDungRepository.save(newUser);
        return ResponseEntity.ok(ApiResponse.ok(toDto(saved), "Tạo tài khoản người dùng mới thành công"));
    }

    private AdminUserDto toDto(NguoiDung u) {
        String roleLabel = "Khách Hàng (Customer)";
        if (u.getVaiTro() == VaiTroNguoiDung.ROLE_ADMIN) {
            roleLabel = "Quản Trị Viên (Admin)";
        } else if (u.getVaiTro() == VaiTroNguoiDung.ROLE_STAFF) {
            roleLabel = "Tư Vấn Showroom (Staff)";
        }

        String showroomName = "Toàn Hệ Thống / Trực Tuyến";
        if (u.getShowroom() != null) {
            showroomName = u.getShowroom().getTenShowroom();
        } else if (u.getVaiTro() == VaiTroNguoiDung.ROLE_CUSTOMER) {
            showroomName = "Khách Hàng Trực Tuyến";
        }

        String userCode = "USR-" + String.format("%03d", u.getId());

        return AdminUserDto.builder()
                .id(u.getId())
                .userCode(userCode)
                .hoTen(u.getHoTen())
                .email(u.getEmail())
                .soDienThoai(u.getSoDienThoai() != null ? u.getSoDienThoai() : "Chưa cập nhật")
                .soCCCD(u.getSoCCCD() != null ? u.getSoCCCD() : "Chưa định danh")
                .anhDaiDien(u.getAnhDaiDien())
                .vaiTro(u.getVaiTro())
                .vaiTroLabel(roleLabel)
                .showroomId(u.getShowroom() != null ? u.getShowroom().getId() : null)
                .tenShowroom(showroomName)
                .trangThaiTaiKhoan(u.getTrangThaiTaiKhoan())
                .dangHoatDong(u.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.HOAT_DONG)
                .ngayTao(u.getNgayTao())
                .updatedAt(u.getUpdatedAt())
                .build();
    }
}
