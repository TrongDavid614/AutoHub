package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.HinhAnhXe;
import com.autohub.core.car.entity.MauSac;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.HinhAnhXeRepository;
import com.autohub.core.car.repository.MauSacRepository;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.modules.customer.dto.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.*;

@Slf4j
@RestController
@RequestMapping({"/customer/cars", "/cars"})
@RequiredArgsConstructor
public class ShowroomCarController {

    private final PhienBanXeRepository phienBanXeRepository;
    private final HinhAnhXeRepository hinhAnhXeRepository;
    private final MauSacRepository mauSacRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getShowroomCars() {
        List<MauSac> allColors = mauSacRepository.findAll();
        List<PhienBanXe> cars = phienBanXeRepository.findAll().stream()
                .filter(car -> !car.isDeleted() && car.isDangHoatDong())
                .toList();
        List<Map<String, Object>> result = cars.stream()
                .map(car -> mapCarToDto(car, allColors, false))
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh mục xe showroom thành công"));
    }

    @GetMapping("/compare")
    public ResponseEntity<ApiResponse<CarComparisonResponseDto>> getCarComparison(
            @RequestParam(value = "ids", required = false) List<Long> ids
    ) {
        // 1. Resolve selected car IDs
        List<Long> targetIds = new ArrayList<>();
        if (ids != null && !ids.isEmpty()) {
            for (Long id : ids) {
                if (id != null && !targetIds.contains(id)) {
                    targetIds.add(id);
                }
                if (targetIds.size() >= 3) break;
            }
        }

        // If no IDs provided or empty, default to top 3 active cars
        if (targetIds.isEmpty()) {
            List<Long> defaultCandidateIds = List.of(1L, 2L, 3L);
            for (Long defId : defaultCandidateIds) {
                if (phienBanXeRepository.existsById(defId)) {
                    targetIds.add(defId);
                }
            }
            if (targetIds.isEmpty()) {
                phienBanXeRepository.findAll().stream()
                        .filter(c -> !c.isDeleted() && c.isDangHoatDong())
                        .limit(3)
                        .forEach(c -> targetIds.add(c.getId()));
            }
        }

        // 2. Fetch cars in order
        List<PhienBanXe> selectedCars = new ArrayList<>();
        for (Long id : targetIds) {
            phienBanXeRepository.findById(id)
                    .filter(c -> !c.isDeleted())
                    .ifPresent(selectedCars::add);
        }

        if (selectedCars.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(
                    CarComparisonResponseDto.builder()
                            .trims(Collections.emptyList())
                            .specGroups(Collections.emptyList())
                            .benchmarkMetrics(Collections.emptyList())
                            .build(),
                    "Không tìm thấy mẫu xe nào để so sánh"
            ));
        }

        // 3. Parse specs for each car
        Map<Long, Map<String, String>> specsByCar = new LinkedHashMap<>();
        for (PhienBanXe car : selectedCars) {
            Map<String, String> sMap = new HashMap<>();
            String raw = car.getThongSoKyThuat();
            if (raw != null && raw.trim().startsWith("{")) {
                try {
                    sMap = objectMapper.readValue(raw, new TypeReference<Map<String, String>>() {});
                } catch (Exception e) {
                    log.warn("Failed to parse specifications JSON for car {}: {}", car.getId(), e.getMessage());
                }
            }
            specsByCar.put(car.getId(), sMap);
        }

