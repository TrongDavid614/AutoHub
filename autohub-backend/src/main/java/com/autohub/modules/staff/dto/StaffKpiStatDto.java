package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffKpiStatDto {
    private String id;
    private String title;
    private String value;
    private String subtitle;
    private String badgeText;
    private String badgeType;
}

