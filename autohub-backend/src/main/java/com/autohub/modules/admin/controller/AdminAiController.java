package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.modules.admin.service.AdminAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/ai")
@RequiredArgsConstructor
public class AdminAiController {

    private final AdminAiService adminAiService;

    @PostMapping("/copilot")
    public ResponseEntity<ApiResponse<Map<String, String>>> askCopilot(@RequestBody Map<String, String> payload) {
        String query = payload.getOrDefault("query", "");
        String answer = adminAiService.askAdminCopilot(query);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("answer", answer), "Phản hồi từ Admin Copilot thành công"));
    }

    @PostMapping("/analyze-review")
    public ResponseEntity<ApiResponse<Map<String, Object>>> analyzeReview(@RequestBody Map<String, String> payload) {
        String content = payload.getOrDefault("content", "");
        Map<String, Object> analysis = adminAiService.analyzeReviewSentiment(content);
        return ResponseEntity.ok(ApiResponse.ok(analysis, "Phân tích ngữ nghĩa đánh giá thành công"));
    }
}
