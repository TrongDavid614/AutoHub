package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.modules.admin.dto.AdminAiCopilotRequest;
import com.autohub.modules.admin.dto.AdminAiCopilotResponse;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisRequest;
import com.autohub.modules.admin.dto.ReviewSentimentAnalysisResponse;
import com.autohub.modules.admin.service.AdminAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/ai")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAiController {

    private final AdminAiService adminAiService;

    @PostMapping("/copilot")
    public ResponseEntity<ApiResponse<AdminAiCopilotResponse>> askCopilot(
            @Valid @RequestBody AdminAiCopilotRequest request) {
        log.info("Admin AI Copilot query received: {}", request.getQuery());
        AdminAiCopilotResponse response = adminAiService.askAdminCopilot(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Tra cứu trợ lý AI Copilot thành công"));
    }

    @PostMapping("/analyze-review")
    public ResponseEntity<ApiResponse<ReviewSentimentAnalysisResponse>> analyzeReview(
            @Valid @RequestBody ReviewSentimentAnalysisRequest request) {
        log.info("Admin AI analyze review sentiment requested");
        ReviewSentimentAnalysisResponse response = adminAiService.analyzeReviewSentiment(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Phân tích ngữ nghĩa đánh giá thành công"));
    }
}
