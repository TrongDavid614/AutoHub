package com.autohub.integration.vnpay;

import com.autohub.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/payment/vnpay")
@RequiredArgsConstructor
public class VNPayController {

    private final VNPayService vnPayService;

    @PostMapping("/deposit/{depositId}")
    public ResponseEntity<ApiResponse<VNPayPaymentResponseDto>> createDepositPayment(
            HttpServletRequest request,
            @PathVariable Long depositId
    ) {
        VNPayPaymentResponseDto response = vnPayService.createDepositPaymentUrl(request, depositId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Khởi tạo liên kết thanh toán VNPay cho phiếu cọc thành công"));
    }

    @PostMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<VNPayPaymentResponseDto>> createOrderPayment(
            HttpServletRequest request,
            @PathVariable Long orderId
    ) {
        VNPayPaymentResponseDto response = vnPayService.createOrderPaymentUrl(request, orderId);
        return ResponseEntity.ok(ApiResponse.ok(response, "Khởi tạo liên kết thanh toán VNPay cho đơn hàng thành công"));
    }

    @GetMapping("/return")
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleVNPayReturn(
            @RequestParam Map<String, String> allParams
    ) {
        log.info("Nhận callback chuyển hướng VNPay return: {}", allParams);
        Map<String, String> params = new HashMap<>(allParams);
        boolean isSuccess = vnPayService.processPaymentCallback(params);

        Map<String, Object> result = new HashMap<>();
        result.put("isSuccess", isSuccess);
        result.put("responseCode", allParams.get("vnp_ResponseCode"));
        result.put("txnRef", allParams.get("vnp_TxnRef"));
        result.put("transactionNo", allParams.get("vnp_TransactionNo"));

        String message = isSuccess ? "Giao dịch thanh toán VNPay thành công" : "Giao dịch thanh toán VNPay thất bại hoặc bị hủy";
        return ResponseEntity.ok(ApiResponse.ok(result, message));
    }

    @GetMapping("/ipn")
    public ResponseEntity<Map<String, String>> handleVNPayIPN(
            @RequestParam Map<String, String> allParams
    ) {
        log.info("Nhận IPN từ VNPay server: {}", allParams);
        Map<String, String> params = new HashMap<>(allParams);
        boolean isSuccess = vnPayService.processPaymentCallback(params);

        Map<String, String> response = new HashMap<>();
        if (isSuccess) {
            response.put("RspCode", "00");
            response.put("Message", "Confirm Success");
        } else {
            response.put("RspCode", "97");
            response.put("Message", "Invalid Checksum or Transaction Failed");
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{txnRef}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPaymentStatus(@PathVariable String txnRef) {
        var status = vnPayService.getPaymentStatus(txnRef);
        if (status == null) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> data = new HashMap<>();
        data.put("txnRef", txnRef);
        data.put("status", status.name());
        data.put("isPaid", "SUCCESS".equalsIgnoreCase(status.name()));
        return ResponseEntity.ok(ApiResponse.ok(data, "Tra cứu trạng thái thanh toán thành công"));
    }

    @PostMapping("/simulate-success/{txnRef}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> simulatePaymentSuccess(@PathVariable String txnRef) {
        boolean ok = vnPayService.simulateSuccess(txnRef);
        Map<String, Object> data = new HashMap<>();
        data.put("txnRef", txnRef);
        data.put("simulated", ok);
        if (!ok) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy mã giao dịch"));
        }
        return ResponseEntity.ok(ApiResponse.ok(data, "Giả lập thanh toán VNPay thành công!"));
    }
}

