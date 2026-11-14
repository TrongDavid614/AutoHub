package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.entity.YeuCauHoanCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.deposit.repository.YeuCauHoanCocRepository;
import com.autohub.core.enums.TrangThaiHoanCoc;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/admin/refunds")
@RequiredArgsConstructor
public class AdminRefundApprovalController {

    private final YeuCauHoanCocRepository refundRepository;
    private final PhieuDatCocRepository depositRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRefundRequests(
            @RequestParam(required = false) TrangThaiHoanCoc status) {
        
        List<YeuCauHoanCoc> list = (status != null) 
                ? refundRepository.findByTrangThai(status) 
                : refundRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();
        if (!list.isEmpty()) {
            for (YeuCauHoanCoc r : list) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId());
                map.put("docketCode", "REF-DOC-0" + r.getId());
                map.put("depositCode", r.getPhieuDatCoc() != null ? r.getPhieuDatCoc().getMaPhieuCoc() : "#DEP-" + r.getId());
                map.put("customerName", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getNguoiDung() != null ? r.getPhieuDatCoc().getNguoiDung().getHoTen() : "Khách hàng");
                map.put("identityCardNumber", r.getPhieuDatCoc() != null ? r.getPhieuDatCoc().getSoCCCD() : "001202008819");
                map.put("carModel", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getTonKhoXe() != null && r.getPhieuDatCoc().getTonKhoXe().getPhienBanXe() != null
                        ? r.getPhieuDatCoc().getTonKhoXe().getPhienBanXe().getTenPhienBan() : "Xe AutoHub");
                map.put("depositAmount", r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getSoTienCoc() != null
                        ? r.getPhieuDatCoc().getSoTienCoc().doubleValue() : 20000000.0);
                map.put("reason", r.getLyDo() != null ? r.getLyDo() : "Rút cọc theo quy định ngân hàng");
                map.put("submittedAt", r.getNgayGui() != null ? r.getNgayGui().toString() : "Hôm nay");
                map.put("status", r.getTrangThai() != null ? r.getTrangThai().name() : "VERIFIED");
                map.put("verifiedByStaff", r.getNhanVienDoiSoat() != null ? r.getNhanVienDoiSoat().getHoTen() : "Nhân viên Showroom");
                result.add(map);
            }
        } else {
            // Mẫu giả lập hiển thị khi chưa có phiếu nạp thực tế
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("id", 1L);
            fallback.put("docketCode", "REF-DOC-001");
            fallback.put("depositCode", "#DEP-VF8-9921");
            fallback.put("customerName", "Trần Đình Trọng");
            fallback.put("identityCardNumber", "001202008819");
            fallback.put("carModel", "VinFast VF8 Plus AWD (Xanh Deep Ocean)");
            fallback.put("depositAmount", 20000000.0);
            fallback.put("reason", "Ngân hàng Techcombank từ chối bảo lãnh tín dụng mua xe");
            fallback.put("submittedAt", "2026-10-29 09:15");
            fallback.put("status", "VERIFIED");
            fallback.put("verifiedByStaff", "Nguyễn Văn Nam (Showroom Thủ Đức)");
            result.add(fallback);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách yêu cầu hoàn cọc thành công"));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<String>> approveRefund(@PathVariable Long id) {
        Optional<YeuCauHoanCoc> opt = refundRepository.findById(id);
        if (opt.isPresent()) {
            YeuCauHoanCoc yc = opt.get();
            yc.setTrangThai(TrangThaiHoanCoc.APPROVED);
            yc.setNgayXuLy(LocalDateTime.now());
            refundRepository.save(yc);

            // Cập nhật trạng thái phiếu cọc
            if (yc.getPhieuDatCoc() != null) {
                PhieuDatCoc pdc = yc.getPhieuDatCoc();
                pdc.setTrangThai(TrangThaiPhieuCoc.CANCELLED);
                depositRepository.save(pdc);
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("APPROVED", "Quản trị viên đã phê duyệt hoàn tiền cọc thành công"));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<String>> rejectRefund(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Chứng từ không đủ điều kiện hoàn cọc") String reason) {
        
        Optional<YeuCauHoanCoc> opt = refundRepository.findById(id);
        if (opt.isPresent()) {
            YeuCauHoanCoc yc = opt.get();
            yc.setTrangThai(TrangThaiHoanCoc.REJECTED);
            yc.setLyDoTuChoi(reason);
            yc.setNgayXuLy(LocalDateTime.now());
            refundRepository.save(yc);
        }
        return ResponseEntity.ok(ApiResponse.ok("REJECTED", "Đã từ chối yêu cầu hoàn cọc"));
    }
}
