package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffMemberOptionDto {
    private Long id;
    private String staffCode;
    private String name;
    private String phone;
    private String email;
    private String role; // SUPERVISOR, SALES, TEST_DRIVE, WAREHOUSE
    private String roleLabel;
    private Long showroomId;
    private String showroomName;
    private String avatarColor;
}

