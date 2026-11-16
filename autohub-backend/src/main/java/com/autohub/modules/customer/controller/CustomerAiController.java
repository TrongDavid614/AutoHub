package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.ai.dto.AiChatMessageDto;
import com.autohub.core.ai.dto.AiChatRequest;
import com.autohub.core.ai.service.CustomerAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping({"/ai", "/customer/ai"})
@RequiredArgsConstructor
public class CustomerAiController {

    private final CustomerAiService customerAiService;

    @PostMapping({"/consult", "/chat"})
    public ResponseEntity<ApiResponse<AiChatMessageDto>> consult(@Valid @RequestBody AiChatRequest request) {
        log.info("[CustomerAiController] Nhận yêu cầu tư vấn AI: {}", request.getPrompt());
        AiChatMessageDto response = customerAiService.processUserChat(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Tư vấn AI thành công"));
    }

    @GetMapping("/conversation")
    public ResponseEntity<ApiResponse<List<AiChatMessageDto>>> getInitialConversation() {
        List<AiChatMessageDto> messages = customerAiService.getInitialConversation();
        return ResponseEntity.ok(ApiResponse.ok(messages, "Khởi tạo cuộc hội thoại thành công"));
    }
}
