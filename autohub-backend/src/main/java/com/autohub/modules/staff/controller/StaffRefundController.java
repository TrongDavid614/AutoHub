package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.car.repository.XeDinhDanhRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.entity.YeuCauHoanCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.deposit.repository.YeuCauHoanCocRepository;
import com.autohub.core.enums.TrangThaiHoanCoc;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.enums.TrangThaiXeVIN;
import com.autohub.modules.staff.dto.RejectDocketRequest;
import com.autohub.modules.staff.dto.StaffRefundDocketDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/staff/refunds")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffRefundController {

        private final YeuCauHoanCocRepository refundRepository;
        private final PhieuDatCocRepository depositRepository;
        private final XeDinhDanhRepository xeDinhDanhRepository;

        @GetMapping
        @Transactional(readOnly = true)
        public ResponseEntity<ApiResponse<List<StaffRefundDocketDto>>> getRefundDockets() {
                List<YeuCauHoanCoc> list = refundRepository.findAll();
                List<StaffRefundDocketDto> result = new ArrayList<>();
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

                for (YeuCauHoanCoc r : list) {
                        String mappedStatus = "REFUND_REQUESTED";
                        if (r.getTrangThai() != null && r.getTrangThai() != TrangThaiHoanCoc.PENDING) {
                                mappedStatus = r.getTrangThai().name();
                        }

                        StaffRefundDocketDto dto = StaffRefundDocketDto.builder()
                                        .id(String.valueOf(r.getId()))
                                        .docketCode("REF-DOC-" + String.format("%02d", r.getId()))
                                        .depositCode(r.getPhieuDatCoc() != null ? r.getPhieuDatCoc().getMaPhieuCoc()
                                                        : "#DEP-" + r.getId())
                                        .customerName(r.getPhieuDatCoc() != null
                                                        && r.getPhieuDatCoc().getNguoiDung() != null
                                                                        ? r.getPhieuDatCoc().getNguoiDung().getHoTen()
                                                                        : "-")
                                        .identityCardNumber(r.getPhieuDatCoc() != null
                                                        && r.getPhieuDatCoc().getSoCCCD() != null
                                                                        ? r.getPhieuDatCoc().getSoCCCD()
                                                                        : "-")
                                        .carModel(r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getTonKhoXe() != null
                                                        && r.getPhieuDatCoc().getTonKhoXe().getPhienBanXe() != null
                                                                        ? r.getPhieuDatCoc().getTonKhoXe()
                                                                                        .getPhienBanXe()
                                                                                        .getTenPhienBan()
                                                                        : "Chưa xác định")
                                        .depositAmount(r.getPhieuDatCoc() != null
                                                        && r.getPhieuDatCoc().getSoTienCoc() != null
                                                                        ? r.getPhieuDatCoc().getSoTienCoc()
                                                                                        .doubleValue()
                                                                        : 0.0)
                                        .reason(r.getLyDo() != null ? r.getLyDo() : "")
                                        .reasonType(r.getLoaiLyDo() != null ? r.getLoaiLyDo() : "")
                                        .rejectionReason(r.getLyDoTuChoi())
                                        .bankName(r.getLoaiLyDo() != null ? "Loại hồ sơ: " + r.getLoaiLyDo()
                                                        : "Đối soát hoàn về chính chủ cọc")
                                        .bankAccountNumber(r.getPhieuDatCoc() != null
                                                        && r.getPhieuDatCoc().getNguoiDung() != null
                                                        && r.getPhieuDatCoc().getNguoiDung().getSoDienThoai() != null
                                                                        ? "SĐT: " + r.getPhieuDatCoc().getNguoiDung()
                                                                                        .getSoDienThoai()
                                                                        : "-")
                                        .bankAccountHolder(r.getPhieuDatCoc() != null
                                                        && r.getPhieuDatCoc().getNguoiDung() != null
                                                                        ? r.getPhieuDatCoc().getNguoiDung().getHoTen()
                                                                        : "-")
                                        .submittedAt(r.getNgayGui() != null ? r.getNgayGui().format(fmt) : "-")
                                        .status(mappedStatus)
                                        .evidenceUrls(r.getMinhChung() != null ? List.of(r.getMinhChung()) : List.of())
                                        .build();
                        result.add(dto);
                }

                return ResponseEntity.ok(ApiResponse.ok(result, "Lấy hồ sơ hoàn cọc thành công từ database"));
        }

        @PostMapping("/{id}/verify")
        @Transactional
        public ResponseEntity<ApiResponse<String>> verifyDocket(@PathVariable Long id) {
                YeuCauHoanCoc r = refundRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ hoàn cọc ID: " + id));

                if (r.getTrangThai() != TrangThaiHoanCoc.PENDING) {
                        return ResponseEntity.badRequest().body(
                                        ApiResponse.error("Hồ sơ hoàn cọc phải ở trạng thái chờ duyệt (PENDING)"));
                }

                r.setTrangThai(TrangThaiHoanCoc.VERIFIED);
                r.setNgayXuLy(LocalDateTime.now());
                refundRepository.save(r);

                // Đồng bộ cập nhật trạng thái phiếu cọc tiếp tục chuyển sang Admin phê duyệt giải ngân (UC40)
                if (r.getPhieuDatCoc() != null) {
                        PhieuDatCoc dep = r.getPhieuDatCoc();
                        dep.setTrangThai(TrangThaiPhieuCoc.REFUND_REQUESTED);
                        depositRepository.save(dep);
                }

                return ResponseEntity.ok(ApiResponse.ok("VERIFIED", "Đối soát và xác nhận hồ sơ hoàn cọc thành công, đã chuyển tiếp hồ sơ lên Admin phê duyệt giải ngân"));
        }

        @PostMapping("/{id}/reject")
        @Transactional
        public ResponseEntity<ApiResponse<String>> rejectDocket(
                        @PathVariable Long id,
                        @Valid @RequestBody RejectDocketRequest payload) {
                String reason = payload.getReason();

                YeuCauHoanCoc r = refundRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ hoàn cọc ID: " + id));

                if (r.getTrangThai() != TrangThaiHoanCoc.PENDING) {
                        return ResponseEntity.badRequest().body(
                                        ApiResponse.error("Hồ sơ hoàn cọc phải ở trạng thái chờ duyệt (PENDING)"));
                }

                r.setTrangThai(TrangThaiHoanCoc.REJECTED);
                r.setLyDoTuChoi(reason.trim());
                r.setNgayXuLy(LocalDateTime.now());
                refundRepository.save(r);

                // Nếu từ chối hoàn cọc, hoàn trả trạng thái phiếu cọc về PAID
                if (r.getPhieuDatCoc() != null && r.getPhieuDatCoc().getTrangThai() == TrangThaiPhieuCoc.REFUND_REQUESTED) {
                        PhieuDatCoc dep = r.getPhieuDatCoc();
                        dep.setTrangThai(TrangThaiPhieuCoc.PAID);
                        depositRepository.save(dep);
                }

                return ResponseEntity
                                .ok(ApiResponse.ok("REJECTED", "Đã bác bỏ yêu cầu hoàn cọc và lưu lý do vào database"));
        }
}