        // 4. Build trims
        List<ComparisonTrimDto> trims = new ArrayList<>();
        for (PhienBanXe car : selectedCars) {
            Map<String, String> sMap = specsByCar.getOrDefault(car.getId(), Collections.emptyMap());
            List<HinhAnhXe> dbImages = hinhAnhXeRepository.findByPhienBanXeIdOrderByThuTuHienThiAsc(car.getId());
            String imageUrl = !dbImages.isEmpty()
                    ? dbImages.get(0).getDuongDan()
                    : "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200";

            BigDecimal price = car.getGiaNiemYet() != null ? car.getGiaNiemYet() : BigDecimal.ZERO;
            BigDecimal deposit = car.getMucTienCoc() != null ? car.getMucTienCoc() : BigDecimal.ZERO;

            String brandName = (car.getDongXe() != null && car.getDongXe().getHangXe() != null)
                    ? car.getDongXe().getHangXe().getTenHangXe()
                    : "AutoHub EV";
            String modelName = car.getDongXe() != null ? car.getDongXe().getTenDongXe() : "AutoHub GT-e";
            String segment = car.getDongXe() != null ? car.getDongXe().getPhanKhuc() : "Sedan";

            String tag = sMap.getOrDefault("tag", segment != null ? segment : "Tiêu Chuẩn");
            String badge = sMap.getOrDefault("badge",
                    price.compareTo(new BigDecimal("3200000000")) >= 0 ? "TRACK RS" :
                    price.compareTo(new BigDecimal("2000000000")) >= 0 ? "KHUYÊN DÙNG" : "TIÊU CHUẨN");
            String badgeVariant = "KHUYÊN DÙNG".equalsIgnoreCase(badge) ? "accent" : "primary";

            trims.add(ComparisonTrimDto.builder()
                    .id(car.getId())
                    .trimId(String.valueOf(car.getId()))
                    .name(car.getTenPhienBan())
                    .modelName(modelName)
                    .brandName(brandName)
                    .price(price)
                    .priceFormatted(formatVnd(price))
                    .depositAmount(deposit)
                    .depositFormatted(formatVnd(deposit))
                    .imageUrl(imageUrl)
                    .tag(tag)
                    .badge(badge)
                    .badgeVariant(badgeVariant)
                    .segment(segment)
                    .powertrain(car.getLoaiNhienLieu() != null ? car.getLoaiNhienLieu() : "Thuần điện EV")
                    .seats((car.getSoChoNgoi() != null ? car.getSoChoNgoi() : 5) + " chỗ")
                    .releaseYear(car.getNamSanXuat())
                    .build());
        }

        // 5. Build Spec Groups
        List<ComparisonSpecGroupDto> specGroups = new ArrayList<>();

        // Section 1: Powertrain
        List<ComparisonSpecRowDto> powertrainRows = new ArrayList<>();
        powertrainRows.add(buildRow("motor", "Động cơ & Dẫn động", "Kiến trúc motor SiC bán dẫn thế hệ mới", null, false, "dong_co", null, "Thuần điện 800V", selectedCars, specsByCar));
        powertrainRows.add(buildRow("acceleration", "Tăng tốc 0 - 100 km/h", "Kiểm nghiệm thực tế đạt chuẩn FIA", "GIÂY", true, "tang_toc", "tang_toc_sub", "3.8", selectedCars, specsByCar));
        powertrainRows.add(buildRow("power", "Công suất cực đại", "Mã lực (Horsepower) & KiloWatt", null, false, "cong_suat", null, "450 HP (330 kW)", selectedCars, specsByCar));
        powertrainRows.add(buildRow("torque", "Mô-men xoắn tức thời", "Lực kéo cực đại phản hồi 0.01s", "Nm", false, "mo_men_xoan", null, "550", selectedCars, specsByCar));
        powertrainRows.add(buildRow("max_speed", "Tốc độ tối đa giới hạn", "Điện tử điện áp cao an toàn", "KM/H", false, "toc_do_toi_da", "toc_do_toi_da_sub", "230", selectedCars, specsByCar));
        powertrainRows.add(buildRow("range", "Quãng đường sạc đầy / Đầy bình", "Chuẩn kiểm nghiệm WLTP hoặc đường trường hỗn hợp", "KM", true, "tam_chay", "tam_chay_sub", "600", selectedCars, specsByCar));
        powertrainRows.add(buildRow("charging", "Kiến trúc sạc / Tiêu hao nhiên liệu", "Nền tảng sạc điện áp cao hoặc định mức tiêu hao", null, false, "sac", "sac_sub", "10 - 80% trong 15 phút", selectedCars, specsByCar));

        specGroups.add(ComparisonSpecGroupDto.builder()
                .id("powertrain")
                .sectionNumber("SECTION 01")
                .title("Hiệu Năng & Hệ Truyền Động (Powertrain)")
                .rows(powertrainRows)
                .build());

