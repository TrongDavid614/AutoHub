package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffAiReplySuggestionDto {
    private Long consultationId;
    private String customerName;
    private String interestedCar;
    private String suggestedReply;
    private String stockNote;
    private Integer latencyMs;
}
