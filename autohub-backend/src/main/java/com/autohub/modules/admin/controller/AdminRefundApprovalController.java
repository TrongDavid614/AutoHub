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
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.admin.dto.AdminRefundDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
@PreAuthorize("hasRole('ADMIN')")
public class AdminRefundApprovalController {

    private final YeuCauHoanCocRepository yeuCauHoanCocRepository;
    private final PhieuDatCocRepository phieuDatCocRepository;
    private final XeDinhDanhRepository xeDinhDanhRepository;
    private final TonKhoXeRepository tonKhoXeRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminRefundDto>>> getRefundRequests(
            @RequestParam(required = false) String status
    ) {
        List<YeuCauHoanCoc> list = yeuCauHoanCocRepository.findAll();

        if (status != null && !status.isBlank()) {
            list = list.stream()
                    .filter(r -> r.getTrangThai() != null && r.getTrangThai().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        // Tuyệt đối không trả về mock data giả khi rỗng. Trả về đúng danh sách thật (có thể là [])
        List<AdminRefundDto> result = list.stream()
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

        // 1. Chống duyệt trùng lặp (Double Approval Flaw / Idempotency Check)
        if (TrangThaiHoanCoc.APPROVED.equals(yeuCau.getTrangThai()) || TrangThaiHoanCoc.REFUNDED.equals(yeuCau.getTrangThai())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Hồ sơ hoàn cọc #" + id + " đã được phê duyệt giải ngân trước đó!"));
        }
        if (TrangThaiHoanCoc.REJECTED.equals(yeuCau.getTrangThai())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Hồ sơ hoàn cọc #" + id + " đã bị từ chối trước đó, không thể phê duyệt!"));
        }
        if (!TrangThaiHoanCoc.PENDING.equals(yeuCau.getTrangThai()) && !TrangThaiHoanCoc.VERIFIED.equals(yeuCau.getTrangThai())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Hồ sơ hoàn cọc #" + id + " không ở trạng thái chờ duyệt (PENDING/VERIFIED)!"));
        }

        yeuCau.setTrangThai(TrangThaiHoanCoc.APPROVED);
        yeuCau.setNgayXuLy(LocalDateTime.now());
        getAuthenticatedAdmin().ifPresent(yeuCau::setAdminPheDuyet);

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
        if (reason == null || reason.trim().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Bắt buộc phải nhập lý do khi từ chối yêu cầu hoàn cọc!"));
        }

        Optional<YeuCauHoanCoc> opt = yeuCauHoanCocRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy yêu cầu hoàn cọc với ID: " + id));
        }

        YeuCauHoanCoc yeuCau = opt.get();
        if (TrangThaiHoanCoc.APPROVED.equals(yeuCau.getTrangThai()) || TrangThaiHoanCoc.REFUNDED.equals(yeuCau.getTrangThai())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Hồ sơ hoàn cọc đã được phê duyệt giải ngân, không thể từ chối!"));
        }
        if (TrangThaiHoanCoc.REJECTED.equals(yeuCau.getTrangThai())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Hồ sơ hoàn cọc này đã bị từ chối trước đó!"));
        }

        yeuCau.setTrangThai(TrangThaiHoanCoc.REJECTED);
        yeuCau.setLyDoTuChoi(reason.trim());
        yeuCau.setNgayXuLy(LocalDateTime.now());
        getAuthenticatedAdmin().ifPresent(yeuCau::setAdminPheDuyet);

        yeuCauHoanCocRepository.save(yeuCau);

        return ResponseEntity.ok(ApiResponse.ok("REJECTED", "Đã từ chối yêu cầu hoàn cọc"));
    }

    private Optional<NguoiDung> getAuthenticatedAdmin() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getName() != null && !"anonymousUser".equals(auth.getName())) {
                return nguoiDungRepository.findByEmail(auth.getName());
            }
        } catch (Exception ignored) {}
        return Optional.empty();
    }

    private AdminRefundDto mapToDto(YeuCauHoanCoc r) {
        NumberFormat nf = NumberFormat.getInstance(new Locale("vi", "VN"));
        PhieuDatCoc phieu = r.getPhieuDatCoc();

        String depositCode = "#DEP-N/A";
        String customerName = "Khách hàng";
        String identityCard = "N/A";
        String carName = "Xe ô tô AutoHub";
        String amountStr = "20.000.000 ₫";
        String deadlineStatus = "Đang đối soát";

        if (phieu != null) {
            depositCode = phieu.getMaPhieuCoc() != null ? phieu.getMaPhieuCoc() : "#DEP-" + phieu.getId();
            if (phieu.getNguoiDung() != null && phieu.getNguoiDung().getHoTen() != null) {
                customerName = phieu.getNguoiDung().getHoTen();
            }
            if (phieu.getSoCCCD() != null) {
                identityCard = phieu.getSoCCCD();
            }
            if (phieu.getTonKhoXe() != null && phieu.getTonKhoXe().getPhienBanXe() != null) {
                PhienBanXe pb = phieu.getTonKhoXe().getPhienBanXe();
                String dongXe = pb.getDongXe() != null ? pb.getDongXe().getTenDongXe() : "";
                carName = (dongXe + " " + pb.getTenPhienBan()).trim();
            }
            if (phieu.getSoTienCoc() != null) {
                amountStr = nf.format(phieu.getSoTienCoc()) + " ₫";
            }

            LocalDateTime deadline = phieu.getHanGiuXe();
            if (deadline != null) {
                LocalDateTime now = LocalDateTime.now();
                if (now.isBefore(deadline)) {
                    long hoursLeft = Duration.between(now, deadline).toHours();
                    deadlineStatus = "Trong hạn 72h (Còn " + hoursLeft + "h hiệu lực)";
                } else {
                    deadlineStatus = "Đã quá hạn 72h";
                }
            } else {
                deadlineStatus = "Trong hạn 72h";
            }
        }

        return AdminRefundDto.builder()
                .id(r.getId())
                .docketCode("#REF-" + String.format("%04d", r.getId()))
                .depositCode(depositCode)
                .customerName(customerName)
                .identityCardNumber(identityCard)
                .car(carName)
                .amount(amountStr)
                .deadlineStatus(deadlineStatus)
                .reason(r.getLyDo() != null ? r.getLyDo() : "Ngân hàng từ chối cho vay tín dụng")
                .minhChungUrl(r.getMinhChung())
                .staffVerifier(r.getNhanVienDoiSoat() != null ? r.getNhanVienDoiSoat().getHoTen() : "Chờ thẩm định")
                .status(r.getTrangThai() != null ? r.getTrangThai().name() : "PENDING")
                .rejectionReason(r.getLyDoTuChoi())
                .submittedAt(r.getNgayGui() != null ? r.getNgayGui().toString() : "")
                .processedAt(r.getNgayXuLy() != null ? r.getNgayXuLy().toString() : "")
                .build();
    }
}