        // Section 2: Chassis
        List<ComparisonSpecRowDto> chassisRows = new ArrayList<>();
        chassisRows.add(buildRow("dimensions", "Dài x Rộng x Cao", "Đo lường tiêu chuẩn (mm)", "MM", false, "kich_thuoc", "kich_thuoc_sub", "4.965 x 1.960 x 1.410", selectedCars, specsByCar));
        chassisRows.add(buildRow("wheelbase", "Chiều dài cơ sở", "Không gian để chân hàng ghế sau", "MM", false, "chieu_dai_co_so", "chieu_dai_co_so_sub", "2.990", selectedCars, specsByCar));
        chassisRows.add(buildRow("trunk", "Dung tích khoang hành lý", "Cốp sau hoặc mở rộng gập hàng ghế", null, false, "khoang_hanh_ly", null, "Tổng 565 Lít", selectedCars, specsByCar));
        chassisRows.add(buildRow("curb_weight", "Trọng lượng không tải", "Khối lượng bản thân & Phân bổ tải trọng", null, false, "trong_luong", "trong_luong_sub", "2.200 kg", selectedCars, specsByCar));
        chassisRows.add(buildRow("suspension", "Hệ thống treo & Khung gầm", "Khung gầm và bộ giảm chấn thích ứng", null, false, "he_thong_treo", "he_thong_treo_sub", "Treo độc lập đa liên kết", selectedCars, specsByCar));

        specGroups.add(ComparisonSpecGroupDto.builder()
                .id("chassis")
                .sectionNumber("SECTION 02")
                .title("Kích Thước Khung Gầm & Khối Lượng (Chassis)")
                .rows(chassisRows)
                .build());

        // Section 3: Luxury & ADAS
        List<ComparisonSpecRowDto> luxuryRows = new ArrayList<>();
        luxuryRows.add(buildRow("lidar_adas", "Hệ thống LiDAR & Cảm biến ADAS", "Gói hỗ trợ người lái và an toàn chủ động", null, false, "adas", "adas_sub", "Camera 360° + Radar 4D", selectedCars, specsByCar));
        luxuryRows.add(buildRow("audio", "Hệ thống âm thanh Studio", "Hệ thống tái tạo âm trường vòm đa kênh", null, false, "am_thanh", "am_thanh_sub", "14 loa Hi-Fi 710W", selectedCars, specsByCar));
        luxuryRows.add(buildRow("roof", "Cửa sổ trời & Mui xe", "Vật liệu trần và cách âm cách nhiệt", null, false, "mui_xe", "mui_xe_sub", "Kính toàn cảnh Low-E", selectedCars, specsByCar));
        luxuryRows.add(buildRow("wheels", "La-zăng & Lốp hiệu năng", "Kích thước mâm xe và thương hiệu lốp", null, false, "mam_xe", "mam_xe_sub", "20 inch khí động học", selectedCars, specsByCar));
        luxuryRows.add(buildRow("seats", "Ghế ngồi & Chất liệu da nội thất", "Chỉnh điện đa hướng và làm mát/sưởi", null, false, "chat_lieu_ghe", "chat_lieu_ghe_sub", "Da cao cấp chỉnh điện", selectedCars, specsByCar));

        specGroups.add(ComparisonSpecGroupDto.builder()
                .id("safety_luxury")
                .sectionNumber("SECTION 03")
                .title("An Toàn, LiDAR & Nội Thất Cao Cấp (Luxury & ADAS)")
                .rows(luxuryRows)
                .build());

        // 6. Build Benchmark Metrics
        List<ComparisonBenchmarkMetricDto> benchmarkMetrics = buildBenchmarkMetrics(selectedCars, specsByCar);

