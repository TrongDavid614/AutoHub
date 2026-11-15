package com.autohub.modules.auth.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.modules.auth.dto.LoginRequest;
import com.autohub.modules.auth.dto.LoginResponse;
import com.autohub.modules.auth.dto.UserInfoDto;
import com.autohub.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đăng nhập thành công"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoDto>> getCurrentUser() {
        UserInfoDto userInfo = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(userInfo, "Lấy thông tin người dùng thành công"));
    }
}
