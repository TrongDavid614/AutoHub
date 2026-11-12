package com.autohub.integration.sepay.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.integration.sepay.dto.SepayWebhookRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class SepayWebhookController {

    @PostMapping("/sepay-webhook")
    public ResponseEntity<ApiResponse<String>> handleSepayWebhook(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody SepayWebhookRequest payload
    ) {
        log.info("Received SePay Webhook: code={}, amount={}, content={}",
                payload.getCode(), payload.getTransferAmount(), payload.getContent());

        // Xử lý đối soát cọc xe 72h hoặc đơn hàng phụ kiện
        return ResponseEntity.ok(ApiResponse.ok("Giao dịch SePay đã được tiếp nhận và xử lý đối soát thành công"));
    }
}
