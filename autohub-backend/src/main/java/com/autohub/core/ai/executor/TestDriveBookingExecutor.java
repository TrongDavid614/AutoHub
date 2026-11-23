package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import com.autohub.core.ai.tools.BookTestDriveTool;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
@RequiredArgsConstructor
public class TestDriveBookingExecutor implements AiIntentExecutor {

    private final PhienBanXeRepository phienBanXeRepository;
    private final BookTestDriveTool bookTestDriveTool;
    private static final Locale VI_LOCALE = new Locale("vi", "VN");

    @Override
    public boolean supports(AiIntent intent) {
        return intent == AiIntent.BOOK_TEST_DRIVE;
    }

    @Override
    public AiExecutionResult execute(AiRouteDecision decision, String originalPrompt) {
        log.info("[TestDriveBookingExecutor] Tiếp nhận yêu cầu đăng ký lái thử: '{}'", originalPrompt);
        String pLower = originalPrompt != null ? originalPrompt.toLowerCase() : "";
        NumberFormat nf = NumberFormat.getInstance(VI_LOCALE);

        // 1. Trích xuất tên xe và số điện thoại (nếu có)
        String targetCar = decision.targetVehicleName();
        if (targetCar == null || targetCar.isBlank()) {
            targetCar = extractCarFromText(pLower);
        }
        String phone = extractPhoneNumber(originalPrompt);

        // =========================================================================
        // GIAI ĐOẠN 3: Người dùng ĐÃ CUNG CẤP SỐ ĐIỆN THOẠI -> Tiến hành đặt lịch vào
        // DB
        // =========================================================================
        if (phone != null && !phone.isBlank()) {
            log.info("[TestDriveBookingExecutor] Đủ thông tin SĐT={}, tiến hành đặt lịch lái thử", phone);
            String hoTen = extractCustomerName(originalPrompt, phone);
            String showroom = extractShowroom(pLower);
            String thoiGian = originalPrompt;
            String tenXeDat = (targetCar != null && !targetCar.isBlank()) ? targetCar : "AutoHub GT-e Grand Touring";

            BookTestDriveTool.BookingResult result = bookTestDriveTool.bookTestDrive(
                    hoTen, phone, tenXeDat, showroom, thoiGian, "Đăng ký trực tiếp qua Trợ lý AI AutoHub");

            if (result.isSuccess()) {
                String confirmText = String.format(
                        """
                                🎉 **ĐĂNG KÝ LỊCH HẸN LÁI THỬ THÀNH CÔNG!**

                                Hệ thống AutoHub đã ghi nhận lịch hẹn trải nghiệm của quý khách:
                                • 🔖 **Mã lịch hẹn:** #LHT-%d
                                • 👤 **Khách hàng:** %s (%s)
                                • 🚗 **Mẫu xe trải nghiệm:** **%s**
                                • 🏢 **Địa điểm:** %s (%s)
                                • ⏰ **Thời gian hẹn:** %s
                                • 📋 **Trạng thái:** %s

                                📞 Chuyên viên tư vấn showroom sẽ liên hệ với quý khách trước 30 phút để xác nhận lộ trình chạy thử.
                                🪪 Khi đến trải nghiệm, quý khách vui lòng mang theo **Giấy phép lái xe (GPLX)** còn hiệu lực nhé!

                                AutoHub rất hân hạnh được đón tiếp và phục vụ quý khách!
                                """
                                .trim(),
                        result.getBookingId(),
                        result.getTenKhachHang(),
                        result.getSoDienThoai(),
                        result.getTenXe(),
                        result.getTenShowroom(),
                        result.getDiaChiShowroom(),
                        result.getThoiGianHen(),
                        result.getTrangThai());

                return AiExecutionResult.builder()
                        .aiAnswerText(confirmText)
                        .uiBlockType("NONE")
                        .recommendedVehicle(null)
                        .suggestedPrompts(List.of(
                                "Dự toán chi phí lăn bánh " + tenXeDat,
                                "Chính sách đặt cọc giữ xe 72h hoàn tiền 100%",
                                "Kiểm tra tồn kho xe có sẵn giao ngay"))
                        .build();
            }
        }

        // =========================================================================
        // GIAI ĐOẠN 2: Người dùng ĐÃ CHỌN XE -> Hỏi các thông tin cần thiết
        // =========================================================================
        if (targetCar != null && !targetCar.isBlank()) {
            log.info("[TestDriveBookingExecutor] Đã có xe '{}', yêu cầu cung cấp thông tin liên hệ", targetCar);
            String askInfoText = String
                    .format("""
                            Dạ vâng! Tôi đã ghi nhận quý khách muốn đăng ký trải nghiệm mẫu xe **%s**.

                            Để Showroom AutoHub chuẩn bị sẵn xe lái thử và sắp xếp chuyên viên đón tiếp chu đáo nhất, quý khách vui lòng cung cấp giúp tôi các thông tin sau nhé:
                            1. 👤 **Họ và tên** của quý khách
                            2. 📱 **Số điện thoại** liên hệ (10 chữ số)
                            3. 🏢 **Showroom / Tỉnh thành** quý khách muốn trải nghiệm (ví dụ: Showroom Hà Nội, TP.HCM, Đà Nẵng...)
                            4. ⏰ **Thời gian dự kiến** (ví dụ: 09:00 sáng mai hoặc thứ 7 tuần này)

                            *(Quý khách có thể nhắn liền một câu, ví dụ: 'Nguyễn Văn A, 0912345678, Showroom Hà Nội, 9h sáng mai' nhé!)*
                            """
                            .trim(), targetCar);

            return AiExecutionResult.builder()
                    .aiAnswerText(askInfoText)
                    .uiBlockType("NONE")
                    .recommendedVehicle(null)
                    .suggestedPrompts(List.of(
                            "Tôi muốn lái thử tại Showroom Hà Nội",
                            "Tôi muốn lái thử tại Showroom TP.HCM",
                            "Tôi muốn chọn mẫu xe khác"))
                    .build();
        }

        // =========================================================================
        // GIAI ĐOẠN 1: Chưa chọn xe cụ thể -> Hiển thị TOP 5 XE ĐƯỢC YÊU THÍCH NHẤT
        // =========================================================================
        log.info("[TestDriveBookingExecutor] Chưa có tên xe, xuất danh sách Top 5 xe yêu thích");
        List<PhienBanXe> activeCars = phienBanXeRepository.findAll().stream()
                .filter(v -> !v.isDeleted() && v.isDangHoatDong())
                .limit(5)
                .toList();

        StringBuilder sb = new StringBuilder();
        sb.append("🏎️ **DANH SÁCH TOP 5 MẪU XE ĐƯỢC YÊU THÍCH NHẤT TẠI AUTOHUB:**\n\n");

        int index = 1;
        for (PhienBanXe v : activeCars) {
            sb.append(index++).append(". **").append(v.getTenPhienBan()).append("**\n");
            sb.append("   • Phân khúc: ").append(v.getDongXe() != null ? v.getDongXe().getPhanKhuc() : "Luxury");
            sb.append(" (").append(v.getSoChoNgoi() != null ? v.getSoChoNgoi() : 5).append(" chỗ)\n");
            sb.append("   • Tầm hoạt động: ")
                    .append(v.getTamHoatDongKm() != null ? v.getTamHoatDongKm() + " km" : "680 km (WLTP)");
            sb.append(" | Động cơ: ").append(v.getLoaiNhienLieu() != null ? v.getLoaiNhienLieu() : "Điện 800V SiC")
                    .append("\n");
            sb.append("   • Giá niêm yết: **")
                    .append(v.getGiaNiemYet() != null ? nf.format(v.getGiaNiemYet()) + " VNĐ" : "Liên hệ")
                    .append("**\n\n");
        }

        sb.append(
                "👉 **Quý khách có muốn chọn trải nghiệm một trong top 5 mẫu xe được yêu thích nhất ở trên không ạ?**\n");
        sb.append(
                "*(Nếu quý khách chưa ưng ý hoặc đang quan tâm dòng xe nào khác ngoài danh sách, xin vui lòng cho tôi biết tên mẫu xe mong muốn nhé!)*");

        List<String> promptOptions = activeCars.stream()
                .map(c -> "Lái thử " + c.getTenPhienBan())
                .limit(4)
                .collect(java.util.stream.Collectors.toList());
        promptOptions.add("Tôi muốn chọn mẫu xe khác");

        return AiExecutionResult.builder()
                .aiAnswerText(sb.toString().trim())
                .uiBlockType("NONE")
                .recommendedVehicle(null)
                .suggestedPrompts(promptOptions)
                .build();
    }

