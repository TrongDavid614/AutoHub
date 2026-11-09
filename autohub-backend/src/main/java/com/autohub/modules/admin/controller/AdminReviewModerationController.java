package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DanhGia;
import com.autohub.core.accessory.repository.DanhGiaRepository;
import com.autohub.core.enums.TrangThaiDanhGia;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewModerationController {

    private final DanhGiaRepository danhGiaRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllReviews(
            @RequestParam(required = false) TrangThaiDanhGia status) {
        
        List<DanhGia> list = (status != null) 
                ? danhGiaRepository.findByTrangThaiDuyet(status) 
                : danhGiaRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();
        if (!list.isEmpty()) {
            for (DanhGia d : list) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", "REV-" + d.getId());
                map.put("rawId", d.getId());
                map.put("customer", d.getNguoiDung() != null ? d.getNguoiDung().getHoTen() : "Khách hàng");
                map.put("product", d.getPhuKien() != null ? d.getPhuKien().getTenPhuKien() : "Phụ kiện ô tô");
                map.put("rating", d.getSoSao());
                map.put("comment", d.getNoiDung());
                map.put("submittedAt", d.getNgayDanhGia() != null ? d.getNgayDanhGia().toString() : "Hôm nay");
                map.put("status", d.getTrangThaiDuyet().name());
                result.add(map);
            }
        } else {
            // Dữ liệu mẫu chuẩn giao diện khi bảng chưa có dữ liệu nạp
            result.add(Map.of(
                    "id", "REV-101",
                    "rawId", 101L,
                    "customer", "Phạm Minh Quân",
                    "product", "Thảm Lót Sàn Ô Tô Tràn Viền 5D",
                    "rating", 5,
                    "comment", "Thảm lắp vừa in khoang xe VF8, không có mùi nhựa độc hại, chất liệu da êm ái rất đáng tiền!",
                    "submittedAt", "2026-10-29 11:30",
                    "status", "PENDING"
            ));
            result.add(Map.of(
                    "id", "REV-102",
                    "rawId", 102L,
                    "customer", "Hoàng Văn Bách",
                    "product", "Camera Hành Trình 4K Trước & Sau",
                    "rating", 5,
                    "comment", "Hình ảnh sắc nét ban đêm, kết nối app mượt mà, kỹ thuật viên showroom hỗ trợ lắp đặt rất nhiệt tình.",
                    "submittedAt", "2026-10-29 10:15",
                    "status", "PENDING"
            ));
            result.add(Map.of(
                    "id", "REV-103",
                    "rawId", 103L,
                    "customer", "Nguyễn Tiến Đạt",
                    "product", "Bộ Sạc Treo Tường Xe Điện 7.4kW",
                    "rating", 4,
                    "comment", "Sạc ổn định, đầy pin qua đêm khoảng 7 tiếng, dây cáp sạc hơi cứng một chút nhưng an toàn.",
                    "submittedAt", "2026-10-28 16:40",
                    "status", "APPROVED"
            ));
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đánh giá cần kiểm duyệt thành công"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<String>> updateReviewStatus(
            @PathVariable Long id,
            @RequestParam TrangThaiDanhGia status) {
        
        Optional<DanhGia> opt = danhGiaRepository.findById(id);
        if (opt.isPresent()) {
            DanhGia dg = opt.get();
            dg.setTrangThaiDuyet(status);
            danhGiaRepository.save(dg);
        }
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành " + status, "Kiểm duyệt đánh giá thành công"));
    }
}
