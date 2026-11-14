package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.ChiTietGioHang;
import com.autohub.core.accessory.entity.ChiTietGioHangId;
import com.autohub.core.accessory.entity.GioHang;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.ChiTietGioHangRepository;
import com.autohub.core.accessory.repository.GioHangRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.car.entity.DongXe;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer/cart")
@RequiredArgsConstructor
public class CustomerCartController {

    private final GioHangRepository gioHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final PhuKienRepository phuKienRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Getter
    @Setter
    public static class AddCartItemRequest {
        private Long customerId;
        private Long accessoryId;
        private Integer quantity;
    }

    @Getter
    @Setter
    public static class UpdateQuantityRequest {
        private Long customerId;
        private Integer quantity;
    }

    @Getter
    @Setter
    public static class SyncCartItemDto {
        private Long accessoryId;
        private Integer quantity;
    }

    @Getter
    @Setter
    public static class SyncCartRequest {
        private Long customerId;
        private List<SyncCartItemDto> items;
    }

    private NguoiDung resolveCurrentUser(Long requestedCustomerId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getName() != null && !"anonymousUser".equals(auth.getName())) {
                Optional<NguoiDung> byEmail = nguoiDungRepository.findByEmail(auth.getName());
                if (byEmail.isPresent()) {
                    return byEmail.get();
                }
            }
        } catch (Exception ignored) {}

        if (requestedCustomerId != null) {
            return nguoiDungRepository.findById(requestedCustomerId).orElse(null);
        }

        // Fallback demo user ID 5 (Nguyễn Văn A)
        return nguoiDungRepository.findById(5L)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));
    }

    private GioHang getOrCreateCart(NguoiDung user) {
        return gioHangRepository.findByNguoiDungId(user.getId())
                .orElseGet(() -> {
                    GioHang newCart = GioHang.builder()
                            .nguoiDung(user)
                            .ngayCapNhat(LocalDateTime.now())
                            .build();
                    return gioHangRepository.save(newCart);
                });
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCart(
            @RequestParam(required = false) Long customerId
    ) {
        NguoiDung user = resolveCurrentUser(customerId);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.ok(buildEmptyCartResponse(customerId), "Giỏ hàng trống"));
        }

        GioHang cart = getOrCreateCart(user);
        List<ChiTietGioHang> items = chiTietGioHangRepository.findByGioHangId(cart.getId());

        return ResponseEntity.ok(ApiResponse.ok(mapCartToDto(cart, items), "Lấy thông tin giỏ hàng thành công"));
    }

    @PostMapping("/items")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> addItem(
            @RequestBody AddCartItemRequest req
    ) {
        if (req.getAccessoryId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã phụ kiện (accessoryId) không được để trống"));
        }

        int addQty = (req.getQuantity() != null && req.getQuantity() > 0) ? req.getQuantity() : 1;

        PhuKien pk = phuKienRepository.findById(req.getAccessoryId())
                .orElse(null);
        if (pk == null || !pk.isDangHoatDong()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Phụ kiện không tồn tại hoặc đã ngừng kinh doanh"));
        }

        int stock = pk.getSoLuongTon() != null ? pk.getSoLuongTon() : 0;
        if (stock <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Sản phẩm '" + pk.getTenPhuKien() + "' hiện đã hết hàng trong kho"));
        }

        NguoiDung user = resolveCurrentUser(req.getCustomerId());
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin người dùng"));
        }

        GioHang cart = getOrCreateCart(user);
        ChiTietGioHangId id = new ChiTietGioHangId(cart.getId(), pk.getId());

        Optional<ChiTietGioHang> existingOpt = chiTietGioHangRepository.findById(id);
        int currentQty = existingOpt.map(ChiTietGioHang::getSoLuong).orElse(0);
        int totalQty = currentQty + addQty;

        if (totalQty > stock) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Số lượng yêu cầu (" + totalQty + ") vượt quá tồn kho thực tế (" + stock + " bộ) của sản phẩm '" + pk.getTenPhuKien() + "'"));
        }

        ChiTietGioHang item;
        if (existingOpt.isPresent()) {
            item = existingOpt.get();
            item.setSoLuong(totalQty);
            item.setDonGiaTamTinh(pk.getGiaBan());
        } else {
            item = ChiTietGioHang.builder()
                    .id(id)
                    .gioHang(cart)
                    .phuKien(pk)
                    .soLuong(totalQty)
                    .donGiaTamTinh(pk.getGiaBan())
                    .build();
        }

        chiTietGioHangRepository.save(item);
        cart.setNgayCapNhat(LocalDateTime.now());
        gioHangRepository.save(cart);

        List<ChiTietGioHang> allItems = chiTietGioHangRepository.findByGioHangId(cart.getId());
        return ResponseEntity.ok(ApiResponse.ok(mapCartToDto(cart, allItems), "Đã thêm sản phẩm vào giỏ hàng!"));
    }

    @PutMapping("/items/{accessoryId}")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateQuantity(
            @PathVariable Long accessoryId,
            @RequestBody UpdateQuantityRequest req
    ) {
        NguoiDung user = resolveCurrentUser(req != null ? req.getCustomerId() : null);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin người dùng"));
        }

        GioHang cart = getOrCreateCart(user);
        ChiTietGioHangId id = new ChiTietGioHangId(cart.getId(), accessoryId);

        Optional<ChiTietGioHang> itemOpt = chiTietGioHangRepository.findById(id);
        if (itemOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Sản phẩm không có trong giỏ hàng"));
        }

        ChiTietGioHang item = itemOpt.get();
        int newQty = (req != null && req.getQuantity() != null) ? req.getQuantity() : 0;

        if (newQty <= 0) {
            chiTietGioHangRepository.delete(item);
        } else {
            PhuKien pk = item.getPhuKien();
            int stock = (pk != null && pk.getSoLuongTon() != null) ? pk.getSoLuongTon() : 0;
            if (newQty > stock) {
                return ResponseEntity.badRequest().body(ApiResponse.error(
                        "Số lượng (" + newQty + ") vượt quá tồn kho thực tế (" + stock + " bộ) của sản phẩm"));
            }
            item.setSoLuong(newQty);
            chiTietGioHangRepository.save(item);
        }

        cart.setNgayCapNhat(LocalDateTime.now());
        gioHangRepository.save(cart);

        List<ChiTietGioHang> allItems = chiTietGioHangRepository.findByGioHangId(cart.getId());
        return ResponseEntity.ok(ApiResponse.ok(mapCartToDto(cart, allItems), "Cập nhật số lượng giỏ hàng thành công"));
    }

    @DeleteMapping("/items/{accessoryId}")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> removeItem(
            @PathVariable Long accessoryId,
            @RequestParam(required = false) Long customerId
    ) {
        NguoiDung user = resolveCurrentUser(customerId);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin người dùng"));
        }

        GioHang cart = getOrCreateCart(user);
        ChiTietGioHangId id = new ChiTietGioHangId(cart.getId(), accessoryId);

        if (chiTietGioHangRepository.existsById(id)) {
            chiTietGioHangRepository.deleteById(id);
            cart.setNgayCapNhat(LocalDateTime.now());
            gioHangRepository.save(cart);
        }

        List<ChiTietGioHang> allItems = chiTietGioHangRepository.findByGioHangId(cart.getId());
        return ResponseEntity.ok(ApiResponse.ok(mapCartToDto(cart, allItems), "Đã xóa sản phẩm khỏi giỏ hàng"));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> clearCart(
            @RequestParam(required = false) Long customerId
    ) {
        NguoiDung user = resolveCurrentUser(customerId);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.ok(buildEmptyCartResponse(customerId), "Đã làm trống giỏ hàng"));
        }

        GioHang cart = getOrCreateCart(user);
        List<ChiTietGioHang> items = chiTietGioHangRepository.findByGioHangId(cart.getId());
        if (!items.isEmpty()) {
            chiTietGioHangRepository.deleteAll(items);
        }
        cart.setNgayCapNhat(LocalDateTime.now());
        gioHangRepository.save(cart);

        return ResponseEntity.ok(ApiResponse.ok(mapCartToDto(cart, Collections.emptyList()), "Đã xóa toàn bộ giỏ hàng"));
    }

    @PostMapping("/sync")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncGuestCart(
            @RequestBody SyncCartRequest req
    ) {
        NguoiDung user = resolveCurrentUser(req.getCustomerId());
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin người dùng để đồng bộ"));
        }

        GioHang cart = getOrCreateCart(user);

        if (req.getItems() != null && !req.getItems().isEmpty()) {
            for (SyncCartItemDto guestItem : req.getItems()) {
                if (guestItem.getAccessoryId() == null) continue;
                PhuKien pk = phuKienRepository.findById(guestItem.getAccessoryId()).orElse(null);
                if (pk == null || !pk.isDangHoatDong()) continue;

                int stock = pk.getSoLuongTon() != null ? pk.getSoLuongTon() : 0;
                if (stock <= 0) continue;

                ChiTietGioHangId id = new ChiTietGioHangId(cart.getId(), pk.getId());
                Optional<ChiTietGioHang> existingOpt = chiTietGioHangRepository.findById(id);

                int addQty = (guestItem.getQuantity() != null && guestItem.getQuantity() > 0) ? guestItem.getQuantity() : 1;
                int currentQty = existingOpt.map(ChiTietGioHang::getSoLuong).orElse(0);
                int finalQty = Math.min(currentQty + addQty, stock);

                if (existingOpt.isPresent()) {
                    ChiTietGioHang item = existingOpt.get();
                    item.setSoLuong(finalQty);
                    item.setDonGiaTamTinh(pk.getGiaBan());
                    chiTietGioHangRepository.save(item);
                } else {
                    ChiTietGioHang item = ChiTietGioHang.builder()
                            .id(id)
                            .gioHang(cart)
                            .phuKien(pk)
                            .soLuong(finalQty)
                            .donGiaTamTinh(pk.getGiaBan())
                            .build();
                    chiTietGioHangRepository.save(item);
                }
            }
            cart.setNgayCapNhat(LocalDateTime.now());
            gioHangRepository.save(cart);
        }

        List<ChiTietGioHang> allItems = chiTietGioHangRepository.findByGioHangId(cart.getId());
        return ResponseEntity.ok(ApiResponse.ok(mapCartToDto(cart, allItems), "Đồng bộ giỏ hàng thành công"));
    }

    private Map<String, Object> buildEmptyCartResponse(Long customerId) {
        Map<String, Object> res = new HashMap<>();
        res.put("cartId", 0L);
        res.put("customerId", customerId != null ? customerId : 0L);
        res.put("items", Collections.emptyList());
        res.put("totalItems", 0);
        res.put("rawSubtotal", BigDecimal.ZERO);
        res.put("updatedAt", LocalDateTime.now());
        return res;
    }

    private Map<String, Object> mapCartToDto(GioHang cart, List<ChiTietGioHang> items) {
        Map<String, Object> res = new HashMap<>();
        res.put("cartId", cart.getId());
        res.put("customerId", cart.getNguoiDung() != null ? cart.getNguoiDung().getId() : 0L);
        res.put("updatedAt", cart.getNgayCapNhat());

        int totalCount = 0;
        BigDecimal rawSubtotal = BigDecimal.ZERO;

        List<Map<String, Object>> itemDtos = new ArrayList<>();
        if (items != null) {
            for (ChiTietGioHang item : items) {
                PhuKien pk = item.getPhuKien();
                if (pk == null) continue;

                int qty = item.getSoLuong() != null ? item.getSoLuong() : 1;
                totalCount += qty;

                long unitPrice = pk.getGiaBan() != null ? pk.getGiaBan().longValue() : 0L;
                long discountPrice = unitPrice > 5000000 ? unitPrice - 500000 : unitPrice;
                BigDecimal effectivePrice = BigDecimal.valueOf(discountPrice > 0 ? discountPrice : unitPrice);
                BigDecimal lineTotal = effectivePrice.multiply(BigDecimal.valueOf(qty));
                rawSubtotal = rawSubtotal.add(lineTotal);

                Map<String, Object> itemDto = new HashMap<>();
                itemDto.put("accessoryId", pk.getId());
                itemDto.put("quantity", qty);
                itemDto.put("unitPrice", unitPrice);
                itemDto.put("discountPrice", discountPrice);
                itemDto.put("totalPrice", lineTotal);
                itemDto.put("stockQuantity", pk.getSoLuongTon() != null ? pk.getSoLuongTon() : 0);
                itemDto.put("inStock", (pk.getSoLuongTon() != null ? pk.getSoLuongTon() : 0) >= qty);

                // Full accessory object matching frontend Accessory interface
                Map<String, Object> accDto = mapAccessoryToDto(pk);
                itemDto.put("accessory", accDto);

                itemDtos.add(itemDto);
            }
        }

        res.put("items", itemDtos);
        res.put("totalItems", totalCount);
        res.put("rawSubtotal", rawSubtotal);
        return res;
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
        String sku = p.getId() == 1L ? "AH-WBX-22K-GTE" : String.format("AH-ACC-%03d", p.getId());
        map.put("sku", sku);
        map.put("brand", p.getThuongHieu() != null ? p.getThuongHieu() : "AutoHub OEM");
        map.put("isActive", p.isDangHoatDong());
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
        if (p.getDongXes() != null && !p.getDongXes().isEmpty()) {
            for (DongXe d : p.getDongXes()) {
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
        map.put("compatibility", compatibilities);
        return map;
    }
}