    private String extractAppointmentTime(String text) {
        if (text == null)
            return "09:00 ngày mai";
        String lower = text.toLowerCase();
        if (lower.contains("sáng mai"))
            return "09:00 sáng mai";
        if (lower.contains("chiều mai"))
            return "14:30 chiều mai";
        if (lower.contains("ngày mai") || lower.contains("mai"))
            return "09:00 ngày mai";
        if (lower.contains("hôm nay") || lower.contains("chiều nay"))
            return "15:00 hôm nay";
        if (lower.contains("thứ 7") || lower.contains("thứ bảy"))
            return "09:00 Thứ Bảy tuần này";
        if (lower.contains("chủ nhật"))
            return "09:00 Chủ Nhật tuần này";
        return "09:00 ngày mai";
    }

    private String extractPhoneNumber(String text) {
        if (text == null)
            return null;
        Pattern pattern = Pattern.compile("(0[35789][0-9]{8}|0[0-9]{9})");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private String extractCustomerName(String text, String phone) {
        if (text == null)
            return "Quý khách";
        String[] parts = text.split("[,;\\n]");
        for (String part : parts) {
            String trimmed = part.trim();
            if (!trimmed.contains(phone) && trimmed.length() >= 2 && trimmed.length() <= 30
                    && !trimmed.toLowerCase().contains("showroom") && !trimmed.toLowerCase().contains("lái thử")) {
                return trimmed;
            }
        }
        return "Quý khách";
    }

    private String extractShowroom(String text) {
        if (text.contains("hồ chí minh") || text.contains("tp.hcm") || text.contains("sài gòn")
                || text.contains("quận 7")) {
            return "Hồ Chí Minh";
        } else if (text.contains("đà nẵng")) {
            return "Đà Nẵng";
        } else if (text.contains("hải phòng")) {
            return "Hải Phòng";
        }
        return "Hà Nội";
    }

    private String extractCarFromText(String text) {
        if (text == null)
            return null;
        if (text.contains("track"))
            return "AutoHub GT-e Track Edition";
        if (text.contains("grand touring"))
            return "AutoHub GT-e Grand Touring";
        if (text.contains("cross touring") || text.contains("suv-e"))
            return "AutoHub SUV-e Cross Touring";
        if (text.contains("vf8") || text.contains("vf 8"))
            return "VinFast VF8";
        if (text.contains("vf9") || text.contains("vf 9"))
            return "VinFast VF9";
        if (text.contains("santafe"))
            return "Hyundai SantaFe";
        if (text.contains("everest"))
            return "Ford Everest";
        return null;
    }
}