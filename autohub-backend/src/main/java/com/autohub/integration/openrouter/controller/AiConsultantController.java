package com.autohub.integration.openrouter.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.integration.openrouter.dto.AiChatMessageDto;
import com.autohub.integration.openrouter.dto.AiChatRequest;
import com.autohub.integration.openrouter.dto.AiModelOptionDto;
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
        return ResponseEntity.ok(ApiResponse.ok(response, "Phản hồi từ OpenRouter AI"));
    }

    @GetMapping("/models")
    public ResponseEntity<ApiResponse<List<AiModelOptionDto>>> getSupportedModels() {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getSupportedModels(), "Lấy danh sách OpenRouter models thành công"));
    }

    @PostMapping("/models/switch")
    public ResponseEntity<ApiResponse<AiModelOptionDto>> switchModel(@RequestBody Map<String, String> body) {
        String modelId = body.get("modelId");
        AiModelOptionDto switched = aiService.switchModel(modelId);
        return ResponseEntity.ok(ApiResponse.ok(switched, "Đã chuyển đổi sang model " + switched.getName()));
    }
}
