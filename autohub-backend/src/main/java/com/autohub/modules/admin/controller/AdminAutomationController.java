package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.modules.automation.scheduler.SystemAutomationScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin/automation")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAutomationController {

    private final SystemAutomationScheduler automationScheduler;
    private final PhieuDatCocRepository phieuDatCocRepository;
    private final DonHangPhuKienRepository donHangPhuKienRepository;
    private final LichHenLaiThuRepository lichHenLaiThuRepository;

    /**
     * Kích hoạt quét và thu hồi suất cọc quá hạn & đơn phụ kiện quá 15 phút (UC34)
     */
    @PostMapping("/sweep-expired")
    public ResponseEntity<ApiResponse<SystemAutomationScheduler.AutomationSweepResult>> sweepExpired() {
        SystemAutomationScheduler.AutomationSweepResult result = automationScheduler.scanAndCancelExpiredOrdersAndDeposits();
        String message = String.format("Quét hoàn tất: Hủy %d phiếu cọc 15p, %d phiếu cọc 72h, %d đơn phụ kiện quá hạn.",
                result.getExpiredDeposits15m(), result.getExpiredDeposits72h(), result.getCancelledAccessoryOrders());
        return ResponseEntity.ok(ApiResponse.ok(result, message));
    }

    /**
     * Kích hoạt quét và hủy lịch lái thử chưa xác nhận trước 12 giờ (UC35)
     */
    @PostMapping("/sweep-test-drives")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sweepUnconfirmedTestDrives() {
        int count = automationScheduler.scanAndCancelUnconfirmedTestDrives();
        Map<String, Object> data = new HashMap<>();
        data.put("cancelledTestDrives", count);
        return ResponseEntity.ok(ApiResponse.ok(data, "Đã quét và hủy " + count + " lịch lái thử chưa xác nhận trước 12h"));
    }

    /**
     * Kích hoạt gửi email nhắc lịch lái thử trước 24 giờ (UC36)
     */
    @PostMapping("/send-reminders")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendTestDriveReminders() {
        int count = automationScheduler.scanAndSendTestDriveReminders();
        Map<String, Object> data = new HashMap<>();
        data.put("remindersSent", count);
        return ResponseEntity.ok(ApiResponse.ok(data, "Đã gửi email nhắc lịch lái thử tới " + count + " khách hàng"));
    }

    /**
     * Báo cáo trạng thái các tiến trình tự động hóa và hàng đợi hiện tại
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAutomationStatus() {
        LocalDateTime now = LocalDateTime.now();
        Map<String, Object> status = new HashMap<>();

        status.put("currentTime", now);
        status.put("pendingPaymentDeposits", phieuDatCocRepository.countByTrangThai(TrangThaiPhieuCoc.PENDING_PAYMENT));
        status.put("paidHoldingDeposits", phieuDatCocRepository.countByTrangThai(TrangThaiPhieuCoc.PAID));
        status.put("expiredDeposits", phieuDatCocRepository.countByTrangThai(TrangThaiPhieuCoc.EXPIRED));

        status.put("pendingPaymentOrders", donHangPhuKienRepository.countByTrangThai(TrangThaiDonHang.PENDING_PAYMENT));
        status.put("cancelledOrders", donHangPhuKienRepository.countByTrangThai(TrangThaiDonHang.CANCELLED));

        status.put("pendingTestDrives", lichHenLaiThuRepository.countByTrangThai(TrangThaiLichHen.PENDING));
        status.put("confirmedTestDrives", lichHenLaiThuRepository.countByTrangThai(TrangThaiLichHen.CONFIRMED));
        status.put("expiredTestDrives", lichHenLaiThuRepository.countByTrangThai(TrangThaiLichHen.EXPIRED));

        return ResponseEntity.ok(ApiResponse.ok(status, "Lấy thông tin tiến trình tự động hóa thành công"));
    }
}
