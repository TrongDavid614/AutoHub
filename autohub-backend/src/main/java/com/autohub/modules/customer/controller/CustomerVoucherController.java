package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.pricing.entity.Voucher;
import com.autohub.core.pricing.repository.VoucherRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer/vouchers")
@RequiredArgsConstructor
public class CustomerVoucherController {

    private final VoucherRepository voucherRepository;

    @Getter
    @Setter
    public static class ValidateVoucherRequest {
        private String code;
        private BigDecimal subtotal;
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateVoucher(
            @RequestBody ValidateVoucherRequest req
    ) {
        String code = req != null && req.getCode() != null ? req.getCode().trim().toUpperCase() : "";
        BigDecimal subtotal = (req != null && req.getSubtotal() != null) ? req.getSubtotal() : BigDecimal.ZERO;

        if (code.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng nhập mã ưu đãi (voucher code)"));
        }

        Optional<Voucher> voucherOpt = voucherRepository.findByMaVoucher(code);
        if (voucherOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã ưu đãi '" + code + "' không tồn tại trong hệ thống"));
        }

        Voucher voucher = voucherOpt.get();

        if (!voucher.isDangHoatDong()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã ưu đãi '" + code + "' đã bị tạm khóa hoặc ngừng chương trình"));
        }

        if (voucher.getNgayHetHan() != null && voucher.getNgayHetHan().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã ưu đãi '" + code + "' đã hết hạn vào ngày " + voucher.getNgayHetHan()));
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (voucher.getPhanTramGiam() != null && subtotal.compareTo(BigDecimal.ZERO) > 0) {
            discount = subtotal.multiply(BigDecimal.valueOf(voucher.getPhanTramGiam()))
                    .divide(BigDecimal.valueOf(100));
        }

        if (voucher.getGiamToiDa() != null && discount.compareTo(voucher.getGiamToiDa()) > 0) {
            discount = voucher.getGiamToiDa();
        }

        Map<String, Object> data = new HashMap<>();
        data.put("valid", true);
        data.put("code", voucher.getMaVoucher());
        data.put("discountAmount", discount);
        data.put("phanTramGiam", voucher.getPhanTramGiam());
        data.put("giamToiDa", voucher.getGiamToiDa());
        data.put("expiryDate", voucher.getNgayHetHan());
        data.put("message", "Áp dụng mã ưu đãi " + voucher.getMaVoucher() + " thành công!");

        return ResponseEntity.ok(ApiResponse.ok(data, "Mã ưu đãi hợp lệ"));
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkVoucher(
            @RequestParam String code,
            @RequestParam(required = false, defaultValue = "0") BigDecimal subtotal
    ) {
        ValidateVoucherRequest req = new ValidateVoucherRequest();
        req.setCode(code);
        req.setSubtotal(subtotal);
        return validateVoucher(req);
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAvailableVouchers() {
        LocalDate today = LocalDate.now();
        List<Voucher> active = voucherRepository.findAll().stream()
                .filter(v -> v.isDangHoatDong() && (v.getNgayHetHan() == null || !v.getNgayHetHan().isBefore(today)))
                .collect(Collectors.toList());

        List<Map<String, Object>> list = active.stream().map(v -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", v.getId());
            map.put("code", v.getMaVoucher());
            map.put("percentage", v.getPhanTramGiam());
            map.put("maxDiscount", v.getGiamToiDa());
            map.put("expiryDate", v.getNgayHetHan());
            map.put("description", "Giảm " + (v.getPhanTramGiam() != null ? v.getPhanTramGiam().intValue() : 0) + "% tối đa " + (v.getGiamToiDa() != null ? v.getGiamToiDa().longValue() : 0) + "đ");
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(list, "Danh sách mã ưu đãi có thể sử dụng"));
    }
}
