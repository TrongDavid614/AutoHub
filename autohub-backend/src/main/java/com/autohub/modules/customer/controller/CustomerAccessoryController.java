package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DanhMucPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.DanhMucPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.car.entity.DongXe;
import lombok.*;
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

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccessoryCategoryDto {
        private Long id;
        private String categoryName;
        private String tenDanhMuc;
        private String name;
        private String slug;
        private Integer count;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccessoryCompatibilityDto {
        private Long carModelId;
        private String carModelName;
        private String note;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccessoryResponseDto {
        private Long id;
        private String name;
        private Long categoryId;
        private String categoryName;
        private String tenDanhMuc;
        private Long price;
        private Long discountPrice;
        private Integer stockQuantity;
        private String thumbnailUrl;
        private List<String> galleryUrls;
        private List<String> images;
        private String description;
        private String installationGuide;
        private Boolean isGenuine;
        private Integer warrantyYears;
        private Boolean readyInShowroom;
        private Boolean homeInstallation;
        private List<String> specPills;
        private List<AccessoryCompatibilityDto> compatibilities;
        private List<AccessoryCompatibilityDto> compatibility;
        private Boolean dungChung;
        private Boolean isUniversal;
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<AccessoryCategoryDto>>> getCategories() {
        List<DanhMucPhuKien> list = danhMucPhuKienRepository.findAll();
        List<AccessoryCategoryDto> result = list.stream().map(c -> {
            String slug = c.getId() == 1L ? "charging-energy" : c.getId() == 2L ? "camera-sensors" : c.getId() == 3L ? "window-films" : "floor-mats";
            return AccessoryCategoryDto.builder()
                    .id(c.getId())
                    .categoryName(c.getTenDanhMuc())
                    .tenDanhMuc(c.getTenDanhMuc())
                    .name(c.getTenDanhMuc())
                    .slug(slug)
                    .count(3)
                    .build();
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh mục phụ kiện thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccessoryResponseDto>>> getAccessories(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<PhuKien> items = phuKienRepository.findAll();

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

        List<AccessoryResponseDto> result = items.stream().map(this::mapAccessoryToDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phụ kiện xe thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccessoryResponseDto>> getAccessoryDetail(@PathVariable Long id) {
        return phuKienRepository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.ok(mapAccessoryToDto(item), "Lấy chi tiết phụ kiện thành công")))
                .orElse(ResponseEntity.notFound().build());
    }

    private AccessoryResponseDto mapAccessoryToDto(PhuKien p) {
        String catName = "Trang trí & Tiện ích";
        Long catId = 1L;
        if (p.getDanhMucPhuKien() != null) {
            catName = p.getDanhMucPhuKien().getTenDanhMuc();
            catId = p.getDanhMucPhuKien().getId();
        }

        long price = p.getGiaBan() != null ? p.getGiaBan().longValue() : 0L;
        long discountPrice = price > 5000000 ? price - 500000 : price;
        int stockQuantity = p.getSoLuongTon() != null ? p.getSoLuongTon() : 10;
        String thumbnail = p.getHinhAnh() != null ? p.getHinhAnh() : "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600";
        List<String> gallery = List.of(thumbnail);
        String desc = p.getQuyCachLapDat() != null ? p.getQuyCachLapDat() : "Phụ kiện xe điện chính hãng AutoHub bảo hành tiêu chuẩn.";

        List<AccessoryCompatibilityDto> compatibilities = new ArrayList<>();
        if (p.getDongXes() != null && !p.getDongXes().isEmpty()) {
            for (DongXe d : p.getDongXes()) {
                compatibilities.add(AccessoryCompatibilityDto.builder()
                        .carModelId(d.getId())
                        .carModelName(d.getTenDongXe())
                        .note("Chuẩn 100%")
                        .build());
            }
        }
        if (p.isDungChung() || compatibilities.isEmpty()) {
            long[] modelIds = {1L, 2L, 3L, 4L};
            String[] modelNames = {"AutoHub GT-e", "AutoHub SUV-e Flagship", "AutoHub Aero Sedan", "AutoHub City-E Compact"};
            for (int i = 0; i < modelIds.length; i++) {
                final long mId = modelIds[i];
                if (compatibilities.stream().noneMatch(c -> Objects.equals(c.getCarModelId(), mId))) {
                    compatibilities.add(AccessoryCompatibilityDto.builder()
                            .carModelId(mId)
                            .carModelName(modelNames[i])
                            .note("Chuẩn 100%")
                            .build());
                }
            }
        }

        return AccessoryResponseDto.builder()
                .id(p.getId())
                .name(p.getTenPhuKien())
                .categoryId(catId)
                .categoryName(catName)
                .tenDanhMuc(catName)
                .price(price)
                .discountPrice(discountPrice)
                .stockQuantity(stockQuantity)
                .thumbnailUrl(thumbnail)
                .galleryUrls(gallery)
                .images(gallery)
                .description(desc)
                .installationGuide(p.getQuyCachLapDat())
                .isGenuine(true)
                .warrantyYears(2)
                .readyInShowroom(true)
                .homeInstallation(true)
                .specPills(List.of(p.getThuongHieu() != null ? p.getThuongHieu() : "AutoHub OEM", "Chính hãng", "Bảo hành 24T"))
                .compatibilities(compatibilities)
                .compatibility(compatibilities)
                .dungChung(p.isDungChung())
                .isUniversal(p.isDungChung())
                .build();
    }
}
