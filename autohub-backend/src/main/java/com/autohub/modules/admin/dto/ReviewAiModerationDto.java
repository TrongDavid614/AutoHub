package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAiModerationDto {
    private Long reviewId;
    private String displayId;
    private Integer rating;
    private String comment;
    private String classification; // CLEAN_POSITIVE, COMPLAINT_VALID, TOXIC_SPAM
    private Double confidence;
    private String reason;
    private String suggestedAction; // APPROVE, REJECT, MANUAL_CHECK
}
