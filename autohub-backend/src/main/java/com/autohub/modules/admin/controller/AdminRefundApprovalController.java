package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.car.repository.XeDinhDanhRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.entity.YeuCauHoanCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.deposit.repository.YeuCauHoanCocRepository;
import com.autohub.core.enums.TrangThaiHoanCoc;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.enums.TrangThaiXeVIN;
import com.autohub.core.showroom.entity.TonKhoXe;
import com.autohub.core.showroom.repository.TonKhoXeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.text.NumberFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin/refunds")
@RequiredArgsConstructor
public class AdminRefundApprovalController {

    private final YeuCauHoanCocRepository yeuCauHoanCocRepository;
    private final PhieuDatCocRepository phieuDatCocRepository;
    private final XeDinhDanhRepository xeDinhDanhRepository;
    private final TonKhoXeRepository tonKhoXeRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRefundRequests(
            @RequestParam(required = false) String status
    ) {
        List<YeuCauHoanCoc> list = yeuCauHoanCocRepository.findAll();

        if (status != null && !status.isBlank()) {
            list = list.stream()
                    .filter(r -> r.getTrangThai() != null && r.getTrangThai().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        // Tuyệt đối không trả về mock data giả khi rỗng. Trả về đúng danh sách thật (có thể là [])
        List<Map<String, Object>> result = list.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách hồ sơ hoàn cọc thành công"));
    }

    @PostMapping("/{id}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<String>> approveRefund(@PathVariable Long id) {
        Optional<YeuCauHoanCoc> opt = yeuCauHoanCocRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy yêu cầu hoàn cọc với ID: " + id));
        }

        YeuCauHoanCoc yeuCau = opt.get();
        yeuCau.setTrangThai(TrangThaiHoanCoc.APPROVED);
        yeuCau.setNgayXuLy(LocalDateTime.now());

        PhieuDatCoc phieu = yeuCau.getPhieuDatCoc();
        if (phieu != null) {
            phieu.setTrangThai(TrangThaiPhieuCoc.REFUNDED);

            // 1. Giải phóng số khung VIN nếu đã gán cho phiếu cọc này
            if (phieu.getXeDinhDanh() != null) {
                XeDinhDanh vin = phieu.getXeDinhDanh();
                vin.setTrangThai(TrangThaiXeVIN.CO_SAN);
                xeDinhDanhRepository.save(vin);
                log.info("[Refund Approval] Đã giải phóng số khung VIN {} về trạng thái CO_SAN", vin.getSoKhungVIN());
            }

            // 2. Giải phóng suất xe trong kho về trạng thái sẵn sàng để khách khác cọc
            if (phieu.getTonKhoXe() != null) {
                TonKhoXe tonKho = phieu.getTonKhoXe();
                int currentAvailable = tonKho.getSoLuongKhaDung() != null ? tonKho.getSoLuongKhaDung() : 0;
                int currentHolding = tonKho.getSoLuongDangGiuCho() != null ? tonKho.getSoLuongDangGiuCho() : 0;

                tonKho.setSoLuongKhaDung(currentAvailable + 1);
                if (currentHolding > 0) {
                    tonKho.setSoLuongDangGiuCho(currentHolding - 1);
                }
                tonKhoXeRepository.save(tonKho);
                log.info("[Refund Approval] Đã cập nhật tồn kho ID {}: khả dụng +1, giữ chỗ -1", tonKho.getId());
            }

            phieuDatCocRepository.save(phieu);
        }

        yeuCauHoanCocRepository.save(yeuCau);
        return ResponseEntity.ok(ApiResponse.ok("APPROVED", "Phê duyệt giải ngân hoàn cọc thành công, đã giải phóng tồn kho xe về trạng thái sẵn sàng bán"));
    }

    @PostMapping("/{id}/reject")
    @Transactional
    public ResponseEntity<ApiResponse<String>> rejectRefund(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        Optional<YeuCauHoanCoc> opt = yeuCauHoanCocRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy yêu cầu hoàn cọc với ID: " + id));
        }

        YeuCauHoanCoc yeuCau = opt.get();
        yeuCau.setTrangThai(TrangThaiHoanCoc.REJECTED);
        yeuCau.setLyDoTuChoi(reason != null ? reason : "Hồ sơ không đáp ứng điều kiện hoàn cọc 72h");
        yeuCau.setNgayXuLy(LocalDateTime.now());
        yeuCauHoanCocRepository.save(yeuCau);

        return ResponseEntity.ok(ApiResponse.ok("REJECTED", "Đã từ chối yêu cầu hoàn cọc"));
    }

    private Map<String, Object> mapToDto(YeuCauHoanCoc r) {
        NumberFormat nf = NumberFormat.getInstance(new Locale("vi", "VN"));
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", r.getId());
        dto.put("docketCode", "#REF-" + String.format("%04d", r.getId()));

        PhieuDatCoc phieu = r.getPhieuDatCoc();
        if (phieu != null) {
            dto.put("depositCode", phieu.getMaPhieuCoc());
            dto.put("customerName", phieu.getNguoiDung() != null ? phieu.getNguoiDung().getHoTen() : "Khách hàng");
            dto.put("identityCardNumber", phieu.getSoCCCD() != null ? phieu.getSoCCCD() : "Đã định danh");

            // Tên xe
            String carName = "Xe ô tô AutoHub";
            if (phieu.getTonKhoXe() != null && phieu.getTonKhoXe().getPhienBanXe() != null) {
                PhienBanXe pb = phieu.getTonKhoXe().getPhienBanXe();
                String dongXe = pb.getDongXe() != null ? pb.getDongXe().getTenDongXe() : "";
                carName = (dongXe + " " + pb.getTenPhienBan()).trim();
            }
            dto.put("car", carName);
            dto.put("amount", phieu.getSoTienCoc() != null ? nf.format(phieu.getSoTienCoc()) + " ₫" : "20.000.000 ₫");

            // Kiểm tra hạn 72h
            LocalDateTime deadline = phieu.getHanGiuXe();
            if (deadline != null) {
                LocalDateTime now = LocalDateTime.now();
                if (now.isBefore(deadline)) {
                    long hoursLeft = Duration.between(now, deadline).toHours();
                    dto.put("deadlineStatus", "Trong hạn 72h (Còn " + hoursLeft + "h hiệu lực)");
                } else {
                    dto.put("deadlineStatus", "Đã quá hạn 72h");
                }
            } else {
                dto.put("deadlineStatus", "Trong hạn 72h");
            }
        } else {
            dto.put("depositCode", "#DEP-N/A");
            dto.put("customerName", "Khách hàng");
            dto.put("identityCardNumber", "N/A");
            dto.put("car", "Xe ô tô AutoHub");
            dto.put("amount", "20.000.000 ₫");
            dto.put("deadlineStatus", "Đang đối soát");
        }

        dto.put("reason", r.getLyDo() != null ? r.getLyDo() : "Ngân hàng từ chối cho vay");
        dto.put("minhChungUrl", r.getMinhChung());
        dto.put("staffVerifier", r.getNhanVienDoiSoat() != null ? r.getNhanVienDoiSoat().getHoTen() : "Chờ thẩm định");
        dto.put("status", r.getTrangThai() != null ? r.getTrangThai().name() : "PENDING");
        dto.put("rejectionReason", r.getLyDoTuChoi());
        dto.put("submittedAt", r.getNgayGui() != null ? r.getNgayGui().toString() : "");
        dto.put("processedAt", r.getNgayXuLy() != null ? r.getNgayXuLy().toString() : "");

        return dto;
    }
}
