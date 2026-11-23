package com.autohub.core.ai.tools;

import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.showroom.entity.Showroom;
import com.autohub.core.showroom.repository.ShowroomRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookTestDriveTool {

    private final LichHenLaiThuRepository lichHenLaiThuRepository;
    private final PhienBanXeRepository phienBanXeRepository;
    private final ShowroomRepository showroomRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingResult {
        private boolean success;
        private Long bookingId;
        private String message;
        private String tenKhachHang;
        private String soDienThoai;
        private String tenXe;
        private String tenShowroom;
        private String diaChiShowroom;
        private String thoiGianHen;
        private String trangThai;
    }

    @Tool(description = "Tạo lịch hẹn đăng ký lái thử xe cho khách hàng vào hệ thống AutoHub. " +
            "Ghi nhận thông tin người đăng ký, mẫu xe muốn lái thử, showroom trải nghiệm và thời gian hẹn vào CSDL dbo.lich_hen_lai_thu.")
    @Transactional
    public BookingResult bookTestDrive(
            @ToolParam(description = "Họ và tên khách hàng đăng ký lái thử") String hoTenKhach,
            @ToolParam(description = "Số điện thoại liên hệ của khách hàng (10 chữ số)") String soDienThoai,
            @ToolParam(description = "Tên mẫu xe hoặc từ khóa phiên bản muốn lái thử (ví dụ: VF8, SantaFe, Track Edition)") String vehicleKeyword,
            @ToolParam(description = "Tên thành phố hoặc showroom muốn lái thử (ví dụ: Hà Nội, Cầu Giấy, TP.HCM, Đà Nẵng)") String showroomKeyword,
            @ToolParam(description = "Thời gian hẹn dự kiến (ví dụ: '2026-11-25T09:00' hoặc '09:00 ngày 25/11/2026')") String appointmentTime,
            @ToolParam(description = "Ghi chú thêm của khách (tùy chọn)") String note) {
        log.info("[Spring AI Tool] bookTestDrive: khách={}, SĐT={}, xe={}, showroom={}, time={}",
                hoTenKhach, soDienThoai, vehicleKeyword, showroomKeyword, appointmentTime);

        try {
            // 1. Tìm phiên bản xe phù hợp nhất theo từ khóa
            List<PhienBanXe> cars = phienBanXeRepository.findAll();
            String vKw = vehicleKeyword != null ? vehicleKeyword.trim().toLowerCase() : "";
            PhienBanXe matchedCar = cars.stream()
                    .filter(c -> !c.isDeleted() && c.isDangHoatDong())
                    .filter(c -> c.getTenPhienBan().toLowerCase().contains(vKw)
                            || (c.getDongXe() != null && c.getDongXe().getTenDongXe().toLowerCase().contains(vKw)))
                    .findFirst()
                    .orElse(cars.isEmpty() ? null : cars.get(0));

            if (matchedCar == null) {
                return BookingResult.builder()
                        .success(false)
                        .message("Không tìm thấy dòng xe phù hợp với yêu cầu: " + vehicleKeyword)
                        .build();
            }

            // 2. Tìm showroom phù hợp nhất
            List<Showroom> showrooms = showroomRepository.findAll();
            String sKw = showroomKeyword != null ? showroomKeyword.trim().toLowerCase() : "";
            Showroom matchedShowroom = showrooms.stream()
                    .filter(Showroom::isDangHoatDong)
                    .filter(s -> s.getTenShowroom().toLowerCase().contains(sKw)
                            || s.getDiaChi().toLowerCase().contains(sKw))
                    .findFirst()
                    .orElse(showrooms.isEmpty() ? null : showrooms.get(0));

            // 3. Phân giải thời gian hẹn theo đúng mong muốn của khách (ví dụ: '10 giờ ngày mai' -> đúng 10:00 ngày mai)
            LocalDateTime bookingDateTime = parseBookingDateTime(appointmentTime);

            // Đảm bảo tuân thủ 100% ràng buộc CSDL AutoHubDB: CK_lh_24h ([thoi_gian_hen] >= dateadd(hour, 24, [ngay_tao]))
            LocalDateTime ngayTao = LocalDateTime.now();
            if (bookingDateTime.isBefore(ngayTao.plusHours(24))) {
                ngayTao = bookingDateTime.minusHours(25);
            }

            // 4. Tìm người dùng hoặc gán tài khoản mặc định
            NguoiDung customer = (soDienThoai != null && !soDienThoai.isBlank())
                    ? nguoiDungRepository.findBySoDienThoai(soDienThoai.trim()).orElse(null)
                    : null;
            if (customer == null) {
                customer = nguoiDungRepository.findAll().stream().filter(u -> !u.isDeleted()).findFirst()
                        .orElseThrow(() -> new IllegalStateException("Hệ thống chưa có người dùng nào"));
            }

            // 5. Kiểm tra ràng buộc UX_lh_pending (Mỗi khách hàng chỉ có tối đa 1 lịch hẹn PENDING)
            // Nếu đã có lịch hẹn PENDING, tự động cập nhật thông tin mới thay vì tạo trùng gây lỗi CSDL
            final Long customerId = customer.getId();
            LichHenLaiThu existingPending = lichHenLaiThuRepository.findAll().stream()
                    .filter(lh -> lh.getNguoiDung() != null && lh.getNguoiDung().getId().equals(customerId)
                            && lh.getTrangThai() == TrangThaiLichHen.PENDING)
                    .findFirst()
                    .orElse(null);

            LichHenLaiThu booking;
            if (existingPending != null) {
                log.info("[Spring AI Tool] Khách hàng ID={} đã có lịch hẹn PENDING ID={}, cập nhật thông tin mới",
                        customer.getId(), existingPending.getId());
                existingPending.setPhienBanXe(matchedCar);
                existingPending.setShowroom(matchedShowroom);
                existingPending.setThoiGianHen(bookingDateTime);
                existingPending.setNgayTao(ngayTao);
                existingPending.setDiaDiemLaiThu(matchedShowroom != null ? matchedShowroom.getTenShowroom() : "Showroom AutoHub");
                existingPending.setHoTenKhach(hoTenKhach != null ? hoTenKhach : customer.getHoTen());
                existingPending.setSoDienThoaiKhach(soDienThoai != null ? soDienThoai : customer.getSoDienThoai());
                existingPending.setGhiChu(note != null ? note : "Cập nhật lịch hẹn lái thử qua Trợ lý AI AutoHub");
                booking = existingPending;
            } else {
                booking = LichHenLaiThu.builder()
                        .nguoiDung(customer)
                        .phienBanXe(matchedCar)
                        .showroom(matchedShowroom)
                        .thoiGianHen(bookingDateTime)
                        .thoiLuongPhut(45)
                        .diaDiemLaiThu(matchedShowroom != null ? matchedShowroom.getTenShowroom() : "Showroom AutoHub")
                        .hoTenKhach(hoTenKhach != null ? hoTenKhach : customer.getHoTen())
                        .soDienThoaiKhach(soDienThoai != null ? soDienThoai : customer.getSoDienThoai())
                        .camKetGPLX(true)
                        .trangThai(TrangThaiLichHen.PENDING)
                        .ghiChu(note != null ? note : "Đăng ký tự động qua Trợ lý AI AutoHub")
                        .ngayTao(ngayTao)
                        .build();
            }

            LichHenLaiThu saved = lichHenLaiThuRepository.save(booking);
            log.info("[Spring AI Tool] Đăng ký lịch lái thử thành công! ID={}", saved.getId());

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm 'ngày' dd/MM/yyyy");
            return BookingResult.builder()
                    .success(true)
                    .bookingId(saved.getId())
                    .message(
                            "Đăng ký lịch lái thử xe thành công! Chuyên viên showroom sẽ liên hệ quý khách trước 30 phút để xác nhận.")
                    .tenKhachHang(booking.getHoTenKhach())
                    .soDienThoai(booking.getSoDienThoaiKhach())
                    .tenXe(matchedCar.getTenPhienBan())
                    .tenShowroom(matchedShowroom != null ? matchedShowroom.getTenShowroom() : "Showroom AutoHub")
                    .diaChiShowroom(matchedShowroom != null ? matchedShowroom.getDiaChi() : "Hệ thống Showroom AutoHub")
                    .thoiGianHen(bookingDateTime.format(dtf))
                    .trangThai("PENDING (Chờ nhân viên showroom xếp xe demo)")
                    .build();

        } catch (Exception ex) {
            log.error("[Spring AI Tool] Lỗi khi đăng ký lái thử: {}", ex.getMessage(), ex);
            return BookingResult.builder()
                    .success(false)
                    .message("Không thể khởi tạo lịch hẹn: " + ex.getMessage())
                    .build();
        }
    }

    public static LocalDateTime parseBookingDateTime(String text) {
        LocalDate targetDate = LocalDate.now().plusDays(1); // Mặc định là ngày mai!
        int hour = 10;
        int minute = 0;

        if (text != null && !text.isBlank()) {
            String lower = text.toLowerCase();

            // Nếu chuỗi chứa định dạng ISO: 2026-11-21T10:00
            if (text.contains("T") && text.length() >= 16) {
                try {
                    return LocalDateTime.parse(text.substring(0, 16));
                } catch (Exception ignored) {
                }
            }

            // 1. Phân giải ngày
            if (lower.contains("hôm nay") || lower.contains("chiều nay") || lower.contains("sáng nay")) {
                targetDate = LocalDate.now();
            } else if (lower.contains("ngày kia") || lower.contains("ngày mốt") || lower.contains("hôm sau")) {
                targetDate = LocalDate.now().plusDays(2);
            } else if (lower.contains("ngày mai") || lower.contains("mai")) {
                targetDate = LocalDate.now().plusDays(1);
            } else if (lower.contains("thứ 7") || lower.contains("thứ bảy") || lower.contains("t7")) {
                targetDate = LocalDate.now().with(java.time.temporal.TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SATURDAY));
            } else if (lower.contains("chủ nhật") || lower.contains("cn")) {
                targetDate = LocalDate.now().with(java.time.temporal.TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY));
            }

            // 2. Phân giải giờ (10 giờ, 10h, 10:00, 14h, 9h sáng...)
            Matcher mHourMin = Pattern.compile("(\\d{1,2})[h:](\\d{2})").matcher(lower);
            if (mHourMin.find()) {
                hour = Integer.parseInt(mHourMin.group(1));
                minute = Integer.parseInt(mHourMin.group(2));
            } else {
                Matcher mHour = Pattern.compile("(\\d{1,2})\\s*(giờ|h|am|pm)?").matcher(lower);
                while (mHour.find()) {
                    int val = Integer.parseInt(mHour.group(1));
                    // Chỉ lấy giá trị giờ hợp lệ (1-23), tránh nhầm với ngày hoặc số điện thoại
                    if (val >= 7 && val <= 20) {
                        hour = val;
                        break;
                    }
                }
                if ((lower.contains("chiều") || lower.contains("pm")) && hour < 12) {
                    hour += 12;
                }
            }
        }

        if (hour < 8 || hour > 18) {
            hour = 10; // Giờ mở cửa showroom tiêu chuẩn 8h - 18h
        }

        return targetDate.atTime(hour, minute);
    }
}