package com.autohub.integration.openrouter.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.integration.openrouter.dto.AiChatMessageDto;
import com.autohub.integration.openrouter.dto.AiChatRequest;
import com.autohub.integration.openrouter.service.OpenRouterAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/ai", "/v1/ai"})
@RequiredArgsConstructor
public class AiConsultantController {

    private final OpenRouterAiService aiService;

    @GetMapping("/conversation")
    public ResponseEntity<ApiResponse<List<AiChatMessageDto>>> getInitialConversation() {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getInitialMessages(), "Khởi tạo phiên tư vấn AI thành công"));
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatMessageDto>> chat(@RequestBody AiChatRequest request) {
        AiChatMessageDto response = aiService.chat(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Phản hồi từ AutoHub AI"));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAiStatus() {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getAiStatus(), "Lấy trạng thái tối ưu hóa AI thành công"));
    }

    @PostMapping("/optimize")
    public ResponseEntity<ApiResponse<Map<String, Object>>> triggerIdleOptimization() {
        aiService.optimizeModelDuringIdle();
        return ResponseEntity.ok(ApiResponse.ok(aiService.getAiStatus(), "Đã kích hoạt tối ưu hóa model thành công"));
    }
}
