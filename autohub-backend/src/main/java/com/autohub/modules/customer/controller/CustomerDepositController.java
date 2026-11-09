package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.showroom.entity.TonKhoXe;
import com.autohub.core.showroom.repository.TonKhoXeRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/customer/deposits")
@RequiredArgsConstructor
public class CustomerDepositController {

    private final PhieuDatCocRepository depositRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final TonKhoXeRepository tonKhoXeRepository;

    @Getter
    @Setter
    public static class CreateDepositRequestDto {
        private Long customerId;
        private Long phienBanId;
        private Long tonKhoId;
        private String soCCCD;
        private String hoTen;
        private String soDienThoai;
        private String showroom;
        private BigDecimal soTienCoc;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PhieuDatCoc>>> getMyDeposits(@RequestParam(required = false) Long customerId) {
        List<PhieuDatCoc> deposits = (customerId != null)
                ? depositRepository.findByNguoiDungId(customerId)
                : depositRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(deposits, "Lấy danh sách phiếu cọc xe của tôi thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PhieuDatCoc>> createDeposit(@RequestBody CreateDepositRequestDto req) {
        Long custId = req.getCustomerId() != null ? req.getCustomerId() : 5L;
        NguoiDung customer = nguoiDungRepository.findById(custId)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));

        TonKhoXe tonKho = null;
        if (req.getTonKhoId() != null) {
            tonKho = tonKhoXeRepository.findById(req.getTonKhoId()).orElse(null);
        }
        if (tonKho == null) {
            tonKho = tonKhoXeRepository.findAll().stream().findFirst().orElse(null);
        }

        String maPhieu = "DEP-" + (System.currentTimeMillis() % 1000000);
        BigDecimal amount = (req.getSoTienCoc() != null) ? req.getSoTienCoc() : BigDecimal.valueOf(20000000);
        LocalDateTime now = LocalDateTime.now();

        PhieuDatCoc deposit = PhieuDatCoc.builder()
                .maPhieuCoc(maPhieu)
                .nguoiDung(customer)
                .tonKhoXe(tonKho)
                .soCCCD(req.getSoCCCD() != null ? req.getSoCCCD() : "001201009988")
                .soTienCoc(amount)
                .ngayDatCoc(now)
                .hanThanhToan(now.plusHours(72))
                .thoiGianThanhToan(now)
                .hanGiuXe(now.plusHours(72))
                .trangThai(TrangThaiPhieuCoc.PAID)
                .build();

        PhieuDatCoc saved = depositRepository.save(deposit);
        return ResponseEntity.ok(ApiResponse.ok(saved, "Đặt cọc giữ chỗ xe thành công! Suất giữ xe có hiệu lực 72 giờ."));
    }
}
