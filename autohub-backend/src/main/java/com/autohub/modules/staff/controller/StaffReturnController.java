package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.YeuCauDoiTra;
import com.autohub.core.accessory.repository.YeuCauDoiTraRepository;
import com.autohub.core.enums.TrangThaiDoiTra;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/staff/returns")
@RequiredArgsConstructor
public class StaffReturnController {

    private final YeuCauDoiTraRepository returnRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReturnItems() {
        List<YeuCauDoiTra> list = returnRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (YeuCauDoiTra r : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", "RMA-0" + r.getId());
            map.put("rmaCode", "#RMA-" + (400 + r.getId()));
            map.put("originalOrderCode", r.getDonHang() != null ? r.getDonHang().getMaDonHang() : "#ORD-10892");
            map.put("customerName", r.getDonHang() != null && r.getDonHang().getHoTenNguoiNhan() != null ? r.getDonHang().getHoTenNguoiNhan() : "Khách hàng");
            map.put("customerPhone", r.getDonHang() != null && r.getDonHang().getSoDienThoaiNhan() != null ? r.getDonHang().getSoDienThoaiNhan() : "0912334556");
            map.put("accessoryName", "Phụ kiện AutoHub chính hãng");
            map.put("reason", r.getLyDo() != null ? r.getLyDo() : "Đổi trả sản phẩm");
            map.put("requestedAt", r.getNgayGui() != null ? r.getNgayGui().toString() : "Hôm qua");
            map.put("evidenceImages", r.getMinhChung() != null ? List.of(r.getMinhChung()) : List.of());
            map.put("inspectionNotes", r.getGhiChuXuLy() != null ? r.getGhiChuXuLy() : "Đã tiếp nhận vào kho Showroom");
            map.put("status", r.getTrangThai() != null ? r.getTrangThai().name() : "PENDING");
            map.put("resolution", r.getPhuongAnGiaiQuyet());
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách yêu cầu đổi trả thành công từ database"));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<String>> resolveReturnItem(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String resolution = payload.get("resolution");
        String note = payload.get("inspectionNotes");

        YeuCauDoiTra r = returnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu đổi trả ID: " + id));

        r.setTrangThai(TrangThaiDoiTra.APPROVED);
        r.setPhuongAnGiaiQuyet(resolution);
        if (note != null) {
            r.setGhiChuXuLy(note);
        }
        returnRepository.save(r);

        return ResponseEntity.ok(ApiResponse.ok("RESOLVED", "Kiểm định và xử lý yêu cầu đổi trả thành công"));
    }
}

