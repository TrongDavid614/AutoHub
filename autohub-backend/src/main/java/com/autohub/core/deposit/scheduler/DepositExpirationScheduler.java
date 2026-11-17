package com.autohub.core.deposit.scheduler;

import com.autohub.common.service.EmailService;
import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.car.repository.XeDinhDanhRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.enums.TrangThaiXeVIN;
import com.autohub.core.showroom.entity.TonKhoXe;
import com.autohub.core.showroom.repository.TonKhoXeRepository;
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
public class DepositExpirationScheduler {

    private final PhieuDatCocRepository depositRepository;
    private final XeDinhDanhRepository xeDinhDanhRepository;
    private final TonKhoXeRepository tonKhoXeRepository;
    private final EmailService emailService;

    /**
     * Tự động quét và giải phóng các phiếu đặt cọc giữ xe đã hết hạn 72 giờ (BR01 / UC22).
     * Mặc định quét định kỳ mỗi 15 phút.
     */
    @Scheduled(cron = "${autohub.scheduler.deposit-expiration.cron:0 */15 * * * *}")
    @Transactional
    public int scanAndExpireOverdueDeposits() {
        LocalDateTime now = LocalDateTime.now();
        log.info("[DepositExpirationScheduler] Bắt đầu quét kiểm tra các phiếu đặt cọc quá hạn...");

        // 1. Quét các phiếu cọc ĐÃ THANH TOÁN (PAID) nhưng đã quá hạn giữ xe 72 giờ mà chưa ký hợp đồng mua bán
        List<PhieuDatCoc> paidList = depositRepository.findByTrangThai(TrangThaiPhieuCoc.PAID);
        List<PhieuDatCoc> overduePaid = paidList.stream()
                .filter(d -> d.getHanGiuXe() != null && now.isAfter(d.getHanGiuXe()))
                .toList();

        // 2. Quét các phiếu cọc CHỜ THANH TOÁN (PENDING_PAYMENT) nhưng đã quá hạn 15 phút chuyển khoản
        List<PhieuDatCoc> pendingList = depositRepository.findByTrangThai(TrangThaiPhieuCoc.PENDING_PAYMENT);
        List<PhieuDatCoc> overduePending = pendingList.stream()
                .filter(d -> d.getHanThanhToan() != null && now.isAfter(d.getHanThanhToan()))
                .toList();

        int expiredCount = 0;

        for (PhieuDatCoc dep : overduePaid) {
            dep.setTrangThai(TrangThaiPhieuCoc.EXPIRED);

            // 1. Thu hồi số khung VIN về trạng thái SẴN SÀNG (CO_SAN)
            if (dep.getXeDinhDanh() != null) {
                XeDinhDanh vin = dep.getXeDinhDanh();
                vin.setTrangThai(TrangThaiXeVIN.CO_SAN);
                xeDinhDanhRepository.save(vin);
                log.info("[DepositExpirationScheduler] Đã thu hồi số VIN {} về CO_SAN do phiếu cọc #{} quá hạn 72h",
                        vin.getSoKhungVIN(), dep.getMaPhieuCoc());
            }

            // 2. Hoàn lại số lượng tồn kho khả dụng cho Showroom
            if (dep.getTonKhoXe() != null) {
                TonKhoXe tk = dep.getTonKhoXe();
                int currentAvail = tk.getSoLuongKhaDung() != null ? tk.getSoLuongKhaDung() : 0;
                int currentHolding = tk.getSoLuongDangGiuCho() != null ? tk.getSoLuongDangGiuCho() : 0;

                tk.setSoLuongKhaDung(currentAvail + 1);
                if (currentHolding > 0) {
                    tk.setSoLuongDangGiuCho(currentHolding - 1);
                }
                tonKhoXeRepository.save(tk);
                log.info("[DepositExpirationScheduler] Đã hoàn lại tồn kho Showroom ID {}: Khả dụng +1, Giữ chỗ -1", tk.getId());
            }

            // 3. Gửi email thông báo hết hạn giữ suất cọc 72h cho khách hàng (UC34 step 8)
            try {
                String toEmail = (dep.getNguoiDung() != null) ? dep.getNguoiDung().getEmail() : null;
                if (toEmail != null && !toEmail.isBlank()) {
                    String customerName = (dep.getNguoiDung() != null && dep.getNguoiDung().getHoTen() != null)
                            ? dep.getNguoiDung().getHoTen() : "Quý khách";
                    String carModel = (dep.getTonKhoXe() != null && dep.getTonKhoXe().getPhienBanXe() != null)
                            ? dep.getTonKhoXe().getPhienBanXe().getTenPhienBan() : "Ô tô điện AutoHub";
                    emailService.sendDepositExpirationEmail(toEmail, customerName, dep.getMaPhieuCoc(), carModel, dep.getHanGiuXe());
                }
            } catch (Exception ex) {
                log.warn("[DepositExpirationScheduler] Không thể gửi email thông báo hết hạn cọc #{}: {}", dep.getMaPhieuCoc(), ex.getMessage());
            }

            depositRepository.save(dep);
            expiredCount++;
        }

        for (PhieuDatCoc dep : overduePending) {
            dep.setTrangThai(TrangThaiPhieuCoc.EXPIRED);

            if (dep.getXeDinhDanh() != null) {
                XeDinhDanh vin = dep.getXeDinhDanh();
                vin.setTrangThai(TrangThaiXeVIN.CO_SAN);
                xeDinhDanhRepository.save(vin);
            }

            if (dep.getTonKhoXe() != null) {
                TonKhoXe tk = dep.getTonKhoXe();
                int currentAvail = tk.getSoLuongKhaDung() != null ? tk.getSoLuongKhaDung() : 0;
                int currentHolding = tk.getSoLuongDangGiuCho() != null ? tk.getSoLuongDangGiuCho() : 0;
                tk.setSoLuongKhaDung(currentAvail + 1);
                if (currentHolding > 0) {
                    tk.setSoLuongDangGiuCho(currentHolding - 1);
                }
                tonKhoXeRepository.save(tk);
            }

            depositRepository.save(dep);
            expiredCount++;
            log.info("[DepositExpirationScheduler] Phiếu cọc chờ thanh toán #{} đã hết hạn 15 phút.", dep.getMaPhieuCoc());
        }

        log.info("[DepositExpirationScheduler] Quét hoàn tất. Đã xử lý hết hạn {} phiếu cọc quá hạn.", expiredCount);
        return expiredCount;
    }
}
