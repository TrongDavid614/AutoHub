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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/accessories")
@RequiredArgsConstructor
public class AdminAccessoryController {

    private final PhuKienRepository phuKienRepository;
    private final DanhMucPhuKienRepository danhMucPhuKienRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminAccessoryDto>>> getAccessories(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean lowStock
    ) {
        List<PhuKien> list = phuKienRepository.findAll();

        if (search != null && !search.isBlank()) {
            String q = search.trim().toLowerCase();
            list = list.stream()
                    .filter(p -> (p.getTenPhuKien() != null && p.getTenPhuKien().toLowerCase().contains(q))
                            || (p.getThuongHieu() != null && p.getThuongHieu().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        if (categoryId != null) {
            list = list.stream()
                    .filter(p -> p.getDanhMucPhuKien() != null && Objects.equals(p.getDanhMucPhuKien().getId(), categoryId))
                    .collect(Collectors.toList());
        }

        if (Boolean.TRUE.equals(lowStock)) {
            list = list.stream()
                    .filter(p -> p.getSoLuongTon() != null && p.getSoLuongTon() <= 5)
                    .collect(Collectors.toList());
        }

        List<AdminAccessoryDto> dtos = list.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtos, "Lấy danh sách phụ kiện quản trị thành công"));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<DanhMucPhuKien>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(danhMucPhuKienRepository.findAll(), "Lấy danh mục thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminAccessoryDto>> getAccessoryDetail(@PathVariable Long id) {
        return phuKienRepository.findById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.ok(mapToDto(p), "Lấy chi tiết phụ kiện thành công")))
                .orElseGet(() -> ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy phụ kiện với ID: " + id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminAccessoryDto>> createAccessory(@Valid @RequestBody CreateAccessoryRequest req) {
        Optional<DanhMucPhuKien> catOpt = danhMucPhuKienRepository.findById(req.getDanhMucId());
        if (catOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Danh mục không tồn tại: " + req.getDanhMucId()));
        }

        PhuKien p = PhuKien.builder()
                .tenPhuKien(req.getTenPhuKien())
                .danhMucPhuKien(catOpt.get())
                .thuongHieu(req.getThuongHieu() != null ? req.getThuongHieu() : "AutoHub OEM")
                .giaBan(req.getGiaBan())
                .soLuongTon(req.getSoLuongTon())
                .quyCachLapDat(req.getQuyCachLapDat())
                .hinhAnh(req.getHinhAnh() != null && !req.getHinhAnh().isBlank() ? req.getHinhAnh() : "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600")
                .dungChung(Boolean.TRUE.equals(req.getDungChung()))
                .dangHoatDong(true)
                .build();

        PhuKien saved = phuKienRepository.save(p);
        return ResponseEntity.ok(ApiResponse.ok(mapToDto(saved), "Thêm phụ kiện mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminAccessoryDto>> updateAccessory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAccessoryRequest req
    ) {
        Optional<PhuKien> opt = phuKienRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy phụ kiện với ID: " + id));
        }

        PhuKien p = opt.get();
        if (req.getTenPhuKien() != null && !req.getTenPhuKien().isBlank()) {
            p.setTenPhuKien(req.getTenPhuKien());
        }
        if (req.getDanhMucId() != null) {
            danhMucPhuKienRepository.findById(req.getDanhMucId()).ifPresent(p::setDanhMucPhuKien);
        }
        if (req.getThuongHieu() != null) {
            p.setThuongHieu(req.getThuongHieu());
        }
        if (req.getGiaBan() != null) {
            p.setGiaBan(req.getGiaBan());
        }
        if (req.getSoLuongTon() != null) {
            p.setSoLuongTon(req.getSoLuongTon());
        }
        if (req.getQuyCachLapDat() != null) {
            p.setQuyCachLapDat(req.getQuyCachLapDat());
        }
        if (req.getHinhAnh() != null && !req.getHinhAnh().isBlank()) {
            p.setHinhAnh(req.getHinhAnh());
        }
        if (req.getDungChung() != null) {
            p.setDungChung(req.getDungChung());
        }
        if (req.getDangHoatDong() != null) {
            p.setDangHoatDong(req.getDangHoatDong());
        }

        PhuKien updated = phuKienRepository.save(p);
        return ResponseEntity.ok(ApiResponse.ok(mapToDto(updated), "Cập nhật phụ kiện thành công"));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Boolean>> toggleStatus(@PathVariable Long id) {
        Optional<PhuKien> opt = phuKienRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy phụ kiện với ID: " + id));
        }

        PhuKien p = opt.get();
        p.setDangHoatDong(!p.isDangHoatDong());
        phuKienRepository.save(p);

        return ResponseEntity.ok(ApiResponse.ok(p.isDangHoatDong(), 
                p.isDangHoatDong() ? "Đã bật kinh doanh phụ kiện" : "Đã tạm ẩn phụ kiện"));
    }

    private AdminAccessoryDto mapToDto(PhuKien p) {
        int stock = p.getSoLuongTon() != null ? p.getSoLuongTon() : 0;
        int minThreshold = 5;
        String status = !p.isDangHoatDong() ? "Đã tạm ẩn" : (stock == 0 ? "Hết hàng" : (stock <= minThreshold ? "Sắp hết hàng" : "Còn hàng"));
        String sku = "ACC-" + String.format("%04d", p.getId());

        return AdminAccessoryDto.builder()
                .id(p.getId())
                .sku(sku)
                .name(p.getTenPhuKien())
                .categoryId(p.getDanhMucPhuKien() != null ? p.getDanhMucPhuKien().getId() : null)
                .categoryName(p.getDanhMucPhuKien() != null ? p.getDanhMucPhuKien().getTenDanhMuc() : "Chưa phân loại")
                .brand(p.getThuongHieu() != null ? p.getThuongHieu() : "OEM")
                .price(p.getGiaBan())
                .stock(stock)
                .minThreshold(minThreshold)
                .status(status)
                .imageUrl(p.getHinhAnh())
                .installationGuide(p.getQuyCachLapDat())
                .isUniversal(p.isDungChung())
                .isActive(p.isDangHoatDong())
                .build();
    }
}
