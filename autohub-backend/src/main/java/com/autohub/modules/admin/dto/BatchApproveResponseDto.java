package com.autohub.modules.admin.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchApproveResponseDto {
    private int approvedCount;
}
