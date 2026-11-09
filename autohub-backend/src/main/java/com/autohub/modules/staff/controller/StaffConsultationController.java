package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/staff/consultations")
@RequiredArgsConstructor
public class StaffConsultationController {

    private final YeuCauTuVanRepository consultationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getConsultations() {
        List<YeuCauTuVan> list = consultationRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (YeuCauTuVan y : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", String.valueOf(y.getId()));
            map.put("customerName", y.getHoTen() != null ? y.getHoTen() : "Khách hàng");
            map.put("phone", y.getSoDienThoai() != null ? y.getSoDienThoai() : "");
            map.put("email", y.getEmail() != null ? y.getEmail() : "");
            map.put("interestedCar", y.getPhienBanXe() != null ? y.getPhienBanXe().getTenPhienBan() : "Chưa chọn dòng xe");
            map.put("preferredTime", y.getKhungGioTiepNhan() != null ? y.getKhungGioTiepNhan() : "09:00 - 11:30 sáng");
            map.put("notes", y.getNoiDungCanTuVan() != null ? y.getNoiDungCanTuVan() : "");
            map.put("receivedAt", y.getNgayGui() != null ? y.getNgayGui().toString() : "Hôm nay");
            map.put("status", y.getTrangThai() != null ? y.getTrangThai().name() : "PENDING");
            map.put("callHistory", y.getGhiChuCSKH() != null ? List.of(y.getGhiChuCSKH()) : List.of());
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách yêu cầu tư vấn thành công từ database"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String newStatus = payload.get("status");
        YeuCauTuVan y = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn ID: " + id));

        try {
            y.setTrangThai(TrangThaiYeuCauTuVan.valueOf(newStatus));
            consultationRepository.save(y);
            return ResponseEntity.ok(ApiResponse.ok(newStatus, "Cập nhật trạng thái tư vấn thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Trạng thái không hợp lệ: " + newStatus));
        }
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<ApiResponse<String>> addNote(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String note = payload.get("note");
        YeuCauTuVan y = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn ID: " + id));

        String currentNotes = y.getGhiChuCSKH();
        y.setGhiChuCSKH(currentNotes != null ? currentNotes + " | " + note : note);
        consultationRepository.save(y);

        return ResponseEntity.ok(ApiResponse.ok(y.getGhiChuCSKH(), "Lưu nhật ký tư vấn CRM thành công vào database"));
    }
}
