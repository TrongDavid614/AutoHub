package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DanhMucPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.DanhMucPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.car.entity.DongXe;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
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
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAccessories(
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

        List<Map<String, Object>> result = items.stream().map(this::mapAccessoryToDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phụ kiện xe thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAccessoryDetail(@PathVariable Long id) {
        return phuKienRepository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.ok(mapAccessoryToDto(item), "Lấy chi tiết phụ kiện thành công")))
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> mapAccessoryToDto(PhuKien p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("name", p.getTenPhuKien());

        String catName = "Trang trí & Tiện ích";
        Long catId = 1L;
        if (p.getDanhMucPhuKien() != null) {
            catName = p.getDanhMucPhuKien().getTenDanhMuc();
            catId = p.getDanhMucPhuKien().getId();
        }
        map.put("categoryName", catName);
        map.put("categoryId", catId);

        long price = p.getGiaBan() != null ? p.getGiaBan().longValue() : 0L;
        map.put("price", price);
        map.put("discountPrice", price > 5000000 ? price - 500000 : price);
        map.put("stockQuantity", p.getSoLuongTon() != null ? p.getSoLuongTon() : 10);
        map.put("thumbnailUrl", p.getHinhAnh() != null ? p.getHinhAnh() : "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600");
        map.put("galleryUrls", List.of(p.getHinhAnh() != null ? p.getHinhAnh() : "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600"));
        map.put("description", p.getQuyCachLapDat() != null ? p.getQuyCachLapDat() : "Phụ kiện xe điện chính hãng AutoHub bảo hành tiêu chuẩn.");
        map.put("installationGuide", p.getQuyCachLapDat());
        map.put("isGenuine", true);
        map.put("warrantyYears", 2);
        map.put("readyInShowroom", true);
        map.put("homeInstallation", true);
        map.put("specPills", List.of(p.getThuongHieu() != null ? p.getThuongHieu() : "AutoHub OEM", "Chính hãng", "Bảo hành 24T"));

        List<Map<String, Object>> compatibilities = new ArrayList<>();
        if (p.getDongXeTuongThichs() != null && !p.getDongXeTuongThichs().isEmpty()) {
            for (DongXe d : p.getDongXeTuongThichs()) {
                Map<String, Object> c = new HashMap<>();
                c.put("carModelId", d.getId());
                c.put("carModelName", d.getTenDongXe());
                c.put("note", "Chuẩn 100%");
                compatibilities.add(c);
            }
        } else {
            Map<String, Object> c = new HashMap<>();
            c.put("carModelId", 1L);
            c.put("carModelName", "AutoHub GT-e");
            c.put("note", "Chuẩn 100%");
            compatibilities.add(c);
        }
        map.put("compatibilities", compatibilities);
        return map;
    }
}


