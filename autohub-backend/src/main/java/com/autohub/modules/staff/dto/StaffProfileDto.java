package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffProfileDto {
    private Long id;
    private String staffCode;
    private String fullName;
    private String role;
    private String roleLabel;
    private Long showroomId;
    private String showroomName;
    private String email;
    private String phone;
    private String accountStatus;
}
