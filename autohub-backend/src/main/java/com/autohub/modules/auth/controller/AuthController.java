package com.autohub.modules.auth.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.modules.auth.dto.*;
import com.autohub.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Đăng ký tài khoản thành công"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đăng nhập thành công"));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<LoginResponse>> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        LoginResponse response = authService.loginWithGoogle(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đăng nhập Google thành công"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoDto>> getCurrentUser() {
        UserInfoDto userInfo = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(userInfo, "Lấy thông tin người dùng thành công"));
    }

    // ==========================================
    // UC05: YÊU CẦU CẤP LẠI MẬT KHẨU QUA EMAIL (OTP 6 SỐ)
    // ==========================================

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.requestPasswordResetOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(
                "Mã OTP 6 số đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.",
                "Yêu cầu cấp lại mật khẩu thành công"
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        VerifyOtpResponse response = authService.verifyPasswordResetOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Xác thực mã OTP thành công"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPasswordWithToken(request);
        return ResponseEntity.ok(ApiResponse.ok(
                "Mật khẩu của bạn đã được cập nhật thành công. Bạn có thể đăng nhập ngay bằng mật khẩu mới.",
                "Đặt lại mật khẩu thành công"
        ));
    }
}
