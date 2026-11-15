package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.entity.YeuCauDoiTra;
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
import java.util.List;

@RestController
@RequestMapping("/staff/returns")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffReturnController {

    private final YeuCauDoiTraRepository returnRepository;
    private final DonHangPhuKienRepository orderRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffReturnItemDto>>> getReturnItems() {
        List<YeuCauDoiTra> list = returnRepository.findAll();
        List<StaffReturnItemDto> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (YeuCauDoiTra r : list) {
            String mappedStatus = "RETURN_REQUESTED";
            if (r.getTrangThai() != null && r.getTrangThai() != TrangThaiDoiTra.PENDING) {
                mappedStatus = r.getTrangThai().name();
            }

            StaffReturnItemDto dto = StaffReturnItemDto.builder()
                    .id(String.valueOf(r.getId()))
                    .rmaCode("#RMA-" + String.format("%03d", r.getId()))
                    .originalOrderCode(r.getDonHang() != null && r.getDonHang().getMaDonHang() != null
                            ? r.getDonHang().getMaDonHang() : "#ORD-" + r.getId())
                    .customerName(r.getDonHang() != null && r.getDonHang().getHoTenNguoiNhan() != null
                            ? r.getDonHang().getHoTenNguoiNhan() : "Khách hàng")
                    .customerPhone(r.getDonHang() != null && r.getDonHang().getSoDienThoaiNhan() != null
                            ? r.getDonHang().getSoDienThoaiNhan() : "")
                    .accessoryName("Phụ kiện AutoHub chính hãng")
                    .reason(r.getLyDo() != null ? r.getLyDo() : "Đổi trả sản phẩm")
                    .requestedAt(r.getNgayGui() != null ? r.getNgayGui().format(fmt) : "-")
                    .evidenceImages(r.getMinhChung() != null ? List.of(r.getMinhChung()) : List.of())
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

        if ("REJECT".equalsIgnoreCase(payload.getResolution())) {
            r.setTrangThai(TrangThaiDoiTra.REJECTED);
            r.setPhuongAnGiaiQuyet(null);
            if (r.getDonHang() != null) {
                DonHangPhuKien o = r.getDonHang();
                o.setTrangThai(TrangThaiDonHang.DELIVERED);
                orderRepository.save(o);
            }
        } else {
            r.setTrangThai(TrangThaiDoiTra.APPROVED);
            if ("REFUND".equalsIgnoreCase(payload.getResolution()) || "HOAN_TIEN".equalsIgnoreCase(payload.getResolution())) {
                r.setPhuongAnGiaiQuyet("HOAN_TIEN");
            } else {
                r.setPhuongAnGiaiQuyet("DOI_HANG");
            }
            if (r.getDonHang() != null) {
                DonHangPhuKien o = r.getDonHang();
                o.setTrangThai(TrangThaiDonHang.RETURNED);
                orderRepository.save(o);
            }
        }
        if (payload.getInspectionNotes() != null) {
            r.setGhiChuXuLy(payload.getInspectionNotes());
        }
        returnRepository.save(r);

        return ResponseEntity.ok(ApiResponse.ok("RESOLVED", "Kiểm định và xử lý yêu cầu đổi trả thành công"));
    }
}
