package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.entity.YeuCauHoanCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.deposit.repository.YeuCauHoanCocRepository;
import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.core.enums.TrangThaiHoanCoc;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import com.autohub.modules.staff.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/staff/workspace")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffWorkspaceController {

    private final YeuCauTuVanRepository consultationRepository;
    private final LichHenLaiThuRepository testDriveRepository;
    private final PhieuDatCocRepository depositRepository;
    private final DonHangPhuKienRepository orderRepository;
    private final YeuCauHoanCocRepository refundRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<StaffWorkspaceDto>> getWorkspaceMetrics() {
        List<YeuCauTuVan> allLeads = consultationRepository.findAll();
        List<LichHenLaiThu> allTestDrives = testDriveRepository.findAll();
        List<PhieuDatCoc> allDeposits = depositRepository.findAll();
        List<DonHangPhuKien> allOrders = orderRepository.findAll();
        List<YeuCauHoanCoc> allRefunds = refundRepository.findAll();

        // 1. Thống kê KPI thật từ Database
        long pendingLeads = allLeads.stream().filter(l -> l.getTrangThai() == TrangThaiYeuCauTuVan.PENDING).count();
        long pendingTestDrives = allTestDrives.stream().filter(t -> t.getTrangThai() == TrangThaiLichHen.PENDING).count();
        long activeDeposits = allDeposits.stream().filter(d -> d.getTrangThai() == TrangThaiPhieuCoc.PAID || d.getTrangThai() == TrangThaiPhieuCoc.PENDING_PAYMENT).count();
        long needsVinCount = allDeposits.stream().filter(d -> d.getXeDinhDanh() == null && d.getTrangThai() == TrangThaiPhieuCoc.PAID).count();
        long pendingOrders = allOrders.stream().filter(o -> o.getTrangThai() == TrangThaiDonHang.PENDING || o.getTrangThai() == TrangThaiDonHang.PROCESSING).count();
        long pendingRefunds = allRefunds.stream().filter(r -> r.getTrangThai() == TrangThaiHoanCoc.PENDING).count();

        List<StaffKpiStatDto> kpis = List.of(
                StaffKpiStatDto.builder()
                        .id("kpi-leads")
                        .title("Yêu Cầu Tư Vấn (CRM)")
                        .value(String.valueOf(allLeads.size()))
                        .subtitle("Tổng Lead từ hệ thống")
                        .badgeText(pendingLeads + " Chờ Gọi")
                        .badgeType(pendingLeads > 0 ? "warning" : "success")
                        .build(),
                StaffKpiStatDto.builder()
                        .id("kpi-testdrive")
                        .title("Lịch Hẹn Lái Thử")
                        .value(String.valueOf(allTestDrives.size()))
                        .subtitle("Lịch đăng ký từ khách hàng")
                        .badgeText(pendingTestDrives + " Chờ Xếp Xe")
                        .badgeType(pendingTestDrives > 0 ? "info" : "success")
                        .build(),
                StaffKpiStatDto.builder()
                        .id("kpi-deposits")
                        .title("Phiếu Cọc Giữ Chỗ 72h")
                        .value(String.valueOf(allDeposits.size()))
                        .subtitle("Tổng hồ sơ cọc trong DB")
                        .badgeText(needsVinCount + " Chờ Gán VIN")
                        .badgeType(needsVinCount > 0 ? "danger" : "success")
                        .build(),
                StaffKpiStatDto.builder()
                        .id("kpi-orders")
                        .title("Đơn Phụ Kiện Cần Gói")
                        .value(String.valueOf(allOrders.size()))
                        .subtitle("Đơn hàng phụ kiện kho")
                        .badgeText(pendingOrders + " Chờ Xử Lý")
                        .badgeType(pendingOrders > 0 ? "warning" : "success")
                        .build()
        );

        // 2. Mật độ lịch lái thử theo khung giờ từ DB thật
        String[] slots = {"08-10h", "10-12h", "13-14h", "14-16h", "16-17h", "17-18h"};
        int[] slotCounts = new int[slots.length];
        for (LichHenLaiThu td : allTestDrives) {
            if (td.getThoiGianHen() != null) {
                int hour = td.getThoiGianHen().getHour();
                if (hour < 10) slotCounts[0]++;
                else if (hour < 13) slotCounts[1]++;
                else if (hour < 14) slotCounts[2]++;
                else if (hour < 16) slotCounts[3]++;
                else if (hour < 17) slotCounts[4]++;
                else slotCounts[5]++;
            }
        }
        int maxCount = Math.max(1, Arrays.stream(slotCounts).max().orElse(1));
        List<HourlyTestDriveSlotDto> hourlyTestDrives = new ArrayList<>();
        for (int i = 0; i < slots.length; i++) {
            HourlyTestDriveSlotDto slotItem = HourlyTestDriveSlotDto.builder()
                    .slot(slots[i])
                    .count(slotCounts[i])
                    .max(maxCount)
                    .label(slotCounts[i] == 0 ? "Trống" : slotCounts[i] + " lượt")
                    .highlight(slotCounts[i] > 0 && slotCounts[i] == maxCount)
                    .build();
            hourlyTestDrives.add(slotItem);
        }

        // 3. Phân bổ trạng thái phiếu cọc 72h thật từ DB
        int totalDep = Math.max(1, allDeposits.size());
        long completedOrVinCount = allDeposits.stream().filter(d -> d.getTrangThai() == TrangThaiPhieuCoc.COMPLETED || d.getXeDinhDanh() != null).count();
        long holdingCount = allDeposits.stream().filter(d -> d.getXeDinhDanh() == null && (d.getTrangThai() == TrangThaiPhieuCoc.PAID || d.getTrangThai() == TrangThaiPhieuCoc.PENDING_PAYMENT)).count();
        long otherCount = Math.max(0, allDeposits.size() - completedOrVinCount - holdingCount);

        List<DepositStatusSegmentDto> depositBreakdown = List.of(
                DepositStatusSegmentDto.builder()
                        .label("Đã khóa VIN / Hoàn tất")
                        .count(completedOrVinCount)
                        .percent(Math.round((completedOrVinCount * 100.0) / totalDep))
                        .color("bg-emerald-500")
                        .text("text-emerald-400")
                        .build(),
                DepositStatusSegmentDto.builder()
                        .label("Đang giữ chỗ 72h")
                        .count(holdingCount)
                        .percent(Math.round((holdingCount * 100.0) / totalDep))
                        .color("bg-blue-500")
                        .text("text-[#89CEFF]")
                        .build(),
                DepositStatusSegmentDto.builder()
                        .label("Hoàn cọc / Khác")
                        .count(otherCount)
                        .percent(Math.round((otherCount * 100.0) / totalDep))
                        .color("bg-amber-500")
                        .text("text-amber-400")
                        .build()
        );

        // 4. Tiến trình lái thử thật từ DB
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM HH:mm");
        List<TodayTimelineSlotDto> todayTimeline = new ArrayList<>();
        for (LichHenLaiThu b : allTestDrives) {
            String timeStr = b.getThoiGianHen() != null ? b.getThoiGianHen().format(fmt) : "Hôm nay";
            String custName = b.getHoTenKhach() != null ? b.getHoTenKhach()
                    : (b.getNguoiDung() != null ? b.getNguoiDung().getHoTen() : "Khách hàng");
            String custPhone = b.getSoDienThoaiKhach() != null ? b.getSoDienThoaiKhach()
                    : (b.getNguoiDung() != null ? b.getNguoiDung().getSoDienThoai() : "");

            TodayTimelineSlotDto item = TodayTimelineSlotDto.builder()
                    .id(String.valueOf(b.getId()))
                    .timeSlot(timeStr)
                    .carModel(b.getPhienBanXe() != null ? b.getPhienBanXe().getTenPhienBan() : "AutoHub EV")
                    .customerName(custName)
                    .customerPhone(custPhone)
                    .licensePlate(b.getXeDemo() != null ? b.getXeDemo().getBienSo() : "Chưa gán xe")
                    .staffName(b.getShowroom() != null ? b.getShowroom().getTenShowroom() : "Showroom AutoHub")
                    .status(b.getTrangThai() != null ? b.getTrangThai().name() : "PENDING")
                    .build();
            todayTimeline.add(item);
        }

        // 5. Danh sách phiếu cọc thật từ DB kèm đếm ngược han_giu_xe chính xác
        LocalDateTime now = LocalDateTime.now();
        List<WorkspaceUrgentDepositDto> urgentDeposits = new ArrayList<>();
        for (PhieuDatCoc d : allDeposits) {
            long remainingSeconds = 0;
            if (d.getHanGiuXe() != null) {
                remainingSeconds = Math.max(0, Duration.between(now, d.getHanGiuXe()).getSeconds());
            }
            WorkspaceUrgentDepositDto depDto = WorkspaceUrgentDepositDto.builder()
                    .id(String.valueOf(d.getId()))
                    .depositCode(d.getMaPhieuCoc())
                    .customerName(d.getNguoiDung() != null ? d.getNguoiDung().getHoTen() : "Khách hàng")
                    .customerPhone(d.getNguoiDung() != null && d.getNguoiDung().getSoDienThoai() != null ? d.getNguoiDung().getSoDienThoai() : "")
                    .carModel(d.getTonKhoXe() != null && d.getTonKhoXe().getPhienBanXe() != null
                            ? d.getTonKhoXe().getPhienBanXe().getTenPhienBan() : "Xe AutoHub")
                    .variant(d.getTonKhoXe() != null && d.getTonKhoXe().getMauSac() != null
                            ? d.getTonKhoXe().getMauSac().getTenMau() : "Tiêu chuẩn")
                    .depositAmount(d.getSoTienCoc() != null ? d.getSoTienCoc().doubleValue() : 0.0)
                    .remainingSeconds(remainingSeconds)
                    .assignedVin(d.getXeDinhDanh() != null ? d.getXeDinhDanh().getSoKhungVIN() : null)
                    .status(d.getTrangThai() != null ? d.getTrangThai().name() : "PAID")
                    .build();
            urgentDeposits.add(depDto);
        }

        // 6. Số liệu badge thực tế cho Sidebar Menu
        WorkspaceSidebarCountsDto sidebarCounts = WorkspaceSidebarCountsDto.builder()
                .totalLeads(allLeads.size())
                .pendingLeads(pendingLeads)
                .totalTestDrives(allTestDrives.size())
                .totalDeposits(allDeposits.size())
                .activeDeposits(activeDeposits)
                .pendingRefunds(pendingRefunds)
                .pendingOrders(pendingOrders)
                .build();

        StaffWorkspaceDto response = StaffWorkspaceDto.builder()
                .kpis(kpis)
                .hourlyTestDrives(hourlyTestDrives)
                .totalTestDrivesCount(allTestDrives.size())
                .depositBreakdown(depositBreakdown)
                .totalDepositsCount(allDeposits.size())
                .todayTimeline(todayTimeline)
                .urgentDeposits(urgentDeposits)
                .sidebarCounts(sidebarCounts)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy dữ liệu vận hành thực tế từ SQL Server thành công"));
    }
}
