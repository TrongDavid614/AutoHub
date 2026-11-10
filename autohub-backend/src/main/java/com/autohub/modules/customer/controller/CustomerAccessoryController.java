package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DanhMucPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.DanhMucPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.car.entity.DongXe;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer/accessories")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerAccessoryController {

    private final PhuKienRepository phuKienRepository;
    private final DanhMucPhuKienRepository danhMucPhuKienRepository;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCategories() {
        List<DanhMucPhuKien> list = danhMucPhuKienRepository.findAll();
        List<Map<String, Object>> result = list.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("categoryName", c.getTenDanhMuc());
            map.put("tenDanhMuc", c.getTenDanhMuc());
            map.put("name", c.getTenDanhMuc());
            map.put("slug", c.getId() == 1L ? "charging-energy" : c.getId() == 2L ? "camera-sensors" : c.getId() == 3L ? "window-films" : "floor-mats");
            map.put("count", 3);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh mục phụ kiện thành công"));
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
        }
        if (p.isDungChung() || compatibilities.isEmpty()) {
            long[] modelIds = {1L, 2L, 3L, 4L};
            String[] modelNames = {"AutoHub GT-e", "AutoHub SUV-e Flagship", "AutoHub Aero Sedan", "AutoHub City-E Compact"};
            for (int i = 0; i < modelIds.length; i++) {
                final long mId = modelIds[i];
                if (compatibilities.stream().noneMatch(c -> Objects.equals(c.get("carModelId"), mId))) {
                    Map<String, Object> c = new HashMap<>();
                    c.put("carModelId", mId);
                    c.put("carModelName", modelNames[i]);
                    c.put("note", "Chuẩn 100%");
                    compatibilities.add(c);
                }
            }
        }
        map.put("dungChung", p.isDungChung());
        map.put("compatibilities", compatibilities);
        return map;
    }
}


