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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/staff/deposits")
@RequiredArgsConstructor
public class StaffDepositVinController {

    private final PhieuDatCocRepository depositRepository;
    private final XeDinhDanhRepository xeDinhDanhRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDepositsForAudit() {
        List<PhieuDatCoc> list = depositRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (PhieuDatCoc d : list) {
            long remainingSeconds = 0;
            if (d.getHanGiuXe() != null) {
                remainingSeconds = Math.max(0, Duration.between(now, d.getHanGiuXe()).getSeconds());
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", String.valueOf(d.getId()));
            map.put("depositCode", d.getMaPhieuCoc() != null ? d.getMaPhieuCoc() : "#DEP-" + d.getId());
            map.put("customerName", d.getNguoiDung() != null ? d.getNguoiDung().getHoTen() : "-");
            map.put("customerPhone", d.getNguoiDung() != null && d.getNguoiDung().getSoDienThoai() != null ? d.getNguoiDung().getSoDienThoai() : "-");
            map.put("identityCardNumber", d.getSoCCCD() != null ? d.getSoCCCD() : "-");
            map.put("carModel", d.getTonKhoXe() != null && d.getTonKhoXe().getPhienBanXe() != null
                    ? d.getTonKhoXe().getPhienBanXe().getTenPhienBan() : "Chưa xác định");
            map.put("variant", d.getTonKhoXe() != null && d.getTonKhoXe().getMauSac() != null
                    ? d.getTonKhoXe().getMauSac().getTenMau() : "Tiêu chuẩn");
            map.put("depositAmount", d.getSoTienCoc() != null ? d.getSoTienCoc().doubleValue() : 0.0);
            map.put("remainingSeconds", remainingSeconds);
            map.put("assignedVin", d.getXeDinhDanh() != null ? d.getXeDinhDanh().getSoKhungVIN() : null);
            map.put("sepayTxnRef", d.getMaPhieuCoc() != null ? d.getMaPhieuCoc() : "DEP_" + d.getId());
            map.put("status", d.getTrangThai() != null ? d.getTrangThai().name() : "PAID");
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phiếu cọc cần đối soát thành công từ database"));
    }

    @GetMapping("/available-vins")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAvailableVins() {
        List<XeDinhDanh> vins = xeDinhDanhRepository.findByTrangThai(TrangThaiXeVIN.CO_SAN);
        List<Map<String, Object>> result = new ArrayList<>();

        for (XeDinhDanh v : vins) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", String.valueOf(v.getId()));
            item.put("vin", v.getSoKhungVIN());
            item.put("model", v.getTonKhoXe() != null && v.getTonKhoXe().getPhienBanXe() != null
                    ? v.getTonKhoXe().getPhienBanXe().getTenPhienBan() : "Chưa xác định");
            item.put("color", v.getTonKhoXe() != null && v.getTonKhoXe().getMauSac() != null
                    ? v.getTonKhoXe().getMauSac().getTenMau() : "Tiêu chuẩn");
            item.put("location", v.getTonKhoXe() != null && v.getTonKhoXe().getShowroom() != null
                    ? v.getTonKhoXe().getShowroom().getTenShowroom() : "Kho AutoHub");
            result.add(item);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách số khung VIN sẵn sàng trong kho thành công"));
    }

    @PostMapping("/{depositId}/assign-vin")
    @Transactional
    public ResponseEntity<ApiResponse<String>> assignVinNumber(
            @PathVariable Long depositId,
            @RequestBody Map<String, String> payload
    ) {
        String vin = payload.get("vinNumber");
        PhieuDatCoc deposit = depositRepository.findById(depositId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu cọc ID: " + depositId));

        XeDinhDanh xeDinhDanh = xeDinhDanhRepository.findBySoKhungVIN(vin)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe định danh với số khung VIN: " + vin));

        if (xeDinhDanh.getTrangThai() != TrangThaiXeVIN.CO_SAN) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Số khung VIN " + vin + " đã được giữ chỗ hoặc đã bán"));
        }

        xeDinhDanh.setTrangThai(TrangThaiXeVIN.DA_GIU_CHO);
        xeDinhDanhRepository.save(xeDinhDanh);

        deposit.setXeDinhDanh(xeDinhDanh);
        if (deposit.getTrangThai() == TrangThaiPhieuCoc.PENDING_PAYMENT) {
            deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
        }
        depositRepository.save(deposit);

        return ResponseEntity.ok(ApiResponse.ok(vin, "Gán số khung VIN thành công cho phiếu cọc 72h trong database"));
    }

    @PostMapping("/{depositId}/sign-contract")
    @Transactional
    public ResponseEntity<ApiResponse<String>> signContract(@PathVariable Long depositId) {
        PhieuDatCoc deposit = depositRepository.findById(depositId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu cọc ID: " + depositId));

        deposit.setTrangThai(TrangThaiPhieuCoc.COMPLETED);
        deposit.setThoiGianHoanTat(LocalDateTime.now());
        if (deposit.getXeDinhDanh() != null) {
            XeDinhDanh vinEntity = deposit.getXeDinhDanh();
            vinEntity.setTrangThai(TrangThaiXeVIN.DA_BAN);
            xeDinhDanhRepository.save(vinEntity);
        }
        depositRepository.save(deposit);

        return ResponseEntity.ok(ApiResponse.ok("COMPLETED", "Ký hợp đồng mua bán thành công, đã cập nhật CSDL"));
    }
}
