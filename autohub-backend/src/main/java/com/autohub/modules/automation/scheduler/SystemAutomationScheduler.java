package com.autohub.modules.automation.scheduler;

import com.autohub.common.service.EmailService;
import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.deposit.scheduler.DepositExpirationScheduler;
import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.enums.*;
import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.showroom.repository.XeDemoRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SystemAutomationScheduler {

    private final DepositExpirationScheduler depositExpirationScheduler;
    private final DonHangPhuKienRepository donHangPhuKienRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final PhuKienRepository phuKienRepository;
    private final LichHenLaiThuRepository lichHenLaiThuRepository;
    private final XeDemoRepository xeDemoRepository;
    private final EmailService emailService;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AutomationSweepResult {
        private int expiredDeposits15m;
        private int expiredDeposits72h;
        private int cancelledAccessoryOrders;
    }

    /**
     * UC34: Tự động thu hồi suất cọc quá hạn thanh toán 15 phút, suất cọc quá 72h
     * và đơn hàng phụ kiện quá 15 phút chưa thanh toán.
     * Chạy định kỳ mỗi 2 phút.
     */
    @Scheduled(cron = "${autohub.scheduler.cron.order-deposit:0 */2 * * * *}")
    @Transactional
    public AutomationSweepResult scanAndCancelExpiredOrdersAndDeposits() {
        LocalDateTime now = LocalDateTime.now();
        int orders15m = 0;

        // 1. Quét và giải phóng các phiếu đặt cọc quá hạn 15m và 72h (DepositExpirationScheduler)
        int expiredDeposits = depositExpirationScheduler.scanAndExpireOverdueDeposits();

        // 2. Quét đơn hàng phụ kiện PENDING_PAYMENT quá hạn thanh toán 15 phút
        List<DonHangPhuKien> pendingPaymentOrders = donHangPhuKienRepository
                .findByTrangThaiAndHanThanhToanBefore(TrangThaiDonHang.PENDING_PAYMENT, now);
        for (DonHangPhuKien order : pendingPaymentOrders) {
            order.setTrangThai(TrangThaiDonHang.CANCELLED);
            String autoNote = "[Hệ thống tự động hủy: Quá hạn thanh toán 15 phút]";
            order.setGhiChuKhachHang(order.getGhiChuKhachHang() != null
                    ? autoNote + " " + order.getGhiChuKhachHang()
                    : autoNote);
            donHangPhuKienRepository.save(order);

            // Hoàn trả số lượng tồn kho phụ kiện đã tạm trừ
            List<ChiTietDonHang> items = chiTietDonHangRepository.findByDonHangId(order.getId());
            for (ChiTietDonHang item : items) {
                if (item.getPhuKien() != null && item.getSoLuong() != null) {
                    PhuKien pk = item.getPhuKien();
                    int currentStock = pk.getSoLuongTon() != null ? pk.getSoLuongTon() : 0;
                    pk.setSoLuongTon(currentStock + item.getSoLuong());
                    phuKienRepository.save(pk);
                }
            }
            orders15m++;
            log.info("[UC34] Tự động hủy đơn hàng phụ kiện quá hạn thanh toán 15 phút: #{}", order.getMaDonHang());
        }

        return AutomationSweepResult.builder()
                .expiredDeposits15m(expiredDeposits)
                .expiredDeposits72h(expiredDeposits)
                .cancelledAccessoryOrders(orders15m)
                .build();
    }

    /**
     * UC35: Tự động hủy lịch lái thử chưa xác nhận trước 12 giờ
     * Quét các lịch hẹn PENDING có thoiGianHen <= now + 12h
     * Chạy định kỳ mỗi 5 phút.
     */
    @Scheduled(cron = "${autohub.scheduler.cron.test-drive-expire:0 */5 * * * *}")
    @Transactional
    public int scanAndCancelUnconfirmedTestDrives() {
        LocalDateTime threshold = LocalDateTime.now().plusHours(12);
        List<LichHenLaiThu> pendingList = lichHenLaiThuRepository
                .findByTrangThaiAndThoiGianHenLessThanEqual(TrangThaiLichHen.PENDING, threshold);

        int cancelledCount = 0;
        for (LichHenLaiThu testDrive : pendingList) {
            testDrive.setTrangThai(TrangThaiLichHen.EXPIRED);
            String note = "[Hệ thống tự động hủy]: Lịch hẹn chưa được nhân viên Showroom phê duyệt xác nhận trước 12 giờ.";
            testDrive.setGhiChu(testDrive.getGhiChu() != null ? note + " " + testDrive.getGhiChu() : note);

            // Nếu ca lái thử đã tạm gán xe demo, hoàn trả xe demo về SẴN SÀNG
            if (testDrive.getXeDemo() != null) {
                XeDemo demo = testDrive.getXeDemo();
                demo.setTrangThai(TrangThaiXeDemo.SAN_SANG);
                xeDemoRepository.save(demo);
            }

            // Gửi email xin lỗi khách hàng và hướng dẫn đặt lại lịch hẹn khác (UC35)
            try {
                String toEmail = (testDrive.getNguoiDung() != null) ? testDrive.getNguoiDung().getEmail() : null;
                if (toEmail != null && !toEmail.isBlank()) {
                    String customerName = testDrive.getHoTenKhach() != null ? testDrive.getHoTenKhach() : "Quý khách";
                    String carModel = (testDrive.getPhienBanXe() != null) ? testDrive.getPhienBanXe().getTenPhienBan() : "Ô tô điện AutoHub";
                    String showroomName = (testDrive.getShowroom() != null) ? testDrive.getShowroom().getTenShowroom() : "Showroom AutoHub";
                    emailService.sendTestDriveApologyCancellationEmail(toEmail, customerName, carModel, showroomName, testDrive.getThoiGianHen());
                }
            } catch (Exception ex) {
                log.warn("[UC35] Lỗi gửi email xin lỗi hủy lịch hẹn #{}: {}", testDrive.getId(), ex.getMessage());
            }

            lichHenLaiThuRepository.save(testDrive);
            cancelledCount++;
            log.info("[UC35] Tự động hủy lịch lái thử #{} của khách {} do chưa duyệt trước 12h",
                    testDrive.getId(), testDrive.getHoTenKhach());
        }

        return cancelledCount;
    }

    /**
     * UC36: Tự động gửi email nhắc lịch lái thử trước 24 giờ
     * Quét các lịch CONFIRMED có daGuiNhacLich = false và thoiGianHen nằm trong 24h tới
     * Chạy định kỳ mỗi 10 phút.
     */
    @Scheduled(cron = "${autohub.scheduler.cron.test-drive-reminder:0 */10 * * * *}")
    @Transactional
    public int scanAndSendTestDriveReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime in24Hours = now.plusHours(24);

        List<LichHenLaiThu> upcomingAppointments = lichHenLaiThuRepository
                .findByTrangThaiAndDaGuiNhacLichFalseAndThoiGianHenBetween(
                        TrangThaiLichHen.CONFIRMED, now, in24Hours);

        int sentCount = 0;
        for (LichHenLaiThu appointment : upcomingAppointments) {
            String recipientEmail = (appointment.getNguoiDung() != null) ? appointment.getNguoiDung().getEmail() : null;

            if (recipientEmail != null && !recipientEmail.isBlank()) {
                String customerName = appointment.getHoTenKhach() != null ? appointment.getHoTenKhach() :
                        (appointment.getNguoiDung() != null ? appointment.getNguoiDung().getHoTen() : "Quý khách");

                String carModel = (appointment.getPhienBanXe() != null)
                        ? appointment.getPhienBanXe().getTenPhienBan()
                        : "Ô tô điện AutoHub";

                String showroomName = (appointment.getShowroom() != null)
                        ? appointment.getShowroom().getTenShowroom()
                        : "Showroom AutoHub";

                String showroomAddress = (appointment.getShowroom() != null)
                        ? appointment.getShowroom().getDiaChi()
                        : "";

                boolean success = emailService.sendTestDriveReminderEmail(
                        recipientEmail,
                        customerName,
                        carModel,
                        showroomName,
                        showroomAddress,
                        appointment.getThoiGianHen()
                );

                if (success) {
                    appointment.setDaGuiNhacLich(true);
                    appointment.setThoiGianGuiNhac(LocalDateTime.now());
                    lichHenLaiThuRepository.save(appointment);
                    sentCount++;
                    log.info("[UC36] Đã gửi email nhắc lịch lái thử tới {} cho ca hẹn #{}", recipientEmail, appointment.getId());
                }
            }
        }

        return sentCount;
    }
}
