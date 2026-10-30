package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.car.repository.XeDinhDanhRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.enums.TrangThaiXeVIN;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/staff/deposits")
@RequiredArgsConstructor
public class StaffDepositVinController {

    private final PhieuDatCocRepository depositRepository;
    private final XeDinhDanhRepository xeDinhDanhRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PhieuDatCoc>>> getDepositsForAudit() {
        return ResponseEntity.ok(ApiResponse.ok(depositRepository.findAll(), "Lấy danh sách phiếu cọc cần đối soát"));
    }

    @PostMapping("/{depositId}/assign-vin")
    public ResponseEntity<ApiResponse<PhieuDatCoc>> assignVinNumber(
            @PathVariable Long depositId,
            @RequestBody Map<String, String> payload
    ) {
        String vin = payload.get("vinNumber");
        PhieuDatCoc deposit = depositRepository.findById(depositId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu cọc ID: " + depositId));

        XeDinhDanh xeDinhDanh = xeDinhDanhRepository.findById(vin)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe định danh với số khung VIN: " + vin));

        xeDinhDanh.setTrangThai(TrangThaiXeVIN.DA_GIU_CHO);
        xeDinhDanhRepository.save(xeDinhDanh);

        deposit.setXeDinhDanh(xeDinhDanh);
        deposit.setTrangThai(TrangThaiPhieuCoc.COMPLETED);
        depositRepository.save(deposit);

        return ResponseEntity.ok(ApiResponse.ok(deposit, "Gán số khung VIN thành công cho phiếu cọc 72h"));
    }
}
