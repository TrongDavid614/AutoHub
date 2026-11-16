package com.autohub.modules.staff.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffScheduleDetailDto {
    private String staffCode;
    private List<String> tasks;
}
