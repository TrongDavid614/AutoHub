package com.autohub.modules.auth.service;

import com.autohub.common.exception.AppException;
import com.autohub.common.security.JwtTokenProvider;
import com.autohub.common.service.EmailService;
import com.autohub.core.enums.TrangThaiTaiKhoan;
import com.autohub.core.enums.VaiTroNguoiDung;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.auth.dto.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
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

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    // Cache lưu trữ phiên OTP reset mật khẩu (Email -> OtpSession)
    private final Map<String, OtpSession> otpSessionCache = new ConcurrentHashMap<>();

    @Data
    @Builder
    @AllArgsConstructor
    private static class OtpSession {
        private String otpCode;
        private LocalDateTime otpExpiresAt;
        private boolean verified;
        private String resetToken;
        private LocalDateTime resetTokenExpiresAt;
    }

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

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String fullName = request.getFullName() != null ? request.getFullName().trim() : "";
        String rawPassword = request.getPassword() != null ? request.getPassword() : "";

        String rawPhone = request.getPhoneNumber() != null ? request.getPhoneNumber().trim().replaceAll("[^0-9]", "") : "";
        if (rawPhone.startsWith("84") && rawPhone.length() == 11) {
            rawPhone = "0" + rawPhone.substring(2);
        } else if (!rawPhone.startsWith("0") && rawPhone.length() == 9) {
            rawPhone = "0" + rawPhone;
        }

        if (fullName.isEmpty()) {
            throw new AppException("Họ và tên không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (email.isEmpty()) {
            throw new AppException("Email không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (rawPassword.length() < 8) {
            throw new AppException("Mật khẩu phải có tối thiểu 8 ký tự", HttpStatus.BAD_REQUEST);
        }
        if (!rawPhone.matches("^0[35789]\\d{8}$")) {
            throw new AppException("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số (đầu 03, 05, 07, 08, 09)", HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra tính duy nhất của email và số điện thoại
        if (nguoiDungRepository.existsByEmail(email)) {
            throw new AppException("Email này đã được sử dụng trên hệ thống AutoHub", HttpStatus.BAD_REQUEST);
        }
        if (nguoiDungRepository.existsBySoDienThoai(rawPhone)) {
            throw new AppException("Số điện thoại này đã được sử dụng trên hệ thống AutoHub", HttpStatus.BAD_REQUEST);
        }

        NguoiDung user = NguoiDung.builder()
                .hoTen(fullName)
                .email(email)
                .soDienThoai(rawPhone)
                .matKhauBam(passwordEncoder.encode(rawPassword))
                .vaiTro(VaiTroNguoiDung.ROLE_CUSTOMER)
                .trangThaiTaiKhoan(TrangThaiTaiKhoan.HOAT_DONG)
                .isDeleted(false)
                .build();

        nguoiDungRepository.save(user);

        // Tự động cấp phát JWT Token cho tài khoản vừa tạo
        String accessToken = jwtTokenProvider.generateToken(user.getEmail(), user.getVaiTro().name());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .user(mapToUserInfoDto(user))
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

    // ==========================================
    // UC05: YÊU CẦU CẤP LẠI MẬT KHẨU QUA EMAIL (OTP 6 SỐ)
    // ==========================================

    @Transactional(readOnly = true)
    public void requestPasswordResetOtp(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        NguoiDung user = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Không tìm thấy tài khoản tương ứng với email: " + email, HttpStatus.NOT_FOUND));

        if (user.isDeleted()) {
            throw new AppException("Tài khoản không tồn tại hoặc đã bị xóa khỏi hệ thống", HttpStatus.NOT_FOUND);
        }

        if (user.getTrangThaiTaiKhoan() == TrangThaiTaiKhoan.BI_KHOA) {
            throw new AppException("Tài khoản của bạn đã bị khóa bảo mật. Vui lòng liên hệ Quản trị viên để được hỗ trợ.", HttpStatus.FORBIDDEN);
        }

        // Sinh mã OTP 6 chữ số ngẫu nhiên
        int randomPin = 100000 + SECURE_RANDOM.nextInt(900000);
        String otpCode = String.format("%06d", randomPin);

        // Lưu vào bộ nhớ đệm (hết hạn sau 5 phút)
        OtpSession session = OtpSession.builder()
                .otpCode(otpCode)
                .otpExpiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();
        otpSessionCache.put(email, session);

        // Gửi email chứa mã OTP
        emailService.sendOtpEmail(email, otpCode, user.getHoTen());
        log.info("[AuthService] Đã khởi tạo OTP khôi phục mật khẩu cho email: {}", email);
    }

    public VerifyOtpResponse verifyPasswordResetOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String inputOtp = request.getOtp().trim();

        OtpSession session = otpSessionCache.get(email);
        if (session == null) {
            throw new AppException("Chưa có yêu cầu OTP nào được gửi đến email này hoặc mã đã hết hạn.", HttpStatus.BAD_REQUEST);
        }

        if (LocalDateTime.now().isAfter(session.getOtpExpiresAt())) {
            otpSessionCache.remove(email);
            throw new AppException("Mã OTP đã hết hiệu lực (quá 5 phút). Vui lòng yêu cầu gửi lại mã mới.", HttpStatus.BAD_REQUEST);
        }

        if (!session.getOtpCode().equals(inputOtp)) {
            throw new AppException("Mã OTP không chính xác. Vui lòng kiểm tra lại hộp thư.", HttpStatus.BAD_REQUEST);
        }

        // OTP hợp lệ: cấp phát resetToken có hạn 10 phút
        String resetToken = UUID.randomUUID().toString();
        session.setVerified(true);
        session.setResetToken(resetToken);
        session.setResetTokenExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpSessionCache.put(email, session);

        log.info("[AuthService] Xác thực OTP thành công cho email: {}", email);
        return VerifyOtpResponse.builder()
                .verified(true)
                .resetToken(resetToken)
                .email(email)
                .build();
    }

    @Transactional
    public void resetPasswordWithToken(ResetPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String token = request.getResetToken().trim();
        String newPassword = request.getNewPassword();

        OtpSession session = otpSessionCache.get(email);
        if (session == null || !session.isVerified() || session.getResetToken() == null) {
            throw new AppException("Phiên đặt lại mật khẩu không hợp lệ hoặc chưa được xác thực OTP.", HttpStatus.BAD_REQUEST);
        }

        if (LocalDateTime.now().isAfter(session.getResetTokenExpiresAt())) {
            otpSessionCache.remove(email);
            throw new AppException("Phiên đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại từ đầu.", HttpStatus.BAD_REQUEST);
        }

        if (!session.getResetToken().equals(token)) {
            throw new AppException("Mã token xác thực không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        if (newPassword.length() < 8) {
            throw new AppException("Mật khẩu mới phải có tối thiểu 8 ký tự.", HttpStatus.BAD_REQUEST);
        }

        NguoiDung user = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Không tìm thấy tài khoản người dùng", HttpStatus.NOT_FOUND));

        // Cập nhật mật khẩu băm mới
        user.setMatKhauBam(passwordEncoder.encode(newPassword));
        nguoiDungRepository.save(user);

        // Hủy phiên OTP sau khi đổi mật khẩu thành công
        otpSessionCache.remove(email);
        log.info("[AuthService] Đổi mật khẩu thành công qua OTP cho tài khoản: {}", email);
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
