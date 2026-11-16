package com.autohub.modules.staff.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffScheduleDto {
    private String staffCode;
    private String shift;
    private String assignedShowroom;
}
