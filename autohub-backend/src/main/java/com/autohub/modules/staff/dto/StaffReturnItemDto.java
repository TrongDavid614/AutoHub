package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffReturnItemDto {
    private String id;
    private String rmaCode;
    private String originalOrderCode;
    private String customerName;
    private String customerPhone;
    private String accessoryName;
    private String reason;
    private String requestedAt;
    private List<String> evidenceImages;
    private String inspectionNotes;
    private String status;
    private String resolution;
}

