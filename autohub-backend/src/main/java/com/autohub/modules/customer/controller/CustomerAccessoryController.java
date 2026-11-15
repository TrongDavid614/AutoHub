package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DanhGia;
import com.autohub.core.accessory.entity.DanhMucPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.DanhGiaRepository;
import com.autohub.core.accessory.repository.DanhMucPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.car.entity.DongXe;
import com.autohub.core.enums.TrangThaiDanhGia;
import com.autohub.modules.customer.dto.AccessoryCompatibilityDto;
import com.autohub.modules.customer.dto.AccessoryDetailDto;
import com.autohub.modules.customer.dto.AccessoryReviewDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/customer/accessories", "/accessories"})
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerAccessoryController {

    private final PhuKienRepository phuKienRepository;
    private final DanhMucPhuKienRepository danhMucPhuKienRepository;
    private final DanhGiaRepository danhGiaRepository;

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
    public ResponseEntity<ApiResponse<List<AccessoryDetailDto>>> getAccessories(
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

        List<AccessoryDetailDto> result = items.stream().map(this::mapAccessoryToDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phụ kiện xe thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccessoryDetailDto>> getAccessoryDetail(@PathVariable Long id) {
        return phuKienRepository.findById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.ok(mapAccessoryToDto(item), "Lấy chi tiết phụ kiện thành công")))
                .orElse(ResponseEntity.notFound().build());
    }

    private AccessoryDetailDto mapAccessoryToDto(PhuKien p) {
        String catName = "Trang trí & Tiện ích";
        Long catId = 1L;
        String catBadge = "TIỆN ÍCH CABIN";
        if (p.getDanhMucPhuKien() != null) {
            catName = p.getDanhMucPhuKien().getTenDanhMuc();
            catId = p.getDanhMucPhuKien().getId();
            if (catId == 1L) catBadge = "HỆ THỐNG SẠC & NĂNG LƯỢNG";
            else if (catId == 2L) catBadge = "CAMERA & THIẾT BỊ AN TOÀN";
            else if (catId == 3L) catBadge = "PHIM CÁCH NHIỆT & BẢO VỆ";
            else if (catId == 4L) catBadge = "TIỆN ÍCH & NỘI THẤT CAO CẤP";
        }

        long price = p.getGiaBan() != null ? p.getGiaBan().longValue() : 0L;
        long discountPrice = price > 5000000 ? price - 500000 : (price > 1000000 ? price - 100000 : price);
        int stock = p.getSoLuongTon() != null ? p.getSoLuongTon() : 10;
        String sku = p.getId() == 1L ? "AH-WBX-22K-GTE" : String.format("AH-ACC-%03d", p.getId());
        String brand = p.getThuongHieu() != null ? p.getThuongHieu() : "AutoHub OEM";
        String thumb = (p.getHinhAnh() != null && !p.getHinhAnh().isBlank())
                ? p.getHinhAnh()
                : "https://api.builder.io/api/v1/image/assets/TEMP/bc2fdd51e6e50efbc4440d46477d00b7d69fe4a1?width=768";

        // 1. Build images list
        List<String> images = new ArrayList<>();
        images.add(thumb);
        if (p.getId() == 1L) {
            images.add("https://api.builder.io/api/v1/image/assets/TEMP/7269dd36880bc2985679ba0fa9b24225a24cda98?width=768");
            images.add("https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600");
        } else if (p.getId() == 2L) {
            images.add("https://api.builder.io/api/v1/image/assets/TEMP/db5eb82bcba16029a46329580714b1ac751f5a4d?width=768");
        } else if (p.getId() == 10L) {
            images.add("https://api.builder.io/api/v1/image/assets/TEMP/bc2fdd51e6e50efbc4440d46477d00b7d69fe4a1?width=768");
            images.add("https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600");
        }

        // 2. Build specifications
        Map<String, String> specs = new LinkedHashMap<>();
        if (catId == 1L) {
            specs.put("Công suất sạc", "22kW (3 pha 380V) / 7.4kW (1 pha 220V)");
            specs.put("Chuẩn sạc", "Type 2 (IEC 62196-2) Tương thích 100% EV");
            specs.put("Chiều dài dây sạc", "5.0 mét - Cáp bọc cách điện cao su cao cấp");
            specs.put("Cấp chống nước & bụi", "IP65 ngoài trời - Chống chịu thời tiết khắc nghiệt");
            specs.put("Kết nối thông minh", "Wi-Fi, Bluetooth, 4G LTE, thẻ từ RFID, App AutoHub Connect");
            specs.put("Bảo vệ an toàn", "Chống quá tải, rò điện RCD Type B, quá nhiệt SiC");
            specs.put("Bảo hành", "24 tháng chính hãng 1 đổi 1");
        } else if (catId == 2L) {
            specs.put("Độ phân giải video", "4K Ultra HD (3840 x 2160) @ 30fps");
            specs.put("Cảm biến hình ảnh", "Sony Starvis 2 IMX678 dải động cao HDR");
            specs.put("Công nghệ tích hợp", "LiDAR đo khoảng cách vật cản, AI ADAS cảnh báo sớm");
            specs.put("Góc quan sát", "150 độ khẩu độ F1.7 quan sát ban đêm cực nét");
            specs.put("Kết nối", "Wi-Fi 5GHz truyền video tốc độ cao về Smartphone");
            specs.put("Thẻ nhớ hỗ trợ", "MicroSD tối đa 256GB Class 10 U3");
            specs.put("Bảo hành", "24 tháng chính hãng");
        } else if (catId == 3L) {
            specs.put("Công nghệ phim", "Nano Ceramic đa lớp phi kim loại");
            specs.put("Cản nhiệt hồng ngoại (IRR)", "99% ngăn cản nhiệt lượng mặt trời");
            specs.put("Cản tia tử ngoại (UVR)", "99.9% chống lão hóa da và nội thất");
            specs.put("Độ truyền sáng (VLT)", "Kính lái 70%, kính sườn & lưng 20%");
            specs.put("Tương thích tín hiệu", "Không cản sóng 5G, GPS, ePass/VETC, thẻ từ");
            specs.put("Bảo hành", "10 năm điện tử chính hãng");
        } else {
            if (p.getId() == 10L) {
                specs.put("Chất liệu ruột gối", "Cao su non đúc chậm nguyên khối Memory Foam mật độ cao");
                specs.put("Chất liệu vỏ ngoài", "Vải sợi dệt thể thao kháng khuẩn thoáng khí 3D Air Mesh");
                specs.put("Kích thước công thái học", "28 x 20 x 12 cm");
                specs.put("Trọng lượng", "450 gram");
                specs.put("Tính năng công thái học", "Nâng đỡ đốt sống cổ, giảm áp lực 85% khi lái xe đường dài");
                specs.put("Vệ sinh", "Vỏ gối có khóa kéo tháo rời giặt máy tiện lợi");
                specs.put("Bảo hành", "24 tháng chính hãng");
            } else {
                specs.put("Chất liệu", "Nhựa TPE nguyên khối / Vải da cao cấp không mùi");
                specs.put("Thiết kế", "Scan 3D Laser viền cao chống tràn nước 100%");
                specs.put("Chứng nhận", "Đạt chuẩn an toàn vật liệu RoHS / SGS châu Âu");
                specs.put("Vệ sinh", "Kháng nước, dễ dàng xịt rửa và lau khô tức thì");
                specs.put("Bảo hành", "24 tháng chính hãng");
            }
        }

        // 3. Build spec pills
        List<String> pills = new ArrayList<>();
        if (p.getId() == 10L) {
            pills.add("Cao su non đúc chậm");
            pills.add("Vải 3D Air Mesh");
            pills.add("Công thái học Ergonomic");
            pills.add("Bảo hành 24T");
        } else if (catId == 1L) {
            pills.add("Công suất 22kW");
            pills.add("Chuẩn Type-2");
            pills.add("Chống nước IP65");
            pills.add("Bảo hành 24T");
        } else if (catId == 2L) {
            pills.add("Độ phân giải 4K");
            pills.add("Sony Starvis 2");
            pills.add("Tích hợp LiDAR");
            pills.add("Bảo hành 24T");
        } else {
            pills.add(brand);
            pills.add("Chính hãng OEM");
            pills.add("Bảo hành chính hãng");
        }

        // 4. Build compatibilities list
        List<AccessoryCompatibilityDto> compatList = new ArrayList<>();
        if (p.getDongXes() != null && !p.getDongXes().isEmpty()) {
            for (DongXe d : p.getDongXes()) {
                compatList.add(AccessoryCompatibilityDto.builder()
                        .carModelId(d.getId())
                        .carModelName(d.getTenDongXe())
                        .manufactureYearStart(2022)
                        .manufactureYearEnd(2026)
                        .note("Tương thích 100% OEM")
                        .build());
            }
        }
        if (p.isDungChung() || compatList.isEmpty()) {
            long[] modelIds = {1L, 2L, 3L, 4L, 5L};
            String[] modelNames = {"AutoHub GT-e", "AutoHub SUV-e Flagship", "AutoHub Aero Sedan", "VinFast VF8", "VinFast VF9"};
            for (int i = 0; i < modelIds.length; i++) {
                final long mId = modelIds[i];
                if (compatList.stream().noneMatch(c -> Objects.equals(c.getCarModelId(), mId))) {
                    compatList.add(AccessoryCompatibilityDto.builder()
                            .carModelId(mId)
                            .carModelName(modelNames[i])
                            .manufactureYearStart(2022)
                            .manufactureYearEnd(2026)
                            .note("Tương thích 100% OEM")
                            .build());
                }
            }
        }

        // 5. Build reviews
        List<AccessoryReviewDto> reviewDtos = new ArrayList<>();
        try {
            List<DanhGia> dbReviews = danhGiaRepository.findByPhuKienIdAndTrangThaiDuyet(p.getId(), TrangThaiDanhGia.APPROVED);
            if (dbReviews != null && !dbReviews.isEmpty()) {
                for (DanhGia dg : dbReviews) {
                    String uName = (dg.getNguoiDung() != null && dg.getNguoiDung().getHoTen() != null)
                            ? dg.getNguoiDung().getHoTen()
                            : "Khách hàng AutoHub";
                    reviewDtos.add(AccessoryReviewDto.builder()
                            .id(dg.getId())
                            .userName(uName)
                            .userAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100")
                            .rating(dg.getSoSao() != null ? dg.getSoSao() : 5)
                            .comment(dg.getNoiDung())
                            .createdAt(dg.getNgayDanhGia() != null ? dg.getNgayDanhGia().toString() : "2026-11-10T10:00:00")
                            .build());
                }
            }
        } catch (Exception ignored) {
        }

        if (reviewDtos.isEmpty()) {
            if (p.getId() == 10L) {
                reviewDtos.add(AccessoryReviewDto.builder()
                        .id(101L)
                        .userName("Nguyễn Văn A")
                        .userAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100")
                        .rating(5)
                        .comment("Gối tựa đầu cao su non cực êm, đi đường dài không còn mỏi cổ, chất liệu vải thoáng khí không bị bí mồ hôi. Rất hài lòng!")
                        .createdAt("2026-11-12T08:30:00")
                        .build());
                reviewDtos.add(AccessoryReviewDto.builder()
                        .id(102L)
                        .userName("Trần Hoàng Nam")
                        .userAvatar("https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100")
                        .rating(5)
                        .comment("Form công thái học ôm sát gáy, lắp vừa khít ghế xe GT-e và SUV-e. Đóng gói cẩn thận, giao hàng siêu nhanh.")
                        .createdAt("2026-11-13T14:15:00")
                        .build());
            } else {
                reviewDtos.add(AccessoryReviewDto.builder()
                        .id(201L)
                        .userName("Khách hàng đã xác thực")
                        .userAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100")
                        .rating(5)
                        .comment("Sản phẩm phụ kiện chuẩn OEM, độ hoàn thiện cao, lắp đặt nhanh gọn và hoạt động ổn định.")
                        .createdAt("2026-11-10T09:00:00")
                        .build());
            }
        }

        double avgRating = reviewDtos.stream().mapToInt(AccessoryReviewDto::getRating).average().orElse(5.0);

        return AccessoryDetailDto.builder()
                .id(p.getId())
                .categoryId(catId)
                .categoryName(catName)
                .categoryBadge(catBadge)
                .name(p.getTenPhuKien())
                .sku(sku)
                .brand(brand)
                .price(price)
                .discountPrice(discountPrice)
                .stockQuantity(stock)
                .thumbnailUrl(thumb)
                .images(images)
                .galleryUrls(images)
                .description(p.getQuyCachLapDat() != null ? p.getQuyCachLapDat() : "Phụ kiện xe điện chính hãng AutoHub bảo hành tiêu chuẩn.")
                .installationGuide(p.getQuyCachLapDat())
                .specifications(specs)
                .specPills(pills)
                .tags(List.of("Chính hãng", "OEM", brand))
                .compatibilities(compatList)
                .compatibility(compatList)
                .reviews(reviewDtos)
                .rating(Math.round(avgRating * 10.0) / 10.0)
                .reviewCount(reviewDtos.size())
                .isActive(p.isDangHoatDong())
                .readyInShowroom(true)
                .homeInstallation(true)
                .isGenuine(true)
                .warrantyYears(catId == 3L ? 10 : 2)
                .dungChung(p.isDungChung())
                .isUniversal(p.isDungChung())
                .build();
    }
}
