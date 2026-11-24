package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffColleagueDto {
    private Long id;
    private String staffCode;
    private String fullName;
    private String roleLabel;
    private String showroomName;
}
