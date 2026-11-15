package com.autohub.modules.auth.dto;

import com.autohub.core.enums.VaiTroNguoiDung;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {

    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String identityCardNumber;
    private VaiTroNguoiDung role;
    private Boolean isActive;
    private String avatarUrl;
    private String createdAt;
}
