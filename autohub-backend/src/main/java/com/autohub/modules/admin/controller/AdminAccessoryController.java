package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DanhMucPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.DanhMucPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.modules.admin.dto.AdminAccessoryDto;
import com.autohub.modules.admin.dto.CreateAccessoryRequest;
import com.autohub.modules.admin.dto.UpdateAccessoryRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin/accessories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAccessoryController {

    private final PhuKienRepository phuKienRepository;
    private final DanhMucPhuKienRepository danhMucPhuKienRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminAccessoryDto>>> getAllAccessories(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean active) {

        List<PhuKien> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = phuKienRepository.findByTenPhuKienContainingIgnoreCaseOrderByIdDesc(keyword.trim());
        } else if (categoryId != null) {
            list = phuKienRepository.findByDanhMucPhuKienId(categoryId);
        } else {
            list = phuKienRepository.findAllByOrderByIdDesc();
        }

        if (active != null) {
            list = list.stream()
                    .filter(p -> p.isDangHoatDong() == active)
                    .collect(Collectors.toList());
        }

        List<AdminAccessoryDto> dtos = list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtos, "Tải danh sách phụ kiện thành công"));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<DanhMucPhuKien>>> getCategories() {
        List<DanhMucPhuKien> categories = danhMucPhuKienRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(categories, "Tải danh mục phụ kiện thành công"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<AdminAccessoryDto>> createAccessory(
            @Valid @RequestBody CreateAccessoryRequest request) {

        if (request.getPrice() != null && request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn giá bán phải lớn hơn 0"));
        }
        if (request.getStock() != null && request.getStock() < 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Số lượng tồn kho không được âm"));
        }

        DanhMucPhuKien category = danhMucPhuKienRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục phụ kiện với ID: " + request.getCategoryId()));

        PhuKien phuKien = PhuKien.builder()
                .danhMucPhuKien(category)
                .tenPhuKien(request.getName().trim())
                .thuongHieu(request.getBrand() != null ? request.getBrand().trim() : "AutoHub Genuine")
                .giaBan(request.getPrice())
                .soLuongTon(request.getStock())
                .quyCachLapDat(request.getInstallationSpec())
                .hinhAnh(request.getImageUrl())
                .dungChung(request.getUniversal() != null ? request.getUniversal() : true)
                .dangHoatDong(true)
                .build();

        phuKien = phuKienRepository.save(phuKien);
        log.info("Admin created new accessory: #{} {}", phuKien.getId(), phuKien.getTenPhuKien());

        return ResponseEntity.ok(ApiResponse.ok(toDto(phuKien), "Thêm phụ kiện mới vào kho thành công"));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<AdminAccessoryDto>> updateAccessory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAccessoryRequest request) {

        PhuKien phuKien = phuKienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phụ kiện với ID: " + id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            phuKien.setTenPhuKien(request.getName().trim());
        }
        if (request.getCategoryId() != null) {
            DanhMucPhuKien cat = danhMucPhuKienRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Danh mục phụ kiện không hợp lệ"));
            phuKien.setDanhMucPhuKien(cat);
        }
        if (request.getBrand() != null) {
            phuKien.setThuongHieu(request.getBrand().trim());
        }
        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Đơn giá bán phải lớn hơn 0"));
            }
            phuKien.setGiaBan(request.getPrice());
        }
        if (request.getStock() != null) {
            if (request.getStock() < 0) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Số lượng tồn kho không được âm"));
            }
            phuKien.setSoLuongTon(request.getStock());
        }
        if (request.getInstallationSpec() != null) {
            phuKien.setQuyCachLapDat(request.getInstallationSpec());
        }
        if (request.getImageUrl() != null) {
            phuKien.setHinhAnh(request.getImageUrl());
        }
        if (request.getUniversal() != null) {
            phuKien.setDungChung(request.getUniversal());
        }
        if (request.getActive() != null) {
            phuKien.setDangHoatDong(request.getActive());
        }

        phuKienRepository.save(phuKien);
        log.info("Admin updated accessory #{}", id);

        return ResponseEntity.ok(ApiResponse.ok(toDto(phuKien), "Cập nhật thông tin phụ kiện thành công"));
    }

    @PutMapping("/{id}/stock")
    @Transactional
    public ResponseEntity<ApiResponse<AdminAccessoryDto>> updateStock(
            @PathVariable Long id,
            @RequestParam Integer stock) {

        if (stock == null || stock < 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Số lượng tồn kho không được âm"));
        }

        PhuKien phuKien = phuKienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phụ kiện với ID: " + id));

        phuKien.setSoLuongTon(stock);
        phuKienRepository.save(phuKien);
        log.info("Admin updated stock for accessory #{}: {}", id, stock);

        return ResponseEntity.ok(ApiResponse.ok(toDto(phuKien), "Cập nhật tồn kho thành công"));
    }

    @PutMapping("/{id}/price")
    @Transactional
    public ResponseEntity<ApiResponse<AdminAccessoryDto>> updatePrice(
            @PathVariable Long id,
            @RequestParam BigDecimal price) {

        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn giá bán phải lớn hơn 0"));
        }

        PhuKien phuKien = phuKienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phụ kiện với ID: " + id));

        phuKien.setGiaBan(price);
        phuKienRepository.save(phuKien);
        log.info("Admin updated price for accessory #{}: {}", id, price);

        return ResponseEntity.ok(ApiResponse.ok(toDto(phuKien), "Cập nhật đơn giá bán thành công"));
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<AdminAccessoryDto>> toggleStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {

        PhuKien phuKien = phuKienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phụ kiện với ID: " + id));

        phuKien.setDangHoatDong(active);
        phuKienRepository.save(phuKien);
        log.info("Admin set active status for accessory #{}: {}", id, active);

        return ResponseEntity.ok(ApiResponse.ok(toDto(phuKien), "Cập nhật trạng thái kinh doanh thành công"));
    }

    private AdminAccessoryDto toDto(PhuKien p) {
        int stock = p.getSoLuongTon() != null ? p.getSoLuongTon() : 0;
        int minThreshold = 5;
        String stockStatus;
        if (stock == 0) {
            stockStatus = "Hết hàng";
        } else if (stock <= minThreshold) {
            stockStatus = "Sắp hết hàng";
        } else {
            stockStatus = "Còn hàng";
        }

        return AdminAccessoryDto.builder()
                .id(p.getId())
                .sku("ACC-" + String.format("%04d", p.getId()))
                .name(p.getTenPhuKien())
                .categoryId(p.getDanhMucPhuKien() != null ? p.getDanhMucPhuKien().getId() : null)
                .categoryName(p.getDanhMucPhuKien() != null ? p.getDanhMucPhuKien().getTenDanhMuc() : "Chung")
                .brand(p.getThuongHieu() != null ? p.getThuongHieu() : "AutoHub Genuine")
                .price(p.getGiaBan() != null ? p.getGiaBan() : BigDecimal.ZERO)
                .stock(stock)
                .minThreshold(minThreshold)
                .installationSpec(p.getQuyCachLapDat())
                .imageUrl(p.getHinhAnh())
                .universal(p.isDungChung())
                .active(p.isDangHoatDong())
                .stockStatus(stockStatus)
                .build();
    }
}
