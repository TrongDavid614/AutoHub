package com.autohub.modules.auth.service;

import com.autohub.common.exception.AppException;
import com.autohub.common.security.JwtTokenProvider;
import com.autohub.core.enums.TrangThaiTaiKhoan;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.auth.dto.LoginRequest;
import com.autohub.modules.auth.dto.LoginResponse;
import com.autohub.modules.auth.dto.UserInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String input = request.getEmailOrUsername() != null ? request.getEmailOrUsername().trim() : "";
        String rawPassword = request.getPassword() != null ? request.getPassword() : "";

        if (input.isEmpty() || rawPassword.isEmpty()) {
            throw new BadCredentialsException("Email/tài khoản và mật khẩu không được để trống");
        }

        // 1. Tìm kiếm người dùng theo email hoặc số điện thoại
        NguoiDung user = nguoiDungRepository.findByEmail(input)
                .or(() -> nguoiDungRepository.findBySoDienThoai(input))
                .orElseThrow(() -> new BadCredentialsException("Email/tài khoản hoặc mật khẩu không chính xác"));

        // 2. Kiểm tra cờ xóa mềm
        if (user.isDeleted()) {
            throw new BadCredentialsException("Email/tài khoản hoặc mật khẩu không chính xác");
        }

        // 3. Đối chiếu mật khẩu băm BCrypt
        if (!passwordEncoder.matches(rawPassword, user.getMatKhauBam())) {
            log.warn("Đăng nhập thất bại: Sai mật khẩu cho tài khoản [{}]", input);
            throw new BadCredentialsException("Email/tài khoản hoặc mật khẩu không chính xác");
        }

        // 4. Kiểm tra trạng thái hoạt động của tài khoản
        if (user.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.BI_KHOA) {
            log.warn("Đăng nhập bị từ chối: Tài khoản [{}] đã bị khóa", input);
            throw new LockedException("Tài khoản của bạn đã bị khóa bảo mật. Vui lòng liên hệ quản trị viên.");
        }

        if (user.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.CHUA_KICH_HOAT) {
            log.warn("Đăng nhập bị từ chối: Tài khoản [{}] chưa kích hoạt", input);
            throw new DisabledException("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email kích hoạt.");
        }

        // 5. Sinh JWT Token chứa đầy đủ định danh (id, email, ho_ten, role)
        String roleStr = user.getVaiTro() != null ? user.getVaiTro().name() : "ROLE_CUSTOMER";
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getHoTen(), roleStr);

        log.info("Người dùng [{}] đăng nhập thành công với vai trò [{}]", user.getEmail(), roleStr);

        // 6. Đóng gói UserInfoDto & LoginResponse
        UserInfoDto userInfo = mapToUserInfoDto(user);
        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(userInfo)
                .build();
    }

    @Transactional(readOnly = true)
    public UserInfoDto getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadCredentialsException("Phiên đăng nhập đã hết hạn hoặc không hợp lệ");
        }

        String email = auth.getName();
        NguoiDung user = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Không tìm thấy thông tin tài khoản hiện tại", HttpStatus.NOT_FOUND));

        return mapToUserInfoDto(user);
    }

    private UserInfoDto mapToUserInfoDto(NguoiDung user) {
        boolean active = user.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.HOAT_DONG && !user.isDeleted();
        return UserInfoDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getHoTen())
                .phoneNumber(user.getSoDienThoai())
                .identityCardNumber(user.getSoCCCD())
                .role(user.getVaiTro())
                .isActive(active)
                .avatarUrl(user.getAnhDaiDien())
                .createdAt(user.getNgayTao() != null ? user.getNgayTao().toString() : null)
                .build();
    }
}
