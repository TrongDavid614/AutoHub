package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiChatMessageDto;
import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.HinhAnhXeRepository;
import com.autohub.core.car.repository.PhienBanXeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class CarCatalogExecutor implements AiIntentExecutor {

    private final PhienBanXeRepository phienBanXeRepository;
    private final HinhAnhXeRepository hinhAnhXeRepository;
    private static final Locale VI_LOCALE = new Locale("vi", "VN");

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.CAR_CONSULTATION;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        log.info("[CarCatalogExecutor] Thực thi truy vấn danh mục xe với sortOrder: {}", decision.sortOrder());
        NumberFormat nf = NumberFormat.getInstance(VI_LOCALE);
        String pLower = originalPrompt != null ? originalPrompt.toLowerCase() : "";

        List<PhienBanXe> allActiveVariants;
        try {
            allActiveVariants = phienBanXeRepository.findAllActiveWithModelAndBrand();
        } catch (Exception e) {
            log.warn("[CarCatalogExecutor] findAllActiveWithModelAndBrand thất bại, fallback sang findAll: {}",
                    e.getMessage());
            allActiveVariants = phienBanXeRepository.findAll().stream()
                    .filter(v -> !v.isDeleted() && v.isDangHoatDong())
                    .collect(Collectors.toList());
        }

        if (allActiveVariants.isEmpty()) {
            return AiExecutionResult.builder()
                    .aiAnswerText(
                            "Hiện tại danh mục xe của AutoHub đang được cập nhật thêm các phiên bản mới. Quý khách vui lòng quay lại sau ít phút hoặc để lại thông tin tư vấn.")
                    .uiBlockType("NONE")
                    .build();
        }

        List<PhienBanXe> matchedVariants = new ArrayList<>(allActiveVariants);

        // 1. Lọc theo Nhiên liệu
        if (decision.fuelType() != null || pLower.contains("điện") || pLower.contains("ev") || pLower.contains("pin")) {
            var temp = matchedVariants.stream()
                    .filter(v -> v.getLoaiNhienLieu() != null &&
                            (v.getLoaiNhienLieu().toLowerCase().contains("điện")
                                    || v.getLoaiNhienLieu().toLowerCase().contains("electric")))
                    .collect(Collectors.toList());
            if (!temp.isEmpty())
                matchedVariants = temp;
        } else if (pLower.contains("xăng") || pLower.contains("gasoline")) {
            var temp = matchedVariants.stream()
                    .filter(v -> v.getLoaiNhienLieu() != null && v.getLoaiNhienLieu().toLowerCase().contains("xăng"))
                    .collect(Collectors.toList());
            if (!temp.isEmpty())
                matchedVariants = temp;
        }

        // 2. Lọc theo Số chỗ ngồi
        if (decision.seats() != null) {
            int reqSeats = decision.seats();
            var temp = matchedVariants.stream()
                    .filter(v -> v.getSoChoNgoi() != null && v.getSoChoNgoi() == reqSeats)
                    .collect(Collectors.toList());
            if (!temp.isEmpty())
                matchedVariants = temp;
        } else if (pLower.contains("7 chỗ") || pLower.contains("bảy chỗ")) {
            var temp = matchedVariants.stream().filter(v -> v.getSoChoNgoi() != null && v.getSoChoNgoi() == 7)
                    .collect(Collectors.toList());
            if (!temp.isEmpty())
                matchedVariants = temp;
        } else if (pLower.contains("5 chỗ") || pLower.contains("năm chỗ")) {
            var temp = matchedVariants.stream().filter(v -> v.getSoChoNgoi() != null && v.getSoChoNgoi() <= 5)
                    .collect(Collectors.toList());
            if (!temp.isEmpty())
                matchedVariants = temp;
        }

        // 3. Lọc theo Phân khúc (SUV / Sedan)
        if ("SUV".equalsIgnoreCase(decision.bodyType()) || pLower.contains("suv") || pLower.contains("gầm cao")) {
            var temp = matchedVariants.stream()
                    .filter(v -> v.getDongXe() != null && v.getDongXe().getPhanKhuc() != null &&
                            (v.getDongXe().getPhanKhuc().toLowerCase().contains("suv")
                                    || v.getDongXe().getPhanKhuc().toLowerCase().contains("crossover")))
                    .collect(Collectors.toList());
            if (!temp.isEmpty())
                matchedVariants = temp;
        } else if ("SEDAN".equalsIgnoreCase(decision.bodyType()) || pLower.contains("sedan")) {
            var temp = matchedVariants.stream()
                    .filter(v -> v.getDongXe() != null && v.getDongXe().getPhanKhuc() != null &&
                            v.getDongXe().getPhanKhuc().toLowerCase().contains("sedan"))
                    .collect(Collectors.toList());
            if (!temp.isEmpty())
                matchedVariants = temp;
        }

        // 4. Lọc theo Ngân sách
        if (decision.budgetLimit() != null) {
            var temp = matchedVariants.stream()
                    .filter(v -> v.getGiaNiemYet() != null && v.getGiaNiemYet().compareTo(decision.budgetLimit()) <= 0)
                    .collect(Collectors.toList());
            if (!temp.isEmpty())
                matchedVariants = temp;
        }

        // 5. Khớp từ khóa xe cụ thể (VD: VF8, SantaFe, Track Edition...)
        // LƯU Ý: Không lọc tên xe nếu câu hỏi đang yêu cầu xếp hạng giá toàn hệ thống
        // (đắt nhất / rẻ nhất)
        String sortOrder = decision.sortOrder() != null ? decision.sortOrder() : "DEFAULT";
        boolean isPriceRanking = "PRICE_DESC".equalsIgnoreCase(sortOrder) || "PRICE_ASC".equalsIgnoreCase(sortOrder);

        if (!isPriceRanking && decision.targetVehicleName() != null && !decision.targetVehicleName().isBlank()) {
            String kw = decision.targetVehicleName().toLowerCase();
            var temp = matchedVariants.stream()
                    .filter(v -> {
                        String fullName = getFullName(v).toLowerCase();
                        boolean matchName = v.getTenPhienBan() != null && v.getTenPhienBan().toLowerCase().contains(kw);
                        boolean matchDongXe = v.getDongXe() != null && v.getDongXe().getTenDongXe() != null
                                && v.getDongXe().getTenDongXe().toLowerCase().contains(kw);
                        return matchName || matchDongXe || fullName.contains(kw);
                    })
                    .collect(Collectors.toList());
            if (!temp.isEmpty())
                matchedVariants = temp;
        }

        if (matchedVariants.isEmpty()) {
            matchedVariants = new ArrayList<>(allActiveVariants);
        }

        // 6. ÁP DỤNG THỨ TỰ SẮP XẾP CHÍNH XÁC (Sort Order)
        if ("PRICE_DESC".equalsIgnoreCase(sortOrder)) {
            matchedVariants.sort((v1, v2) -> {
                BigDecimal p1 = v1.getGiaNiemYet() != null ? v1.getGiaNiemYet() : BigDecimal.ZERO;
                BigDecimal p2 = v2.getGiaNiemYet() != null ? v2.getGiaNiemYet() : BigDecimal.ZERO;
                return p2.compareTo(p1); // Đắt nhất lên đầu
            });
        } else if ("PRICE_ASC".equalsIgnoreCase(sortOrder)) {
            matchedVariants.sort((v1, v2) -> {
                BigDecimal p1 = v1.getGiaNiemYet() != null ? v1.getGiaNiemYet() : BigDecimal.valueOf(Long.MAX_VALUE);
                BigDecimal p2 = v2.getGiaNiemYet() != null ? v2.getGiaNiemYet() : BigDecimal.valueOf(Long.MAX_VALUE);
                return p1.compareTo(p2); // Rẻ nhất lên đầu
            });
        }

        // 7. SINGLE SOURCE OF TRUTH: Xe số 0 là xe trọng tâm cho cả Text phản hồi lẫn
        // Card UI
        PhienBanXe primaryCar = matchedVariants.get(0);
        String primaryFullName = getFullName(primaryCar);
        AiChatMessageDto.AiRecommendedVehicleDto vehicleCard = buildVehicleDto(primaryCar, hinhAnhXeRepository);

        StringBuilder sb = new StringBuilder();
        if ("PRICE_DESC".equalsIgnoreCase(sortOrder)) {
            sb.append("🏆 **PHIÊN BẢN XE ĐẮT GIÁ & CAO CẤP NHẤT TẠI AUTOHUB**\n\n");
            sb.append("Hiện tại, mẫu xe đắt nhất và sở hữu hiệu năng mạnh mẽ nhất trong hệ thống AutoHub là **")
                    .append(primaryFullName).append("** với mức giá niêm yết **")
                    .append(primaryCar.getGiaNiemYet() != null ? nf.format(primaryCar.getGiaNiemYet()) + " VNĐ"
                            : "3.490.000.000 VNĐ")
                    .append("**.\n\n");
            sb.append("🌟 **Thông số nổi bật của siêu phẩm:**\n");
            sb.append("• **Dòng xe:** ")
                    .append(primaryCar.getDongXe() != null ? primaryCar.getDongXe().getTenDongXe() : "AutoHub Series")
                    .append(" (Phân khúc ")
                    .append(primaryCar.getDongXe() != null ? primaryCar.getDongXe().getPhanKhuc() : "Luxury")
                    .append(")\n");
            sb.append("• **Hệ truyền động:** ")
                    .append(primaryCar.getLoaiNhienLieu() != null ? primaryCar.getLoaiNhienLieu()
                            : "Thuần điện 800V SiC (Tri-Motor 1.020 HP)")
                    .append("\n");
            sb.append("• **Tăng tốc 0-100 km/h:** 2.8 giây | Tầm hoạt động: ")
                    .append(primaryCar.getTamHoatDongKm() != null ? primaryCar.getTamHoatDongKm() + " km" : "600 km")
                    .append("\n");
            sb.append("• **Số chỗ ngồi:** ").append(primaryCar.getSoChoNgoi() != null ? primaryCar.getSoChoNgoi() : 5)
                    .append(" chỗ VIP\n");
            sb.append("• **Mức tiền cọc giữ xe 72h:** **")
                    .append(primaryCar.getMucTienCoc() != null ? nf.format(primaryCar.getMucTienCoc()) + " VNĐ"
                            : "20.000.000 VNĐ")
                    .append("** (Được hoàn lại 100% trong 72h nếu đổi ý)\n\n");

            if (matchedVariants.size() > 1) {
                sb.append("📋 **Các phiên bản cao cấp tiếp theo:**\n");
                for (int i = 1; i < Math.min(matchedVariants.size(), 3); i++) {
                    PhienBanXe next = matchedVariants.get(i);
                    sb.append("• **").append(getFullName(next)).append("**: ")
                            .append(next.getGiaNiemYet() != null ? nf.format(next.getGiaNiemYet()) + " VNĐ" : "Liên hệ")
                            .append(" (").append(next.getDongXe() != null ? next.getDongXe().getPhanKhuc() : "Luxury")
                            .append(")\n");
                }
                sb.append("\n");
            }
            sb.append(
                    "Quý khách có thể xem thông tin chi tiết của mẫu xe này ở thẻ bên dưới hoặc bấm 'Đặt cọc giữ xe 72h' để khóa mức giá ưu đãi!");
        } else if ("PRICE_ASC".equalsIgnoreCase(sortOrder)) {
            sb.append("💰 **PHIÊN BẢN XE CÓ MỨC GIÁ TIẾT KIỆM & HẤP DẪN NHẤT**\n\n");
            sb.append("Hiện tại, mẫu xe có mức giá dễ tiếp cận nhất trong hệ thống AutoHub là **")
                    .append(primaryFullName).append("** với giá niêm yết chỉ từ **")
                    .append(primaryCar.getGiaNiemYet() != null ? nf.format(primaryCar.getGiaNiemYet()) + " VNĐ"
                            : "Đang cập nhật")
                    .append("**.\n\n");
            sb.append("🌟 **Thông số cơ bản:**\n");
            sb.append("• **Dòng xe:** ")
                    .append(primaryCar.getDongXe() != null ? primaryCar.getDongXe().getTenDongXe() : "AutoHub Series")
                    .append(" (Phân khúc ")
                    .append(primaryCar.getDongXe() != null ? primaryCar.getDongXe().getPhanKhuc() : "Standard")
                    .append(")\n");
            sb.append("• **Vận hành:** ")
                    .append(primaryCar.getLoaiNhienLieu() != null ? primaryCar.getLoaiNhienLieu() : "Điện")
                    .append("\n");
            sb.append("• **Số chỗ ngồi:** ").append(primaryCar.getSoChoNgoi() != null ? primaryCar.getSoChoNgoi() : 5)
                    .append(" chỗ\n");
            sb.append("• **Tiền cọc giữ xe 72h:** **")
                    .append(primaryCar.getMucTienCoc() != null ? nf.format(primaryCar.getMucTienCoc()) + " VNĐ"
                            : "20.000.000 VNĐ")
                    .append("** (Hoàn 100% trong 72h nếu đổi ý)\n\n");

            if (matchedVariants.size() > 1) {
                sb.append("📋 **Các mẫu xe có mức giá tiếp theo:**\n");
                for (int i = 1; i < Math.min(matchedVariants.size(), 3); i++) {
                    PhienBanXe next = matchedVariants.get(i);
                    sb.append("• **").append(getFullName(next)).append("**: ")
                            .append(next.getGiaNiemYet() != null ? nf.format(next.getGiaNiemYet()) + " VNĐ" : "Liên hệ")
                            .append(" (").append(next.getDongXe() != null ? next.getDongXe().getPhanKhuc() : "Standard")
                            .append(")\n");
                }
                sb.append("\n");
            }
            sb.append("Quý khách có thể xem thông số xe ở thẻ bên dưới hoặc yêu cầu tính phí lăn bánh.");
        } else {
            sb.append("🎯 **KẾT QUẢ TƯ VẤN XE PHÙ HỢP TỪ CSDL AUTOHUB**\n\n");
            sb.append("Dựa trên tiêu chí tìm kiếm của quý khách, mẫu xe phù hợp hàng đầu là:\n\n");
            sb.append("🚗 **").append(primaryFullName).append("**\n");
            sb.append("   • Dòng xe: **")
                    .append(primaryCar.getDongXe() != null ? primaryCar.getDongXe().getTenDongXe() : "AutoHub Series")
                    .append("** (")
                    .append(primaryCar.getDongXe() != null ? primaryCar.getDongXe().getPhanKhuc() : "Luxury")
                    .append(")\n");
            sb.append("   • Giá niêm yết: **")
                    .append(primaryCar.getGiaNiemYet() != null ? nf.format(primaryCar.getGiaNiemYet()) + " VNĐ"
                            : "Đang cập nhật")
                    .append("**\n");
            sb.append("   • Vận hành: ").append(
                    primaryCar.getLoaiNhienLieu() != null ? primaryCar.getLoaiNhienLieu() : "Thuần điện 800V SiC");
            if (primaryCar.getTamHoatDongKm() != null) {
                sb.append(" (Tầm hoạt động: ").append(primaryCar.getTamHoatDongKm()).append(" km, Pin: ")
                        .append(primaryCar.getDungLuongPinKwh() != null ? primaryCar.getDungLuongPinKwh() : 100)
                        .append(" kWh)");
            }
            sb.append("\n");
            sb.append("   • Số chỗ ngồi: ").append(primaryCar.getSoChoNgoi() != null ? primaryCar.getSoChoNgoi() : 5)
                    .append(" chỗ VIP\n");
            sb.append("   • Tiền cọc giữ xe 72h: **")
                    .append(primaryCar.getMucTienCoc() != null ? nf.format(primaryCar.getMucTienCoc()) + " VNĐ"
                            : "20.000.000 VNĐ")
                    .append("** (Hoàn tiền 100% trong 72h)\n\n");

            if (matchedVariants.size() > 1) {
                sb.append("Ngoài ra, quý khách có thể tham khảo thêm: ");
                for (int i = 1; i < Math.min(matchedVariants.size(), 3); i++) {
                    sb.append("**").append(getFullName(matchedVariants.get(i))).append("**");
                    if (i < Math.min(matchedVariants.size(), 3) - 1)
                        sb.append(", ");
                }
                sb.append(".\n\n");
            }
            sb.append(
                    "Quý khách có thể yêu cầu: *'Tính chi phí lăn bánh tại Hà Nội'* hoặc *'Kiểm tra tồn kho xe sẵn giao'*!");
        }

        StringBuilder ctx = new StringBuilder();
        ctx.append("DANH SÁCH DỮ LIỆU XE THỰC TẾ TRÍCH XUẤT TỪ CƠ SỞ DỮ LIỆU SQL SERVER AUTOHUBDB (TIÊU CHÍ '")
                .append(sortOrder).append("'):\n");
        for (int i = 0; i < Math.min(matchedVariants.size(), 8); i++) {
            PhienBanXe v = matchedVariants.get(i);
            String fn = getFullName(v);
            ctx.append(i == 0 ? "👉 [XE TRỌNG TÂM #1 - GẮN THẺ BÊN DƯỚI]: " : "   [" + (i + 1) + "]. ")
                    .append(fn)
                    .append(" | Giá niêm yết: ")
                    .append(v.getGiaNiemYet() != null ? nf.format(v.getGiaNiemYet()) + " VNĐ" : "Liên hệ")
                    .append(" | Dòng xe: ").append(v.getDongXe() != null ? v.getDongXe().getTenDongXe() : "")
                    .append(" | Hãng: ")
                    .append(v.getDongXe() != null && v.getDongXe().getHangXe() != null
                            ? v.getDongXe().getHangXe().getTenHangXe()
                            : "")
                    .append(" | Phân khúc: ")
                    .append(v.getDongXe() != null && v.getDongXe().getPhanKhuc() != null ? v.getDongXe().getPhanKhuc()
                            : "")
                    .append(" | Số chỗ: ").append(v.getSoChoNgoi() != null ? v.getSoChoNgoi() + " chỗ" : "5 chỗ")
                    .append(" | Nhiên liệu: ").append(v.getLoaiNhienLieu() != null ? v.getLoaiNhienLieu() : "Điện")
                    .append(" | Mức cọc 72h: ")
                    .append(v.getMucTienCoc() != null ? nf.format(v.getMucTienCoc()) + " VNĐ" : "20.000.000 VNĐ")
                    .append("\n");
        }
        ctx.append("\nLUẬT CỨNG XỬ LÝ (STRICT CONSTRAINTS):\n");
        if ("PRICE_ASC".equalsIgnoreCase(sortOrder)) {
            ctx.append("- Câu hỏi yêu cầu tìm XE RẺ NHẤT / GIÁ THẤP NHẤT.\n")
                    .append("- Mẫu xe có mức giá thấp nhất thực tế trong CSDL AutoHub là: **").append(primaryFullName)
                    .append("** (Giá niêm yết: **")
                    .append(primaryCar.getGiaNiemYet() != null ? nf.format(primaryCar.getGiaNiemYet()) + " VNĐ" : "")
                    .append("**).\n")
                    .append("- BẮT BUỘC câu trả lời phải khẳng định mẫu xe này là xe rẻ nhất trong hệ thống AutoHub. Khóa chặt mẫu xe này làm câu trả lời chính.\n");
        } else if ("PRICE_DESC".equalsIgnoreCase(sortOrder)) {
            ctx.append("- Câu hỏi yêu cầu tìm XE ĐẮT NHẤT / GIÁ CAO NHẤT.\n")
                    .append("- Mẫu xe có mức giá cao nhất thực tế trong CSDL AutoHub là: **").append(primaryFullName)
                    .append("** (Giá niêm yết: **")
                    .append(primaryCar.getGiaNiemYet() != null ? nf.format(primaryCar.getGiaNiemYet()) + " VNĐ" : "")
                    .append("**).\n")
                    .append("- BẮT BUỘC câu trả lời phải khẳng định mẫu xe này là xe đắt nhất trong hệ thống AutoHub. Khóa chặt mẫu xe này làm câu trả lời chính.\n");
        }
        ctx.append(
                "- TUYỆT ĐỐI CHỈ ĐƯỢC nhắc tới các mẫu xe và giá có trong danh sách trên. CẤM tự bịa ra bất kỳ mẫu xe nào khác hoặc tự sửa giá.\n");
        ctx.append("- Mẫu xe [XE TRỌNG TÂM #1] (").append(primaryFullName).append(
                ") đã được hệ thống gắn vào thẻ hiển thị trực quan (recommendedCar) bên dưới câu trả lời của bạn.");
        boolean isPluralQuery = pLower.contains("các loại") || pLower.contains("những xe") ||
                pLower.contains("danh sách") || pLower.contains("tất cả") || pLower.contains("những dòng") ||
                pLower.contains("toàn bộ") || pLower.contains("các xe") || pLower.contains("có những xe");

        if (isPluralQuery) {
            // Khi hỏi danh sách/tất cả: lấy toàn bộ danh mục xe đang hoạt động
            List<PhienBanXe> listToShow = matchedVariants.size() > 1 ? matchedVariants : allActiveVariants;
            sb = new StringBuilder();
            sb.append("📋 **DANH SÁCH TOÀN BỘ CÁC DÒNG XE TẠI AUTOHUB**\n\n");
            sb.append(
                    "Hệ sinh thái AutoHub hiện đang phân phối đầy đủ các phiên bản xe điện và xe thể thao cao cấp có sẵn giao ngay:\n\n");
            int idx = 1;
            for (PhienBanXe v : listToShow) {
                sb.append(idx++).append(". 🚗 **").append(getFullName(v)).append("**\n");
                sb.append("   • Phân khúc: ").append(v.getDongXe() != null ? v.getDongXe().getPhanKhuc() : "Luxury")
                        .append(" (").append(v.getSoChoNgoi() != null ? v.getSoChoNgoi() : 5).append(" chỗ)\n");
                sb.append("   • Giá niêm yết: **")
                        .append(v.getGiaNiemYet() != null ? nf.format(v.getGiaNiemYet()) + " VNĐ" : "Liên hệ")
                        .append("**\n");
                sb.append("   • Động cơ / Tầm hoạt động: ")
                        .append(v.getLoaiNhienLieu() != null ? v.getLoaiNhienLieu() : "Điện 800V SiC");
                if (v.getTamHoatDongKm() != null)
                    sb.append(" - ").append(v.getTamHoatDongKm()).append(" km");
                sb.append("\n   • Cọc giữ xe 72h: **")
                        .append(v.getMucTienCoc() != null ? nf.format(v.getMucTienCoc()) + " VNĐ" : "20.000.000 VNĐ")
                        .append("** (Hoàn 100% trong 72h)\n\n");
            }
            sb.append(
                    "👉 Quý khách có thể bấm *'Đăng ký lái thử'* hoặc yêu cầu *'Tính chi phí lăn bánh [Tên xe]'* để tôi hỗ trợ ngay nhé!");
        }
        return AiExecutionResult.builder()
                .aiAnswerText(sb.toString())
                .retrievedContext(ctx.toString())
                .uiBlockType("CAR_CARD")
                .recommendedVehicle(vehicleCard)
                .suggestedPrompts(List.of(
                        "Tính chi phí lăn bánh " + primaryFullName + " tại Hà Nội",
                        "Kiểm tra tồn kho " + primaryFullName + " sẵn giao",
                        "Chính sách bảo hành pin xe điện 800V SiC",
                        "Đặt cọc giữ xe " + primaryFullName + " 72h ngay bây giờ"))
                .build();
    }

    public static AiChatMessageDto.AiRecommendedVehicleDto buildVehicleDto(PhienBanXe selectedVariant) {
        return buildVehicleDto(selectedVariant, null);
    }

    public static AiChatMessageDto.AiRecommendedVehicleDto buildVehicleDto(PhienBanXe selectedVariant,
            HinhAnhXeRepository hinhAnhXeRepository) {
        if (selectedVariant == null)
            return null;

        String fullName = getFullName(selectedVariant);
        String nameLower = fullName.toLowerCase();
        String fuel = selectedVariant.getLoaiNhienLieu() != null ? selectedVariant.getLoaiNhienLieu() : "Thuần điện";
        long price = selectedVariant.getGiaNiemYet() != null ? selectedVariant.getGiaNiemYet().longValue()
                : 2890000000L;

        // 1. Hình ảnh xe (Single Source of Truth từ CSDL dbo.hinh_anh_xe, fallback ảnh
        // chuẩn theo từng mẫu)
        String imageUrl = null;
        if (hinhAnhXeRepository != null && selectedVariant.getId() != null) {
            try {
                var images = hinhAnhXeRepository.findByPhienBanXeIdOrderByThuTuHienThiAsc(selectedVariant.getId());
                if (images != null && !images.isEmpty()) {
                    imageUrl = images.get(0).getDuongDan();
                }
            } catch (Exception e) {
                log.warn("[CarCatalogExecutor] Không thể lấy ảnh từ hinh_anh_xe: {}", e.getMessage());
            }
        }

        if (imageUrl == null || imageUrl.isBlank()) {
            if (nameLower.contains("vf8")) {
                imageUrl = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200";
            } else if (nameLower.contains("vf9")) {
                imageUrl = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200";
            } else if (nameLower.contains("santafe") || nameLower.contains("santa fe")) {
                imageUrl = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200";
            } else if (nameLower.contains("everest")) {
                imageUrl = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200";
            } else if (nameLower.contains("track")) {
                imageUrl = "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200";
            } else if (nameLower.contains("standard")) {
                imageUrl = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200";
            } else if (nameLower.contains("suv") || nameLower.contains("cross")) {
                imageUrl = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200";
            } else if (nameLower.contains("sport") || nameLower.contains("tourer")) {
                imageUrl = "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200";
            } else if (nameLower.contains("executive")) {
                imageUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200";
            } else {
                imageUrl = "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200";
            }
        }

        // 2. Badge & Danh hiệu xe
        String badge = "TIÊU CHUẨN";
        if (nameLower.contains("track")) {
            badge = "FLAGSHIP • TRACK";
        } else if (nameLower.contains("touring")) {
            badge = "FLAGSHIP • KHUYÊN DÙNG";
        } else if (nameLower.contains("vf8")) {
            badge = "BEST SELLER • GIÁ TỐT NHẤT";
        } else if (nameLower.contains("vf9")) {
            badge = "SUV FULL-SIZE • GHẾ CƠ TRƯỞNG";
        } else if (nameLower.contains("santafe")) {
            badge = "HYBRID TIẾT KIỆM XĂNG";
        } else if (nameLower.contains("everest")) {
            badge = "SUV 7 CHỖ ĐỊA HÌNH";
        } else if (price < 1500000000L) {
            badge = "TIẾT KIỆM & HẤP DẪN";
        } else if (price >= 3000000000L) {
            badge = "FLAGSHIP 2026";
        }

        // 3. Nhãn công nghệ / Động cơ
        String flagshipLabel;
        if (nameLower.contains("track")) {
            flagshipLabel = "Hiệu Năng Đường Đua Tri-Motor 1.020 HP";
        } else if (nameLower.contains("touring")) {
            flagshipLabel = "Công Nghệ 800V SiC Sạc Siêu Nhanh";
        } else if (nameLower.contains("vf8")) {
            flagshipLabel = "Động Cơ Điện Kép AWD & Trợ Lý ViVi";
        } else if (nameLower.contains("vf9")) {
            flagshipLabel = "SUV Điện Cỡ Lớn Ghế Thương Gia";
        } else if (nameLower.contains("santafe")) {
            flagshipLabel = "Động Cơ SmartStream Full Hybrid 230 HP";
        } else if (nameLower.contains("everest")) {
            flagshipLabel = "Động Cơ Bi-Turbo Diesel 210 PS 4x4";
        } else if (fuel.toLowerCase().contains("800v")) {
            flagshipLabel = "Công Nghệ 800V SiC Siêu Nhanh";
        } else {
            flagshipLabel = fuel;
        }

        // 4. Gia tốc 0-100 km/h
        String accel = "3.5 giây";
        if (nameLower.contains("track")) {
            accel = "2.8 giây";
        } else if (nameLower.contains("touring")) {
            accel = "3.2 giây";
        } else if (nameLower.contains("standard")) {
            accel = "3.8 giây";
        } else if (nameLower.contains("tourer")) {
            accel = "3.3 giây";
        } else if (nameLower.contains("vf8")) {
            accel = "5.5 giây";
        } else if (nameLower.contains("vf9")) {
            accel = "6.5 giây";
        } else if (nameLower.contains("santafe")) {
            accel = "8.2 giây";
        } else if (nameLower.contains("everest")) {
            accel = "9.5 giây";
        }

        // 5. Nội thất & Trang bị
        String interior = "Da Cao Cấp & Màn Hình Cảm Ứng Đa Điểm";
        if (nameLower.contains("track")) {
            interior = "Ghế Đua Carbon Siêu Nhẹ & Dây An Toàn Đa Điểm";
        } else if (nameLower.contains("touring")) {
            interior = "Da Nappa Thương Gia & Lọc Khí Ion Âm";
        } else if (nameLower.contains("vf8")) {
            interior = "Da Nhân Tạo Cao Cấp & Màn Hình 15.6 inch ViVi";
        } else if (nameLower.contains("vf9")) {
            interior = "Ghế Cơ Trưởng Captain Seats & Massage 3D";
        } else if (nameLower.contains("santafe")) {
            interior = "Da Nappa Ghế Cơ Trưởng & Âm Thanh Bose 12 Loa";
        } else if (nameLower.contains("everest")) {
            interior = "Da Cao Cấp Ebony & Âm Thanh Bang & Olufsen";
        }

        String segment = selectedVariant.getDongXe() != null && selectedVariant.getDongXe().getPhanKhuc() != null
                ? selectedVariant.getDongXe().getPhanKhuc()
                : (nameLower.contains("suv") || nameLower.contains("vf8") || nameLower.contains("vf9") ? "D-SUV"
                        : "Luxury Sedan");

        return AiChatMessageDto.AiRecommendedVehicleDto.builder()
                .variantId(selectedVariant.getId())
                .modelId(selectedVariant.getDongXe() != null ? selectedVariant.getDongXe().getId() : 1L)
                .name(fullName)
                .badge(badge)
                .categoryBadge(segment)
                .availabilityBadge("GIAO NGAY 72H")
                .flagshipLabel(flagshipLabel)
                .listedPrice(price)
                .priceNote("Giá niêm yết đã bao gồm VAT")
                .imageUrl(imageUrl)
                .acceleration0100(accel)
                .rangeKm(selectedVariant.getTamHoatDongKm() != null ? selectedVariant.getTamHoatDongKm() : 500)
                .interior(interior)
                .seats((selectedVariant.getSoChoNgoi() != null ? selectedVariant.getSoChoNgoi() : 5) + " Chỗ ngồi")
                .safetyRating("5 Sao")
                .safetyOrg("EURO NCAP / ASEAN NCAP")
                .deliveryTime("Giao ngay tại Showroom")
                .depositAmount(selectedVariant.getMucTienCoc() != null
                        ? selectedVariant.getMucTienCoc().longValue()
                        : 20000000L)
                .build();
    }

    public static String getFullName(PhienBanXe v) {
        if (v == null)
            return "AutoHub Vehicle";
        String brand = (v.getDongXe() != null && v.getDongXe().getHangXe() != null
                && v.getDongXe().getHangXe().getTenHangXe() != null)
                        ? v.getDongXe().getHangXe().getTenHangXe().trim()
                        : "";
        String model = (v.getDongXe() != null && v.getDongXe().getTenDongXe() != null)
                ? v.getDongXe().getTenDongXe().trim()
                : "";
        String variant = v.getTenPhienBan() != null ? v.getTenPhienBan().trim() : "";

        if (variant.isBlank()) {
            return (brand + " " + model).trim();
        }

        String varLower = variant.toLowerCase();
        String brandLower = brand.toLowerCase();
        String modelLower = model.toLowerCase();

        // Nếu tên phiên bản đã chứa cả tên hãng và tên dòng xe (ví dụ: AutoHub GT-e
        // Track Edition, VinFast VF8 Plus AWD)
        if (!brandLower.isBlank() && !modelLower.isBlank() && varLower.contains(brandLower)
                && varLower.contains(modelLower)) {
            return variant;
        }

        StringBuilder sb = new StringBuilder();
        // Thêm tên hãng nếu variant chưa có và model cũng chưa có tên hãng
        if (!brand.isBlank() && !varLower.contains(brandLower) && !modelLower.contains(brandLower)) {
            sb.append(brand).append(" ");
        }
        // Thêm tên dòng xe nếu variant chưa có
        if (!model.isBlank() && !varLower.contains(modelLower)) {
            sb.append(model).append(" ");
        }
        sb.append(variant);
        return sb.toString().trim().replaceAll("\\s+", " ");
    }
}
