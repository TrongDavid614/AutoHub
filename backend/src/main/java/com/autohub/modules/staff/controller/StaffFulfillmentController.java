package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/staff/fulfillment")
@RequiredArgsConstructor
public class StaffFulfillmentController {

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFulfillmentOrders() {
        return ResponseEntity.ok(ApiResponse.ok(List.of(), "Lấy danh sách đơn hàng xuất kho đóng gói thành công"));
    }

    @PostMapping("/{orderId}/pack")
    public ResponseEntity<ApiResponse<String>> startPacking(@PathVariable String orderId) {
        return ResponseEntity.ok(ApiResponse.ok("Bắt đầu nhặt hàng đóng gói cho đơn: " + orderId));
    }

    @PostMapping("/{orderId}/handover")
    public ResponseEntity<ApiResponse<String>> handoverToCourier(
            @PathVariable String orderId,
            @RequestBody Map<String, String> courierPayload
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Đã bàn giao đơn hàng " + orderId + " cho bưu tá vận chuyển"));
    }
}
