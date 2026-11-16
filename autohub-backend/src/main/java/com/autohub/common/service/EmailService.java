package com.autohub.common.service;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Slf4j
@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

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
                + "<p style=\"color: #64748B; font-size: 12px; margin-bottom: 0;\">⚠️ Tuyệt đối không chia sẻ mã này với bất kỳ ai (kể cả nhân viên hỗ trợ AutoHub) để đảm bảo an toàn tài khoản.</p>"
                + "</div>"
                + "<div style=\"margin-top: 24px; text-align: center; color: #94A3B8; font-size: 11px;\">"
                + "<p style=\"margin: 0;\">Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email hoặc liên hệ hotline 1900 8888.</p>"
                + "<p style=\"margin: 4px 0 0 0;\">&copy; 2026 AutoHub. All rights reserved.</p>"
                + "</div>"
                + "</div>";

        if (mailSender != null && senderEmail != null && !senderEmail.isBlank()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

                helper.setFrom(senderEmail, "AutoHub Security Team");
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("[EmailService] Đã gửi thành công email OTP tới: {}", toEmail);
                return;
            } catch (Exception e) {
                log.warn("[EmailService] Không thể gửi email qua SMTP: {}. Sẽ ghi log OTP để kiểm thử cục bộ.", e.getMessage());
            }
        }

        // Fallback for development without configured SMTP credentials
        log.info("=================================================================");
        log.info("[DEV EMAIL OTP] Gửi OTP cho [{}]: Mã OTP = {}", toEmail, otpCode);
        log.info("=================================================================");
    }
}
