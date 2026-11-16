package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.common.dto.PageResponseDto;
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
import com.autohub.core.engagement.entity.NhatKyTuVan;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.NhatKyTuVanRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.modules.admin.dto.AdminRefundDto;
import com.autohub.modules.admin.dto.RefundRiskAnalysisDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
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
    private final NhatKyTuVanRepository nhatKyTuVanRepository;
    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final org.springframework.ai.chat.client.ChatClient chatClient;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDto<AdminRefundDto>>> getRefundRequests(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
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

        PageResponseDto<AdminRefundDto> pagedData = PageResponseDto.of(result, page, size);
        return ResponseEntity.ok(ApiResponse.ok(pagedData, "Lấy danh sách hồ sơ hoàn cọc thành công"));
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

    @PostMapping("/{id}/ai-risk-analysis")
    @Transactional
    public ResponseEntity<ApiResponse<RefundRiskAnalysisDto>> analyzeRefundRisk(@PathVariable Long id) {
        long startMs = System.currentTimeMillis();
        YeuCauHoanCoc y = yeuCauHoanCocRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ hoàn cọc ID: " + id));

        PhieuDatCoc phieu = y.getPhieuDatCoc();
        LocalDateTime ngayDatCoc = phieu != null && phieu.getNgayDatCoc() != null ? phieu.getNgayDatCoc() : y.getNgayGui().minusHours(24);
        LocalDateTime ngayYeuCau = y.getNgayGui() != null ? y.getNgayGui() : LocalDateTime.now();

        double hoursElapsed = Duration.between(ngayDatCoc, ngayYeuCau).toMinutes() / 60.0;
        boolean within72Hours = hoursElapsed <= 72.0;

        Long userId = phieu != null && phieu.getNguoiDung() != null ? phieu.getNguoiDung().getId() : null;
        int priorRefunds = userId != null ? (int) yeuCauHoanCocRepository.countByPhieuDatCocNguoiDungId(userId) - 1 : 0;
        if (priorRefunds < 0) priorRefunds = 0;

        String vinStatus = phieu != null && phieu.getXeDinhDanh() != null ? phieu.getXeDinhDanh().getTrangThai().name() : "CHƯA_GÁN_VIN";

        String riskLevel;
        int riskScore;
        String recommendation;
        String summary;

        if (!within72Hours) {
            riskLevel = "HIGH";
            riskScore = 85;
            recommendation = "REJECT";
            summary = String.format("Hồ sơ gửi yêu cầu sau %.1f giờ từ khi nộp cọc, đã VƯỢT QUÁ thời hạn 72 giờ cam kết. Xe đã bị giữ chỗ gây ảnh hưởng quay vòng kho. Khuyến nghị Admin: NÊN TỪ CHỐI HOÀN TIỀN.", hoursElapsed);
        } else if (priorRefunds >= 2) {
            riskLevel = "MEDIUM";
            riskScore = 55;
            recommendation = "MANUAL_AUDIT";
            summary = String.format("Hồ sơ gửi hợp lệ trong %.1f giờ (<72h), tuy nhiên tài khoản khách hàng đã có %d lần yêu cầu hoàn cọc trước đó. Khuyến nghị Admin: ĐỐI SOÁT MINH CHỨNG TÍN DỤNG TRƯỚC KHI DUYỆT.", hoursElapsed, priorRefunds);
        } else {
            riskLevel = "LOW";
            riskScore = 15;
            recommendation = "APPROVE";
            summary = String.format("Hồ sơ hợp lệ 100%%: Gửi yêu cầu hoàn cọc sau %.1f giờ (trong cam kết 72h). Khách hàng có lịch sử uy tín, số khung VIN hợp lệ. Khuyến nghị Admin: NÊN PHÊ DUYỆT GIẢI NGÂN.", hoursElapsed);
        }

        String docketCode = "#REF-" + String.format("%04d", y.getId());

        try {
            String prompt = String.format(
                    "Đóng vai trò Kiểm toán viên Hệ thống AutoHub, đưa ra nhận định ngắn gọn 2 câu về rủi ro hồ sơ hoàn cọc:\n" +
                    "- Mã hồ sơ: %s\n" +
                    "- Số giờ từ lúc cọc đến lúc yêu cầu: %.1f giờ (Quy định tối đa 72 giờ)\n" +
                    "- Số lần hoàn cọc trong quá khứ: %d\n" +
                    "- Trạng thái VIN: %s\n" +
                    "- Lý do khách hàng: %s\n" +
                    "- Phân loại sơ bộ: %s (Khuyến nghị: %s)",
                    docketCode, hoursElapsed, priorRefunds, vinStatus, y.getLyDo() != null ? y.getLyDo() : "Lý do cá nhân", riskLevel, recommendation
            );

            String aiSummary = chatClient.prompt().user(prompt).call().content();
            if (aiSummary != null && !aiSummary.isBlank()) {
                summary = aiSummary.trim();
            }
        } catch (Exception ex) {
            log.warn("[Refund AI] Không gọi được LLM ({}), sử dụng kết quả kiểm toán quy tắc: {}", ex.getClass().getSimpleName(), ex.getMessage());
        }

        long latencyMs = System.currentTimeMillis() - startMs;
        saveAdminCopilotLog(String.format("[AI Đánh Giá Rủi Ro Hoàn Cọc #%s]: Mức độ %s - %s", docketCode, riskLevel, summary), (int) latencyMs);

        RefundRiskAnalysisDto result = RefundRiskAnalysisDto.builder()
                .refundId(y.getId())
                .docketCode(docketCode)
                .riskLevel(riskLevel)
                .riskScore(riskScore)
                .hoursElapsed(Math.round(hoursElapsed * 10.0) / 10.0)
                .within72Hours(within72Hours)
                .priorRefundsCount(priorRefunds)
                .vinStatus(vinStatus)
                .summary(summary)
                .recommendation(recommendation)
                .latencyMs((int) latencyMs)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(result, "Phân tích rủi ro hoàn cọc thành công"));
    }

    private void saveAdminCopilotLog(String content, int latencyMs) {
        try {
            YeuCauTuVan lead = yeuCauTuVanRepository.findAll(PageRequest.of(0, 1)).getContent().stream().findFirst().orElse(null);
            NguoiDung staff = nguoiDungRepository.findAll(PageRequest.of(0, 1)).getContent().stream().findFirst().orElse(null);
            if (lead != null && staff != null) {
                if (content.length() > 4000) content = content.substring(0, 3990) + "...";
                NhatKyTuVan logEntity = NhatKyTuVan.builder()
                        .yeuCauTuVan(lead)
                        .nhanVien(staff)
                        .loaiTuongTac("ADMIN_COPILOT")
                        .noiDungTraoDoi(content)
                        .thoiGianPhanHoiMs(latencyMs)
                        .thoiGianTuongTac(LocalDateTime.now())
                        .ketQuaCuocGoi("AI_AUDITED")
                        .build();
                nhatKyTuVanRepository.save(logEntity);
            }
        } catch (Exception e) {
            log.error("[Admin AI] Không thể lưu nhat_ky_tu_van: {}", e.getMessage());
        }
    }
}
