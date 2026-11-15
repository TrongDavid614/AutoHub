package com.autohub.common.service;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy");

    /**
     * Gửi email OTP khôi phục mật khẩu (UC05)
     */
    public void sendOtpEmail(String toEmail, String otpCode, String recipientName) {
        String safeName = (recipientName != null && !recipientName.isBlank()) ? recipientName : "Quý khách";

        String subject = "[AutoHub] Mã OTP Khôi Phục Mật Khẩu: " + otpCode;
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;\">"
                + "<div style=\"text-align: center; margin-bottom: 24px;\">"
                + "<h2 style=\"color: #1E293B; margin: 0;\">🚗 AutoHub Platform</h2>"
                + "<p style=\"color: #64748B; font-size: 13px; margin: 4px 0 0 0;\">Nền tảng thương mại điện tử ô tô & phụ kiện trực tuyến</p>"
                + "</div>"
                + "<div style=\"padding: 20px; background-color: #F8FAFC; border-radius: 8px; border: 1px solid #EDF2F7;\">"
                + "<p style=\"color: #334155; font-size: 14px; margin-top: 0;\">Xin chào <strong>" + safeName + "</strong>,</p>"
                + "<p style=\"color: #475569; font-size: 14px; line-height: 1.6;\">Chúng tôi nhận được yêu cầu cấp lại mật khẩu cho tài khoản <strong>" + toEmail + "</strong> của bạn trên hệ thống AutoHub.</p>"
                + "<p style=\"color: #475569; font-size: 14px;\">Mã xác thực OTP gồm 6 chữ số của bạn là:</p>"
                + "<div style=\"text-align: center; margin: 24px 0;\">"
                + "<span style=\"display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2563EB; background-color: #EFF6FF; padding: 12px 28px; border-radius: 8px; border: 1px dashed #3B82F6;\">"
                + otpCode
                + "</span>"
                + "</div>"
                + "<p style=\"color: #E11D48; font-size: 13px; font-weight: 600; text-align: center;\">Mã OTP này có hiệu lực trong vòng 05 phút.</p>"
                + "<p style=\"color: #64748B; font-size: 12px; margin-bottom: 0;\">⚠️ Tuyệt đối không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn tài khoản.</p>"
                + "</div>"
                + "<div style=\"margin-top: 24px; text-align: center; color: #94A3B8; font-size: 11px;\">"
                + "<p style=\"margin: 0;\">Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email hoặc liên hệ hotline 1900 8888.</p>"
                + "<p style=\"margin: 4px 0 0 0;\">&copy; 2026 AutoHub. All rights reserved.</p>"
                + "</div>"
                + "</div>";

        sendHtmlEmail(toEmail, subject, htmlContent, "[DEV EMAIL OTP] Gửi OTP cho [" + toEmail + "]: Mã OTP = " + otpCode);
    }

    /**
     * Tự động gửi email nhắc lịch lái thử trước 24 giờ (UC36)
     */
    public boolean sendTestDriveReminderEmail(String toEmail, String recipientName, String carModel,
                                            String showroomName, String showroomAddress, LocalDateTime appointmentTime) {
        String safeName = (recipientName != null && !recipientName.isBlank()) ? recipientName : "Quý khách";
        String timeStr = appointmentTime != null ? appointmentTime.format(DATE_TIME_FORMATTER) : "Sắp tới";
        String safeCar = (carModel != null && !carModel.isBlank()) ? carModel : "Ô tô điện AutoHub";
        String safeShowroom = (showroomName != null && !showroomName.isBlank()) ? showroomName : "AutoHub Flagship Showroom";
        String safeAddress = (showroomAddress != null && !showroomAddress.isBlank()) ? showroomAddress : "Hệ thống Showroom AutoHub toàn quốc";

        String subject = "[AutoHub] Nhắc Lịch Lái Thử Trải Nghiệm Xe: " + safeCar + " Lúc " + timeStr;
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;\">"
                + "<div style=\"text-align: center; margin-bottom: 24px; border-bottom: 2px solid #3B82F6; padding-bottom: 16px;\">"
                + "<h2 style=\"color: #0F172A; margin: 0;\">🚗 AutoHub Vietnam</h2>"
                + "<p style=\"color: #3B82F6; font-size: 14px; font-weight: 600; margin: 4px 0 0 0;\">THƯ NHẮC HẸN TRẢI NGHIỆM LÁI THỬ XE</p>"
                + "</div>"
                + "<div style=\"padding: 20px; background-color: #F8FAFC; border-radius: 8px; border: 1px solid #EDF2F7;\">"
                + "<p style=\"color: #334155; font-size: 15px; margin-top: 0;\">Kính gửi <strong>" + safeName + "</strong>,</p>"
                + "<p style=\"color: #475569; font-size: 14px; line-height: 1.6;\">Hệ thống AutoHub xin trân trọng nhắc bạn về lịch hẹn trải nghiệm lái thử xe sắp diễn ra trong vòng <strong>24 giờ tới</strong>.</p>"
                + "<div style=\"background-color: #ffffff; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981; margin: 16px 0;\">"
                + "<p style=\"margin: 4px 0; color: #1E293B;\">🚘 <strong>Phiên bản trải nghiệm:</strong> " + safeCar + "</p>"
                + "<p style=\"margin: 4px 0; color: #1E293B;\">⏰ <strong>Thời gian hẹn:</strong> <span style=\"color: #2563EB; font-weight: 700;\">" + timeStr + "</span></p>"
                + "<p style=\"margin: 4px 0; color: #1E293B;\">📍 <strong>Địa điểm nhận xe:</strong> " + safeShowroom + "</p>"
                + "<p style=\"margin: 4px 0; color: #64748B; font-size: 13px;\">" + safeAddress + "</p>"
                + "</div>"
                + "<div style=\"background-color: #FEF3C7; padding: 12px 16px; border-radius: 6px; border: 1px solid #FCD34D;\">"
                + "<p style=\"color: #92400E; font-size: 13px; margin: 0; font-weight: 600;\">📌 Lưu ý quan trọng khi tham gia:</p>"
                + "<ul style=\"color: #78350F; font-size: 12px; margin: 6px 0 0 0; padding-left: 20px;\">"
                + "<li>Vui lòng mang theo <strong>Bằng lái xe (GPLX) hợp lệ</strong> còn hạn sử dụng.</li>"
                + "<li>Có mặt trước giờ hẹn 10 phút để hoàn tất thủ tục bàn giao chìa khóa và kiểm tra xe.</li>"
                + "<li>Nếu có thay đổi lịch trình, quý khách vui lòng liên hệ hotline để được đổi giờ thuận tiện nhất.</li>"
                + "</ul>"
                + "</div>"
                + "</div>"
                + "<div style=\"margin-top: 24px; text-align: center; color: #94A3B8; font-size: 11px;\">"
                + "<p style=\"margin: 0;\">Hotline hỗ trợ khách hàng: <strong>1900 8888</strong> | Email: crm@autohub.vn</p>"
                + "<p style=\"margin: 4px 0 0 0;\">&copy; 2026 AutoHub Vietnam. Kính chúc quý khách có một chuyến trải nghiệm tuyệt vời!</p>"
                + "</div>"
                + "</div>";

        String devLog = "[DEV TEST-DRIVE REMINDER] Gửi email nhắc hẹn cho [" + toEmail + "] - Khách: " + safeName
                + " - Xe: " + safeCar + " - Showroom: " + safeShowroom + " - Giờ hẹn: " + timeStr;

        return sendHtmlEmail(toEmail, subject, htmlContent, devLog);
    }

    private boolean sendHtmlEmail(String toEmail, String subject, String htmlContent, String devFallbackLog) {
        if (mailSender != null && senderEmail != null && !senderEmail.isBlank()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

                helper.setFrom(senderEmail, "AutoHub Vietnam");
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("[EmailService] Đã gửi thành công email '{}' tới: {}", subject, toEmail);
                return true;
            } catch (Exception e) {
                log.warn("[EmailService] Gửi email qua SMTP thất bại: {}. Sẽ ghi log phát triển.", e.getMessage());
            }
        }

        // Fallback for development without configured SMTP credentials
        log.info("=================================================================");
        log.info("{}", devFallbackLog);
        log.info("=================================================================");
        return true;
    }
}
