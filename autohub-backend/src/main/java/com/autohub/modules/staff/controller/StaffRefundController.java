package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.deposit.entity.YeuCauHoanCoc;
import com.autohub.core.deposit.repository.YeuCauHoanCocRepository;
import com.autohub.core.enums.TrangThaiHoanCoc;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/staff/refunds")
@RequiredArgsConstructor
public class StaffRefundController {

    private final YeuCauHoanCocRepository refundRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRefundDockets() {
        List<YeuCauHoanCoc> list = refundRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (YeuCauHoanCoc r : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", "REF-DOC-0" + r.getId());
            map.put("depositCode", r.getPhieuDatCoc() != null ? r.getPhieuDatCoc().getMaPhieuCoc() : "#DEP-" + r.getId());
            map.put("customerName", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getNguoiDung() != null ? r.getPhieuDatCoc().getNguoiDung().getHoTen() : "Khách hàng");
            map.put("identityCardNumber", r.getPhieuDatCoc() != null ? r.getPhieuDatCoc().getSoCCCD() : "001202008819");
            map.put("carModel", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getTonKhoXe() != null && r.getPhieuDatCoc().getTonKhoXe().getPhienBanXe() != null
                    ? r.getPhieuDatCoc().getTonKhoXe().getPhienBanXe().getTenPhienBan() : "Xe AutoHub");
            map.put("depositAmount", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getSoTienCoc() != null
                    ? r.getPhieuDatCoc().getSoTienCoc().doubleValue() : 20000000.0);
            map.put("reason", r.getLyDo() != null ? r.getLyDo() : "Rút cọc theo quy định");
            map.put("bankName", "Vietcombank - Chi nhánh TP. Hồ Chí Minh");
            map.put("bankAccountNumber", "0071001234567");
            map.put("bankAccountHolder", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getNguoiDung() != null ? r.getPhieuDatCoc().getNguoiDung().getHoTen() : "KHÁCH HÀNG");
            map.put("submittedAt", r.getNgayGui() != null ? r.getNgayGui().toString() : "Hôm nay");
            map.put("status", r.getTrangThai() != null ? r.getTrangThai().name() : "PENDING");
            map.put("evidenceUrls", r.getMinhChung() != null ? List.of(r.getMinhChung()) : List.of());
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy hồ sơ hoàn cọc thành công từ database"));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<String>> verifyDocket(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload
    ) {
        YeuCauHoanCoc r = refundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ hoàn cọc ID: " + id));

        r.setTrangThai(TrangThaiHoanCoc.APPROVED);
        r.setNgayXuLy(LocalDateTime.now());
        refundRepository.save(r);

        return ResponseEntity.ok(ApiResponse.ok("VERIFIED", "Đối soát và xác nhận hồ sơ hoàn cọc thành công"));
    }
}

