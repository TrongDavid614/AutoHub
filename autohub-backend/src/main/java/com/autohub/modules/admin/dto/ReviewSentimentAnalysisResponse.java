package com.autohub.modules.admin.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewSentimentAnalysisResponse {

    private String sentiment; // "POSITIVE", "NEGATIVE", "NEUTRAL"
    private boolean isToxic;
    private double confidenceScore;
    private String recommendation; // "APPROVE", "REJECT", "FLAG_REVIEW"
}
