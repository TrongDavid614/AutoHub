package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DanhMucPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.DanhMucPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer/accessories")
@RequiredArgsConstructor
public class CustomerAccessoryController {

    private final PhuKienRepository phuKienRepository;
    private final DanhMucPhuKienRepository danhMucPhuKienRepository;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<DanhMucPhuKien>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(danhMucPhuKienRepository.findAll(), "Lấy danh mục phụ kiện thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PhuKien>>> getAccessories(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<PhuKien> items = phuKienRepository.findAllWithDetails();

        if (categoryId != null) {
            items = items.stream()
                    .filter(p -> p.getDanhMucPhuKien() != null && categoryId.equals(p.getDanhMucPhuKien().getId()))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String q = search.trim().toLowerCase();
            items = items.stream()
                    .filter(p -> (p.getTenPhuKien() != null && p.getTenPhuKien().toLowerCase().contains(q))
                            || (p.getThuongHieu() != null && p.getThuongHieu().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        if (minPrice != null) {
            items = items.stream()
                    .filter(p -> p.getGiaBan() != null && p.getGiaBan().compareTo(minPrice) >= 0)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            items = items.stream()
                    .filter(p -> p.getGiaBan() != null && p.getGiaBan().compareTo(maxPrice) <= 0)
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(ApiResponse.ok(items, "Lấy danh sách phụ kiện xe thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PhuKien>> getAccessoryDetail(@PathVariable Long id) {
        return phuKienRepository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.ok(item, "Lấy chi tiết phụ kiện thành công")))
                .orElse(ResponseEntity.notFound().build());
    }
}

