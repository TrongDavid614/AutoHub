package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserStatsDto {
    private long totalUsers;
    private long adminCount;
    private long staffCount;
    private long customerCount;
    private long activeCount;
    private long lockedCount;
}
