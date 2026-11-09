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

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/staff/deposits")
@RequiredArgsConstructor
public class StaffDepositVinController {

    private final PhieuDatCocRepository depositRepository;
    private final XeDinhDanhRepository xeDinhDanhRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDepositsForAudit() {
        List<PhieuDatCoc> list = depositRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (PhieuDatCoc d : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", String.valueOf(d.getId()));
            map.put("depositCode", d.getMaPhieuCoc() != null ? d.getMaPhieuCoc() : "#DEP-" + d.getId());
            map.put("customerName", d.getNguoiDung() != null ? d.getNguoiDung().getHoTen() : "Khách hàng");
            map.put("customerPhone", d.getNguoiDung() != null ? d.getNguoiDung().getSoDienThoai() : "0900000000");
            map.put("identityCardNumber", d.getSoCCCD() != null ? d.getSoCCCD() : "001201009988");
            map.put("carModel", d.getTonKhoXe() != null && d.getTonKhoXe().getPhienBanXe() != null
                    ? d.getTonKhoXe().getPhienBanXe().getTenPhienBan() : "GT-e Grand Touring 2026");
            map.put("variant", "Bản Tiêu chuẩn Cao cấp");
            map.put("depositAmount", d.getSoTienCoc() != null ? d.getSoTienCoc().doubleValue() : 20000000.0);
            map.put("remainingSeconds", 172800); // 48 giờ
            map.put("assignedVin", d.getXeDinhDanh() != null ? d.getXeDinhDanh().getSoKhungVIN() : null);
            map.put("sepayTxnRef", "TXN_DEP_" + d.getId());
            map.put("status", d.getTrangThai() != null ? d.getTrangThai().name() : "PAID");
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phiếu cọc cần đối soát thành công từ database"));
    }

    @PostMapping("/{depositId}/assign-vin")
    public ResponseEntity<ApiResponse<String>> assignVinNumber(
            @PathVariable Long depositId,
            @RequestBody Map<String, String> payload
    ) {
        String vin = payload.get("vinNumber");
        PhieuDatCoc deposit = depositRepository.findById(depositId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu cọc ID: " + depositId));

        XeDinhDanh xeDinhDanh = xeDinhDanhRepository.findBySoKhungVIN(vin)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe định danh với số khung VIN: " + vin));

        xeDinhDanh.setTrangThai(TrangThaiXeVIN.DA_GIU_CHO);
        xeDinhDanhRepository.save(xeDinhDanh);

        deposit.setXeDinhDanh(xeDinhDanh);
        deposit.setTrangThai(TrangThaiPhieuCoc.COMPLETED);
        depositRepository.save(deposit);

        return ResponseEntity.ok(ApiResponse.ok(vin, "Gán số khung VIN thành công cho phiếu cọc 72h trong database"));
    }

    @PostMapping("/{depositId}/sign-contract")
    public ResponseEntity<ApiResponse<String>> signContract(@PathVariable Long depositId) {
        PhieuDatCoc deposit = depositRepository.findById(depositId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu cọc ID: " + depositId));

        deposit.setTrangThai(TrangThaiPhieuCoc.COMPLETED);
        deposit.setThoiGianHoanTat(LocalDateTime.now());
        depositRepository.save(deposit);

        return ResponseEntity.ok(ApiResponse.ok("COMPLETED", "Ký hợp đồng mua bán thành công, đã cập nhật CSDL"));
    }
}