        return ResponseEntity.ok(ApiResponse.ok(
                CarComparisonResponseDto.builder()
                        .trims(trims)
                        .specGroups(specGroups)
                        .benchmarkMetrics(benchmarkMetrics)
                        .build(),
                "Lấy dữ liệu bàn cân so sánh thành công"
        ));
    }

    private String formatVnd(BigDecimal amount) {
        if (amount == null) return "0 đ";
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(new Locale("vi", "VN"));
        symbols.setGroupingSeparator('.');
        DecimalFormat df = new DecimalFormat("#,###", symbols);
        return df.format(amount) + " đ";
    }

    private ComparisonSpecRowDto buildRow(
            String id,
            String label,
            String sublabel,
            String unit,
            boolean isTelemetryHighlight,
            String jsonKey,
            String jsonSubKey,
            String defaultVal,
            List<PhienBanXe> cars,
            Map<Long, Map<String, String>> specsByCar
    ) {
        Map<String, String> values = new LinkedHashMap<>();
        Map<String, String> subValues = new LinkedHashMap<>();

        for (PhienBanXe car : cars) {
            String trimKey = String.valueOf(car.getId());
            Map<String, String> s = specsByCar.getOrDefault(car.getId(), Collections.emptyMap());
            String val = s.getOrDefault(jsonKey, defaultVal);
            if (val == null || val.isBlank()) {
                val = defaultVal;
            }
            values.put(trimKey, val);

            if (jsonSubKey != null && s.containsKey(jsonSubKey)) {
                String sub = s.get(jsonSubKey);
                if (sub != null && !sub.isBlank()) {
                    subValues.put(trimKey, sub);
                }
            }
        }

        // Determine if different
        Set<String> uniqueVals = new HashSet<>(values.values());
        boolean isDifferent = uniqueVals.size() > 1;

        // Legacy compatibility properties
        String stdVal = !cars.isEmpty() ? values.get(String.valueOf(cars.get(0).getId())) : null;
        String stdSub = !cars.isEmpty() ? subValues.get(String.valueOf(cars.get(0).getId())) : null;
        String perfVal = cars.size() > 1 ? values.get(String.valueOf(cars.get(1).getId())) : null;
        String perfSub = cars.size() > 1 ? subValues.get(String.valueOf(cars.get(1).getId())) : null;
        String trkVal = cars.size() > 2 ? values.get(String.valueOf(cars.get(2).getId())) : null;
        String trkSub = cars.size() > 2 ? subValues.get(String.valueOf(cars.get(2).getId())) : null;

        return ComparisonSpecRowDto.builder()
                .id(id)
                .label(label)
                .sublabel(sublabel)
                .unit(unit)
                .isDifferent(isDifferent)
                .isTelemetryHighlight(isTelemetryHighlight)
                .values(values)
                .subValues(subValues)
                .standardVal(stdVal)
                .standardSub(stdSub)
                .performanceVal(perfVal)
                .performanceSub(perfSub)
                .trackVal(trkVal)
                .trackSub(trkSub)
                .build();
    }

    private List<ComparisonBenchmarkMetricDto> buildBenchmarkMetrics(
            List<PhienBanXe> cars,
            Map<Long, Map<String, String>> specsByCar
    ) {
        List<ComparisonBenchmarkMetricDto> list = new ArrayList<>();

        // Metric 1: Acceleration
        Map<String, Integer> accScores = new LinkedHashMap<>();
        Map<String, String> accLabels = new LinkedHashMap<>();
        List<Double> accNums = new ArrayList<>();
        for (PhienBanXe car : cars) {
            String k = String.valueOf(car.getId());
            Map<String, String> s = specsByCar.getOrDefault(car.getId(), Collections.emptyMap());
            int score = 75;
            if (s.containsKey("score_acceleration")) {
                try { score = Integer.parseInt(s.get("score_acceleration")); } catch (Exception ignored) {}
            }
            String tangToc = s.getOrDefault("tang_toc", "3.8");
            try {
                accNums.add(Double.parseDouble(tangToc.replaceAll("[^0-9.]", "")));
            } catch (Exception ignored) {}
            accScores.put(k, Math.min(100, Math.max(20, score)));
            accLabels.put(k, car.getTenPhienBan() + ": " + tangToc + "s");
        }
        String accRange = accNums.isEmpty() ? "2.8s - 3.8s" :
                String.format(Locale.US, "%.1fs - %.1fs",
                        accNums.stream().min(Double::compare).orElse(2.8),
                        accNums.stream().max(Double::compare).orElse(5.5));

        list.add(ComparisonBenchmarkMetricDto.builder()
                .id("acceleration")
                .title("Tăng tốc & Phản hồi chân ga (0-100 km/h)")
                .icon("activity")
                .rangeText(accRange)
                .scores(accScores)
                .labels(accLabels)
                .build());

        // Metric 2: Range
        Map<String, Integer> rangeScores = new LinkedHashMap<>();
        Map<String, String> rangeLabels = new LinkedHashMap<>();
        List<Integer> rangeNums = new ArrayList<>();
        for (PhienBanXe car : cars) {
            String k = String.valueOf(car.getId());
            Map<String, String> s = specsByCar.getOrDefault(car.getId(), Collections.emptyMap());
            int score = 85;
            if (s.containsKey("score_range")) {
                try { score = Integer.parseInt(s.get("score_range")); } catch (Exception ignored) {}
            }
            String tamChay = s.getOrDefault("tam_chay", "600");
            try {
                rangeNums.add(Integer.parseInt(tamChay.replaceAll("[^0-9]", "")));
            } catch (Exception ignored) {}
            rangeScores.put(k, Math.min(100, Math.max(20, score)));
            rangeLabels.put(k, car.getTenPhienBan() + ": " + tamChay + " km");
        }
        String rangeText = rangeNums.isEmpty() ? "Max 680 KM" :
                rangeNums.stream().min(Integer::compare).orElse(420) + " - " +
                rangeNums.stream().max(Integer::compare).orElse(920) + " KM";

        list.add(ComparisonBenchmarkMetricDto.builder()
                .id("range")
                .title("Phạm vi di chuyển đường trường (WLTP Range / Đầy bình)")
                .icon("gauge")
                .rangeText(rangeText)
                .scores(rangeScores)
                .labels(rangeLabels)
                .build());

        // Metric 3: ADAS
        Map<String, Integer> adasScores = new LinkedHashMap<>();
        Map<String, String> adasLabels = new LinkedHashMap<>();
        for (PhienBanXe car : cars) {
            String k = String.valueOf(car.getId());
            Map<String, String> s = specsByCar.getOrDefault(car.getId(), Collections.emptyMap());
            int score = 85;
            if (s.containsKey("score_safety")) {
                try { score = Integer.parseInt(s.get("score_safety")); } catch (Exception ignored) {}
            }
            adasScores.put(k, Math.min(100, Math.max(30, score)));
            adasLabels.put(k, car.getTenPhienBan() + ": " + s.getOrDefault("adas", "ADAS L2+"));
        }
        list.add(ComparisonBenchmarkMetricDto.builder()
                .id("safety")
                .title("Cấp độ trí tuệ tự hành & Cảm biến ADAS / LiDAR")
                .icon("navigation")
                .rangeText("L2+ to L3+")
                .scores(adasScores)
                .labels(adasLabels)
                .build());

        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCarDetail(@PathVariable Long id) {
        List<MauSac> allColors = mauSacRepository.findAll();
        return phienBanXeRepository.findById(id)
                .filter(car -> !car.isDeleted())
                .map(car -> ResponseEntity.ok(ApiResponse.ok(mapCarToDto(car, allColors, true), "Lấy chi tiết phiên bản xe thành công")))
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> mapCarToDto(PhienBanXe car, List<MauSac> colors, boolean includeSiblings) {
        Map<String, Object> dto = new HashMap<>();

        // 1. Dual-Contract Primary Identifiers & Base Pricing
        dto.put("id", car.getId());
        dto.put("tenPhienBan", car.getTenPhienBan());
        dto.put("variantName", car.getTenPhienBan());
        dto.put("name", car.getTenPhienBan());
        dto.put("giaNiemYet", car.getGiaNiemYet());
        dto.put("listedPrice", car.getGiaNiemYet());
        dto.put("mucTienCoc", car.getMucTienCoc());
        dto.put("depositPrice", car.getMucTienCoc());
        dto.put("depositAmount", car.getMucTienCoc());
        dto.put("namSanXuat", car.getNamSanXuat());
        dto.put("releaseYear", car.getNamSanXuat());
        dto.put("hopSo", car.getHopSo());
        dto.put("transmission", car.getHopSo());
        dto.put("loaiNhienLieu", car.getLoaiNhienLieu());
        dto.put("fuelType", car.getLoaiNhienLieu());
        dto.put("powertrain", car.getLoaiNhienLieu());
        dto.put("soChoNgoi", car.getSoChoNgoi());
        dto.put("seats", car.getSoChoNgoi());
        dto.put("tamHoatDongKm", car.getTamHoatDongKm());
        dto.put("rangeKm", car.getTamHoatDongKm());
        dto.put("dungLuongPinKwh", car.getDungLuongPinKwh());
        dto.put("batteryKwh", car.getDungLuongPinKwh());
        dto.put("dangHoatDong", car.isDangHoatDong());
        dto.put("isDeleted", car.isDeleted());

        // 2. Parse Specifications Map
        Map<String, String> specsMap = new HashMap<>();
        String rawSpecs = car.getThongSoKyThuat();
        dto.put("thongSoKyThuat", rawSpecs);
        if (rawSpecs != null && rawSpecs.trim().startsWith("{")) {
            try {
                specsMap = objectMapper.readValue(rawSpecs, new TypeReference<Map<String, String>>() {});
            } catch (Exception e) {
                log.warn("Failed to parse specifications JSON for car ID: {}", car.getId());
            }
        }
        dto.put("specs", specsMap);
        dto.put("specifications", specsMap);

        // Extract clean metrics
        String power = specsMap.getOrDefault("cong_suat", specsMap.getOrDefault("dong_co", "680 HP"));
        String acceleration = specsMap.getOrDefault("tang_toc", "3.2s");
        String range = specsMap.getOrDefault("tam_chay", car.getTamHoatDongKm() != null ? car.getTamHoatDongKm() + " km" : "680 km");
        String charging = specsMap.getOrDefault("sac", "10-80% trong 15 phút (350kW)");
        dto.put("horsepowerText", power);
        dto.put("accelerationText", acceleration);
        dto.put("rangeText", range);
        dto.put("chargingText", charging);

        // 3. Model & Brand Hierarchy
        if (car.getDongXe() != null) {
            Map<String, Object> dongXeMap = new HashMap<>();
            dongXeMap.put("id", car.getDongXe().getId());
            dongXeMap.put("modelId", car.getDongXe().getId());
            dongXeMap.put("tenDongXe", car.getDongXe().getTenDongXe());
            dongXeMap.put("modelName", car.getDongXe().getTenDongXe());
            dongXeMap.put("phanKhuc", car.getDongXe().getPhanKhuc());
            dongXeMap.put("segment", car.getDongXe().getPhanKhuc());
            dongXeMap.put("xuatXu", car.getDongXe().getXuatXu());
            dongXeMap.put("originCountry", car.getDongXe().getXuatXu());
            dongXeMap.put("moTa", car.getDongXe().getMoTa());
            dto.put("modelId", car.getDongXe().getId());

            if (car.getDongXe().getHangXe() != null) {
                Map<String, Object> hangXeMap = new HashMap<>();
                hangXeMap.put("id", car.getDongXe().getHangXe().getId());
                hangXeMap.put("brandId", car.getDongXe().getHangXe().getId());
                hangXeMap.put("tenHangXe", car.getDongXe().getHangXe().getTenHangXe());
                hangXeMap.put("brandName", car.getDongXe().getHangXe().getTenHangXe());
                hangXeMap.put("name", car.getDongXe().getHangXe().getTenHangXe());
                dongXeMap.put("hangXe", hangXeMap);
                dongXeMap.put("brand", hangXeMap);
            }
            dto.put("dongXe", dongXeMap);
            dto.put("model", dongXeMap);

            // Subtitle
            String brandName = car.getDongXe().getHangXe() != null ? car.getDongXe().getHangXe().getTenHangXe() : "AutoHub";
            dto.put("subtitle", brandName + " • " + car.getDongXe().getTenDongXe() + " • " + (car.getHopSo() != null ? car.getHopSo() : "Tự động"));

            // 4. Sibling Trims / Variants for Model
            if (includeSiblings) {
                List<PhienBanXe> siblings = phienBanXeRepository.findByDongXeId(car.getDongXe().getId()).stream()
                        .filter(v -> !v.isDeleted() && v.isDangHoatDong())
                        .toList();
                List<Map<String, Object>> siblingDtos = siblings.stream().map(s -> {
                    Map<String, Object> sm = new HashMap<>();
                    sm.put("id", s.getId());
                    sm.put("tenPhienBan", s.getTenPhienBan());
                    sm.put("variantName", s.getTenPhienBan());
                    sm.put("name", s.getTenPhienBan());
                    sm.put("giaNiemYet", s.getGiaNiemYet());
                    sm.put("listedPrice", s.getGiaNiemYet());
                    sm.put("mucTienCoc", s.getMucTienCoc());
                    sm.put("depositPrice", s.getMucTienCoc());
                    sm.put("depositAmount", s.getMucTienCoc());
                    sm.put("hopSo", s.getHopSo());
                    sm.put("transmission", s.getHopSo());
                    sm.put("tamHoatDongKm", s.getTamHoatDongKm());
                    sm.put("dungLuongPinKwh", s.getDungLuongPinKwh());
                    sm.put("isCurrent", s.getId().equals(car.getId()));

                    // Short description / badge for UI
                    sm.put("desc", (s.getLoaiNhienLieu() != null ? s.getLoaiNhienLieu() : "Tự động")
                            + (s.getTamHoatDongKm() != null ? " • " + s.getTamHoatDongKm() + " km" : ""));
                    return sm;
                }).toList();
                dto.put("variants", siblingDtos);
            }
        }

        // 5. Images List (both Structured and URLs)
        List<HinhAnhXe> dbImages = hinhAnhXeRepository.findByPhienBanXeIdOrderByThuTuHienThiAsc(car.getId());
        List<String> imageUrls = dbImages.stream().map(HinhAnhXe::getDuongDan).toList();
        List<Map<String, Object>> structuredImages = dbImages.stream().map(img -> {
            Map<String, Object> im = new HashMap<>();
            im.put("id", img.getId());
            im.put("imageUrl", img.getDuongDan());
            im.put("duongDan", img.getDuongDan());
            im.put("viewType", img.getLoaiAnh() != null ? img.getLoaiAnh() : "GALLERY");
            im.put("displayOrder", img.getThuTuHienThi() != null ? img.getThuTuHienThi() : 1);
            if (img.getMauSac() != null) {
                im.put("colorId", img.getMauSac().getId());
                im.put("mauSacId", img.getMauSac().getId());
            }
            return im;
        }).toList();

        String defaultImage = !imageUrls.isEmpty() ? imageUrls.get(0) : "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200";
        dto.put("images", imageUrls.isEmpty() ? List.of(defaultImage) : imageUrls);
        dto.put("imageList", structuredImages);
        dto.put("image", defaultImage);

        // 6. Colors List
        List<Map<String, Object>> formattedColors = (colors != null ? colors : List.<MauSac>of()).stream().map(c -> {
            Map<String, Object> cm = new HashMap<>();
            cm.put("id", c.getId());
            cm.put("colorId", c.getId());
            cm.put("tenMau", c.getTenMau());
            cm.put("name", c.getTenMau());
            cm.put("colorName", c.getTenMau());
            cm.put("maHex", c.getMaHex() != null ? c.getMaHex().trim() : "#0284C7");
            cm.put("hex", c.getMaHex() != null ? c.getMaHex().trim() : "#0284C7");
            cm.put("colorCodeHex", c.getMaHex() != null ? c.getMaHex().trim() : "#0284C7");
            return cm;
        }).toList();
        dto.put("colors", formattedColors);
        dto.put("availableColors", formattedColors);

        return dto;
    }
}
