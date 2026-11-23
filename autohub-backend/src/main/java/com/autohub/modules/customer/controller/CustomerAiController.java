package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.ai.dto.AiChatMessageDto;
import com.autohub.core.ai.dto.AiChatRequest;
import com.autohub.core.ai.service.CustomerAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping({ "/ai", "/customer/ai" })
@RequiredArgsConstructor
public class CustomerAiController {

    private final CustomerAiService customerAiService;
    private final VectorStore vectorStore; // 👈 1. Tiêm VectorStore vào Controller

    @PostMapping({ "/consult", "/chat" })
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

    /**
     * 👈 2. Endpoint Test RAG độc lập (Dành cho Postman / curl / chấm điểm thực
     * hành)
     * Ví dụ: GET http://localhost:8080/api/ai/rag/ask?q=Quy trình kiểm tra PDI 30
     * điểm là gì?
     */
    @GetMapping("/rag/ask")
    public ResponseEntity<ApiResponse<List<String>>> askRagPolicy(@RequestParam("q") String query) {
        log.info("[CustomerAiController] RAG Test Query: {}", query);
        SearchRequest request = SearchRequest.builder()
                .query(query)
                .topK(3)
                .similarityThreshold(0.4)
                .build();

        List<Document> docs = vectorStore.similaritySearch(request);
        List<String> excerpts = docs.stream().map(Document::getText).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(excerpts, "Tìm thấy " + excerpts.size() + " đoạn văn bản liên quan"));
    }
}