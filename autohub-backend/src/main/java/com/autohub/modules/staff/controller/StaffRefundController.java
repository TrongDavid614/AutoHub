package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.deposit.entity.YeuCauHoanCoc;
import com.autohub.core.deposit.repository.YeuCauHoanCocRepository;
import com.autohub.core.enums.TrangThaiHoanCoc;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/staff/refunds")
@RequiredArgsConstructor
public class StaffRefundController {

    private final YeuCauHoanCocRepository refundRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRefundDockets() {
        List<YeuCauHoanCoc> list = refundRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (YeuCauHoanCoc r : list) {
            String mappedStatus = "REFUND_REQUESTED";
            if (r.getTrangThai() != null && r.getTrangThai() != TrangThaiHoanCoc.PENDING) {
                mappedStatus = r.getTrangThai().name();
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", String.valueOf(r.getId()));
            map.put("docketCode", "REF-DOC-" + String.format("%02d", r.getId()));
            map.put("depositCode", r.getPhieuDatCoc() != null ? r.getPhieuDatCoc().getMaPhieuCoc() : "#DEP-" + r.getId());
            map.put("customerName", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getNguoiDung() != null
                    ? r.getPhieuDatCoc().getNguoiDung().getHoTen() : "-");
            map.put("identityCardNumber", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getSoCCCD() != null
                    ? r.getPhieuDatCoc().getSoCCCD() : "-");
            map.put("carModel", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getTonKhoXe() != null && r.getPhieuDatCoc().getTonKhoXe().getPhienBanXe() != null
                    ? r.getPhieuDatCoc().getTonKhoXe().getPhienBanXe().getTenPhienBan() : "Chưa xác định");
            map.put("depositAmount", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getSoTienCoc() != null
                    ? r.getPhieuDatCoc().getSoTienCoc().doubleValue() : 0.0);
            map.put("reason", r.getLyDo() != null ? r.getLyDo() : "");
            map.put("reasonType", r.getLoaiLyDo() != null ? r.getLoaiLyDo() : "");
            map.put("rejectionReason", r.getLyDoTuChoi());
            map.put("bankName", r.getLoaiLyDo() != null ? "Loại hồ sơ: " + r.getLoaiLyDo() : "Đối soát hoàn về chính chủ cọc");
            map.put("bankAccountNumber", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getNguoiDung() != null && r.getPhieuDatCoc().getNguoiDung().getSoDienThoai() != null
                    ? "SĐT: " + r.getPhieuDatCoc().getNguoiDung().getSoDienThoai() : "-");
            map.put("bankAccountHolder", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getNguoiDung() != null
                    ? r.getPhieuDatCoc().getNguoiDung().getHoTen() : "-");
            map.put("submittedAt", r.getNgayGui() != null ? r.getNgayGui().format(fmt) : "-");
            map.put("status", mappedStatus);
            map.put("evidenceUrls", r.getMinhChung() != null ? List.of(r.getMinhChung()) : List.of());
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy hồ sơ hoàn cọc thành công từ database"));
    }

    @PostMapping("/{id}/verify")
    @Transactional
    public ResponseEntity<ApiResponse<String>> verifyDocket(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload
    ) {
        YeuCauHoanCoc r = refundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ hoàn cọc ID: " + id));

        r.setTrangThai(TrangThaiHoanCoc.VERIFIED);
        r.setNgayXuLy(LocalDateTime.now());
        refundRepository.save(r);

        return ResponseEntity.ok(ApiResponse.ok("VERIFIED", "Đối soát và xác nhận hồ sơ hoàn cọc thành công"));
    }

    @PostMapping("/{id}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<String>> rejectDocket(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload
    ) {
        String reason = payload != null ? payload.get("reason") : null;
        if (reason == null || reason.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng nhập lý do bác bỏ yêu cầu hoàn cọc"));
        }

        YeuCauHoanCoc r = refundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ hoàn cọc ID: " + id));

        r.setTrangThai(TrangThaiHoanCoc.REJECTED);
        r.setLyDoTuChoi(reason.trim());
        r.setNgayXuLy(LocalDateTime.now());
        refundRepository.save(r);

        return ResponseEntity.ok(ApiResponse.ok("REJECTED", "Đã bác bỏ yêu cầu hoàn cọc và lưu lý do vào database"));
    }
}

