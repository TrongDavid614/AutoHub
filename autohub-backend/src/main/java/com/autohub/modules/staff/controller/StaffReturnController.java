package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.entity.YeuCauDoiTra;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.accessory.repository.YeuCauDoiTraRepository;
import com.autohub.core.enums.TrangThaiDoiTra;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.modules.staff.dto.ResolveReturnRequest;
import com.autohub.modules.staff.dto.StaffReturnItemDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/staff/returns")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffReturnController {

    private final YeuCauDoiTraRepository returnRepository;
    private final DonHangPhuKienRepository orderRepository;
    private final ChiTietDonHangRepository orderItemRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffReturnItemDto>>> getReturnItems() {
        List<YeuCauDoiTra> list = new ArrayList<>(returnRepository.findAll());
        list.sort(Comparator.comparing(
                YeuCauDoiTra::getNgayGui,
                Comparator.nullsLast(Comparator.reverseOrder())
        ).thenComparing(YeuCauDoiTra::getId, Comparator.reverseOrder()));

        List<StaffReturnItemDto> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (YeuCauDoiTra r : list) {
            String mappedStatus = "RETURN_REQUESTED";
            if (r.getTrangThai() != null && r.getTrangThai() != TrangThaiDoiTra.PENDING) {
                mappedStatus = r.getTrangThai().name();
            }

            String accessoryName = resolveAccessoryName(r);

            StaffReturnItemDto dto = StaffReturnItemDto.builder()
                    .id(String.valueOf(r.getId()))
                    .rmaCode("#RMA-" + String.format("%03d", r.getId()))
                    .originalOrderCode(r.getDonHang() != null && r.getDonHang().getMaDonHang() != null
                            ? r.getDonHang().getMaDonHang() : "#ORD-" + r.getId())
                    .customerName(r.getDonHang() != null && r.getDonHang().getHoTenNguoiNhan() != null
                            ? r.getDonHang().getHoTenNguoiNhan() : "Khách hàng")
                    .customerPhone(r.getDonHang() != null && r.getDonHang().getSoDienThoaiNhan() != null
                            ? r.getDonHang().getSoDienThoaiNhan() : "")
                    .accessoryName(accessoryName)
                    .quantity(r.getSoLuongDoiTra() != null ? r.getSoLuongDoiTra() : 1)
                    .desiredResolution(r.getPhuongAnMongMuon())
                    .newTrackingNumber(r.getMaVanDonMoi())
                    .reason(r.getLyDo() != null ? r.getLyDo() : "Đổi trả sản phẩm")
                    .requestedAt(r.getNgayGui() != null ? r.getNgayGui().format(fmt) : "-")
                    .evidenceImages(r.getMinhChung() != null && !r.getMinhChung().isBlank()
                            ? List.of(r.getMinhChung()) : List.of())
                    .inspectionNotes(r.getGhiChuXuLy() != null ? r.getGhiChuXuLy() : "")
                    .status(mappedStatus)
                    .resolution(r.getPhuongAnGiaiQuyet())
                    .build();
            result.add(dto);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách yêu cầu đổi trả thành công từ database"));
    }

    @PostMapping("/{id}/resolve")
    @Transactional
    public ResponseEntity<ApiResponse<String>> resolveReturnItem(
            @PathVariable Long id,
            @Valid @RequestBody ResolveReturnRequest payload
    ) {
        YeuCauDoiTra r = returnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu đổi trả ID: " + id));

        if (r.getTrangThai() == TrangThaiDoiTra.APPROVED
                || r.getTrangThai() == TrangThaiDoiTra.REJECTED
                || r.getTrangThai() == TrangThaiDoiTra.COMPLETED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Yêu cầu đổi trả này đã được xử lý trước đó"));
        }

        String newStatus;
        if ("REJECT".equalsIgnoreCase(payload.getResolution())) {
            r.setTrangThai(TrangThaiDoiTra.REJECTED);
            r.setPhuongAnGiaiQuyet(null);
            newStatus = TrangThaiDoiTra.REJECTED.name();
            if (r.getDonHang() != null) {
                DonHangPhuKien o = r.getDonHang();
                o.setTrangThai(TrangThaiDonHang.DELIVERED);
                orderRepository.save(o);
            }
        } else {
            r.setTrangThai(TrangThaiDoiTra.APPROVED);
            newStatus = TrangThaiDoiTra.APPROVED.name();
            if ("REFUND".equalsIgnoreCase(payload.getResolution())
                    || "REFUND_MONEY".equalsIgnoreCase(payload.getResolution())
                    || "HOAN_TIEN".equalsIgnoreCase(payload.getResolution())) {
                r.setPhuongAnGiaiQuyet("HOAN_TIEN");
            } else {
                r.setPhuongAnGiaiQuyet("DOI_HANG");
            }
            if (payload.getNewTrackingNumber() != null && !payload.getNewTrackingNumber().isBlank()) {
                r.setMaVanDonMoi(payload.getNewTrackingNumber().trim());
            }
            if (r.getDonHang() != null) {
                DonHangPhuKien o = r.getDonHang();
                o.setTrangThai(TrangThaiDonHang.RETURNED);
                orderRepository.save(o);
            }
        }
        if (payload.getInspectionNotes() != null && !payload.getInspectionNotes().isBlank()) {
            r.setGhiChuXuLy(payload.getInspectionNotes().trim());
        }
        returnRepository.save(r);

        return ResponseEntity.ok(ApiResponse.ok(newStatus, "Kiểm định và xử lý yêu cầu đổi trả thành công"));
    }

    @PostMapping("/{id}/complete")
    @Transactional
    public ResponseEntity<ApiResponse<String>> completeReturnItem(
            @PathVariable Long id,
            @RequestBody(required = false) ResolveReturnRequest payload
    ) {
        YeuCauDoiTra r = returnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu đổi trả ID: " + id));

        if (r.getTrangThai() != TrangThaiDoiTra.APPROVED) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Chỉ có thể hoàn tất yêu cầu đổi trả đang ở trạng thái Đã tiếp nhận (APPROVED)")
            );
        }

        r.setTrangThai(TrangThaiDoiTra.COMPLETED);
        if (payload != null) {
            if (payload.getInspectionNotes() != null && !payload.getInspectionNotes().isBlank()) {
                r.setGhiChuXuLy(payload.getInspectionNotes().trim());
            }
            if (payload.getNewTrackingNumber() != null && !payload.getNewTrackingNumber().isBlank()) {
                r.setMaVanDonMoi(payload.getNewTrackingNumber().trim());
            }
        }
        returnRepository.save(r);

        return ResponseEntity.ok(ApiResponse.ok(
                TrangThaiDoiTra.COMPLETED.name(),
                "Đã hoàn tất xử lý yêu cầu đổi trả #RMA-" + String.format("%03d", r.getId())
        ));
    }

    private String resolveAccessoryName(YeuCauDoiTra r) {
        if (r.getChiTietDonHang() != null && r.getChiTietDonHang().getPhuKien() != null) {
            return r.getChiTietDonHang().getPhuKien().getTenPhuKien();
        }
        if (r.getDonHang() != null) {
            List<ChiTietDonHang> items = orderItemRepository.findByDonHangId(r.getDonHang().getId());
            if (!items.isEmpty() && items.get(0).getPhuKien() != null) {
                return items.get(0).getPhuKien().getTenPhuKien();
            }
        }
        return "Phụ kiện đơn hàng " + (r.getDonHang() != null ? r.getDonHang().getMaDonHang() : "");
    }
}
