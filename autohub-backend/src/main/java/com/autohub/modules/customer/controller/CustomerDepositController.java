package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer/deposits")
@RequiredArgsConstructor
public class CustomerDepositController {

    private final PhieuDatCocRepository depositRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PhieuDatCoc>>> getMyDeposits() {
        List<PhieuDatCoc> deposits = depositRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(deposits, "Lấy danh sách phiếu cọc xe của tôi thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PhieuDatCoc>> createDeposit(@RequestBody PhieuDatCoc request) {
        PhieuDatCoc saved = depositRepository.save(request);
        return ResponseEntity.ok(ApiResponse.ok(saved, "Tạo phiếu cọc giữ chỗ 72h thành công. Vui lòng chuyển khoản SePay để kích hoạt."));
    }
}
