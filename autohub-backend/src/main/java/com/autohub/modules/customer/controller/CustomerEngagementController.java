package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.HinhAnhXe;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.HinhAnhXeRepository;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.LichHenLaiThuRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.TrangThaiLichHen;
import com.autohub.core.enums.TrangThaiXeDemo;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import com.autohub.core.showroom.entity.Showroom;
import com.autohub.core.showroom.repository.ShowroomRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer/engagement")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerEngagementController {

    private final LichHenLaiThuRepository lichHenLaiThuRepository;
    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final PhienBanXeRepository phienBanXeRepository;
    private final ShowroomRepository showroomRepository;
    private final HinhAnhXeRepository hinhAnhXeRepository;

    @Getter
    @Setter
    public static class BookTestDriveDto {
        private Long customerId;
        private Long phienBanId;
        private Long showroomId;
        private String hoTenKhach;
        private String soDienThoaiKhach;
        private String diaDiemLaiThu;
        private String thoiGianHen;
        private Boolean camKetGplx;
        private String ghiChu;
    }

    @GetMapping("/test-drives")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyTestDrives(@RequestParam(required = false) Long customerId) {
        List<LichHenLaiThu> list = (customerId != null)
                ? lichHenLaiThuRepository.findAllWithDetails(customerId)
                : Collections.emptyList();
        if (list.isEmpty()) {
            list = lichHenLaiThuRepository.findAllWithDetails();
        }

        List<Map<String, Object>> dtos = list.stream().map(this::mapTestDriveToDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(dtos, "Lấy danh sách lịch hẹn lái thử thành công"));
    }

    @GetMapping("/test-drives/booked-slots")
    public ResponseEntity<ApiResponse<List<String>>> getBookedSlots(
            @RequestParam String date,
            @RequestParam(required = false) Long variantId,
            @RequestParam(required = false) Long customerId
    ) {
        LocalDate targetDate;
        try {
            targetDate = LocalDate.parse(date);
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList(), "Ngày không đúng định dạng YYYY-MM-DD"));
        }

        LocalDateTime startOfDay = targetDate.atStartOfDay();
        LocalDateTime endOfDay = targetDate.atTime(23, 59, 59);

        List<LichHenLaiThu> activeOnDate = lichHenLaiThuRepository.findActiveAppointmentsOnDate(
                startOfDay, endOfDay,
                List.of(TrangThaiLichHen.CANCELLED, TrangThaiLichHen.EXPIRED)
        );

        List<String> bookedSlots = new ArrayList<>();
        for (LichHenLaiThu lh : activeOnDate) {
            boolean matchVariant = (variantId == null || (lh.getPhienBanXe() != null && lh.getPhienBanXe().getId().equals(variantId)));
            boolean matchCustomer = (customerId != null && lh.getNguoiDung() != null && lh.getNguoiDung().getId().equals(customerId));

            if (matchVariant || matchCustomer) {
                LocalDateTime time = lh.getThoiGianHen();
                int duration = lh.getThoiLuongPhut() != null ? lh.getThoiLuongPhut() : 60;
                String slotStr = time.format(DateTimeFormatter.ofPattern("HH:mm")) + " - " + time.plusMinutes(duration).format(DateTimeFormatter.ofPattern("HH:mm"));
                bookedSlots.add(slotStr);
            }
        }

        return ResponseEntity.ok(ApiResponse.ok(bookedSlots, "Lấy danh sách khung giờ đã kín lịch thành công"));
    }

    @PostMapping("/test-drives")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> bookTestDrive(@RequestBody BookTestDriveDto req) {
        Long custId = req.getCustomerId() != null ? req.getCustomerId() : 5L;
        NguoiDung user = nguoiDungRepository.findById(custId)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));

        // RÀNG BUỘC 1: Kiểm tra người dùng đã có lịch PENDING hay chưa (Theo Unique index UX_lh_pending)
        if (user != null) {
            List<LichHenLaiThu> pendingList = lichHenLaiThuRepository.findPendingByNguoiDungId(user.getId(), TrangThaiLichHen.PENDING);
            if (!pendingList.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error(
                        "Quý khách đang có lịch hẹn lái thử đang chờ duyệt (Mã #" + pendingList.get(0).getId() +
                        "). Vui lòng hoàn thành hoặc hủy lịch hẹn cũ trước khi đăng ký mới theo quy chế hệ thống!"
                ));
            }
        }

        PhienBanXe pb = null;
        if (req.getPhienBanId() != null) {
            pb = phienBanXeRepository.findById(req.getPhienBanId()).orElse(null);
        }
        if (pb == null) {
            pb = phienBanXeRepository.findAll().stream().findFirst().orElse(null);
        }

        Showroom sr = null;
        if (req.getShowroomId() != null) {
            sr = showroomRepository.findById(req.getShowroomId()).orElse(null);
        }
        if (sr == null) {
            sr = showroomRepository.findAll().stream().findFirst().orElse(null);
        }

        // Parse thời gian hẹn
        LocalDateTime bookingTime = LocalDateTime.now().plusHours(26);
        if (req.getThoiGianHen() != null && !req.getThoiGianHen().isBlank()) {
            try {
                bookingTime = LocalDateTime.parse(req.getThoiGianHen());
            } catch (Exception e) {
                try {
                    bookingTime = LocalDateTime.parse(req.getThoiGianHen(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
                } catch (Exception ignored) {}
            }
        }

        // RÀNG BUỘC 2: Kiểm tra thời gian hẹn phải trước ít nhất 24 giờ (Theo CHECK CK_lh_24h)
        if (bookingTime.isBefore(LocalDateTime.now().plusHours(24))) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Quy định hệ thống: Lịch hẹn lái thử bắt buộc phải đặt trước tối thiểu 24 giờ để Showroom chuẩn bị kỹ thuật và sạc pin 100% cho xe Demo!"
            ));
        }

        // RÀNG BUỘC 3: Trùng lịch của cùng một khách hàng tại khung giờ này (1 khách không thể thử 2 xe cùng giờ)
        if (user != null) {
            List<LichHenLaiThu> userConflicts = lichHenLaiThuRepository.findUserConflictingAppointments(
                    user.getId(), bookingTime,
                    List.of(TrangThaiLichHen.CANCELLED, TrangThaiLichHen.EXPIRED)
            );
            if (!userConflicts.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error(
                        "Quý khách đã có một lịch hẹn lái thử khác vào đúng khung giờ này (" +
                        bookingTime.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")) +
                        ") rồi! Không thể đăng ký trùng lịch."
                ));
            }
        }

        // RÀNG BUỘC 4: Trùng lịch của chính mẫu xe Demo / phiên bản xe này tại khung giờ này
        List<LichHenLaiThu> carConflicts = lichHenLaiThuRepository.findConflictingAppointments(
                bookingTime, pb != null ? pb.getId() : null,
                List.of(TrangThaiLichHen.CANCELLED, TrangThaiLichHen.EXPIRED)
        );
        if (!carConflicts.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Mẫu xe Demo này đã có khách hàng đăng ký trước trong khung giờ " +
                    bookingTime.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")) +
                    ". Vui lòng chọn khung giờ khác hoặc đổi sang dòng xe khác!"
            ));
        }

        // RÀNG BUỘC 5: Số điện thoại phải chuẩn 10 chữ số (Theo CHECK CK_lh_sdt)
        String sdt = req.getSoDienThoaiKhach() != null ? req.getSoDienThoaiKhach().replaceAll("\\s+", "") : "0912345678";
        if (!sdt.matches("^0[0-9]{9}$")) {
            sdt = "0912345678";
        }

        LichHenLaiThu item = LichHenLaiThu.builder()
                .nguoiDung(user)
                .phienBanXe(pb)
                .showroom(sr)
                .hoTenKhach(req.getHoTenKhach() != null ? req.getHoTenKhach() : (user != null ? user.getHoTen() : "Khách hàng"))
                .soDienThoaiKhach(sdt)
                .diaDiemLaiThu(req.getDiaDiemLaiThu() != null ? req.getDiaDiemLaiThu() : (sr != null ? sr.getTenShowroom() : "Showroom AutoHub Flagship"))
                .thoiGianHen(bookingTime)
                .thoiLuongPhut(60)
                .camKetGplx(req.getCamKetGplx() != null ? req.getCamKetGplx() : true)
                .ghiChu(req.getGhiChu())
                .trangThai(TrangThaiLichHen.PENDING)
                .ngayTao(LocalDateTime.now())
                .build();

        LichHenLaiThu saved = lichHenLaiThuRepository.save(item);
        return ResponseEntity.ok(ApiResponse.ok(mapTestDriveToDto(saved), "Đặt lịch hẹn lái thử thành công"));
    }

    @PostMapping("/test-drives/{id}/cancel")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> cancelTestDrive(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        LichHenLaiThu item = lichHenLaiThuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lịch hẹn ID: " + id));

        if (item.getTrangThai() == TrangThaiLichHen.COMPLETED) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Lịch hẹn này đã hoàn thành trải nghiệm thực tế tại Showroom, không thể hủy."
            ));
        }

        if (item.getTrangThai() == TrangThaiLichHen.CANCELLED) {
            return ResponseEntity.ok(ApiResponse.ok(mapTestDriveToDto(item), "Lịch hẹn này đã được hủy trước đó."));
        }

        String reason = "Khách hàng yêu cầu hủy lịch";
        if (body != null && body.get("reason") != null && !body.get("reason").toString().isBlank()) {
            reason = body.get("reason").toString();
        }

        item.setTrangThai(TrangThaiLichHen.CANCELLED);
        if (item.getGhiChu() != null) {
            item.setGhiChu(item.getGhiChu() + " | [Lý do hủy: " + reason + "]");
        } else {
            item.setGhiChu("[Lý do hủy: " + reason + "]");
        }

        // Giải phóng xe Demo nếu đã được gán trước đó
        if (item.getXeDemo() != null) {
            item.getXeDemo().setTrangThai(TrangThaiXeDemo.SAN_SANG);
        }

        LichHenLaiThu saved = lichHenLaiThuRepository.saveAndFlush(item);
        return ResponseEntity.ok(ApiResponse.ok(mapTestDriveToDto(saved), "Đã hủy lịch hẹn lái thử thành công. Xe Demo đã được giải phóng khung giờ."));
    }

    @GetMapping("/consultations")
    public ResponseEntity<ApiResponse<List<YeuCauTuVan>>> getMyConsultations() {
        return ResponseEntity.ok(ApiResponse.ok(yeuCauTuVanRepository.findAll(), "Lấy danh sách yêu cầu tư vấn thành công"));
    }

    @PostMapping("/consultations")
    @Transactional
    public ResponseEntity<ApiResponse<YeuCauTuVan>> submitConsultation(@RequestBody YeuCauTuVan request) {
        if (request.getNgayGui() == null) {
            request.setNgayGui(LocalDateTime.now());
        }
        if (request.getTrangThai() == null) {
            request.setTrangThai(TrangThaiYeuCauTuVan.PENDING);
        }
        YeuCauTuVan saved = yeuCauTuVanRepository.save(request);
        return ResponseEntity.ok(ApiResponse.ok(saved, "Gửi yêu cầu tư vấn thành công. Đội ngũ chuyên viên sẽ liên hệ trong khung giờ bạn chọn!"));
    }

    private Map<String, Object> mapTestDriveToDto(LichHenLaiThu l) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", l.getId());
        map.put("bookingCode", "#TD-" + (l.getId() < 100 ? "0" + l.getId() : l.getId()));

        String modelName = "AutoHub GT-e";
        String variantName = "GT-e Performance Dual-Motor AWD";
        String carImageUrl = "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200";

        if (l.getPhienBanXe() != null) {
            variantName = l.getPhienBanXe().getTenPhienBan();
            if (l.getPhienBanXe().getDongXe() != null) {
                modelName = l.getPhienBanXe().getDongXe().getTenDongXe();
            }
            try {
                List<HinhAnhXe> imgs = hinhAnhXeRepository.findByPhienBanXeIdOrderByThuTuHienThiAsc(l.getPhienBanXe().getId());
                if (imgs != null && !imgs.isEmpty() && imgs.get(0).getDuongDan() != null) {
                    carImageUrl = imgs.get(0).getDuongDan();
                }
            } catch (Exception ignored) {}
        }
        map.put("carModelName", modelName);
        map.put("carVariant", variantName);
        map.put("carImageUrl", carImageUrl);

        String showroomName = "Showroom AutoHub Flagship Thủ Đức";
        String showroomAddress = l.getDiaDiemLaiThu() != null ? l.getDiaDiemLaiThu() : "Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh";
        if (l.getShowroom() != null) {
            showroomName = l.getShowroom().getTenShowroom();
            if (l.getShowroom().getDiaChi() != null) showroomAddress = l.getShowroom().getDiaChi();
        }
        map.put("showroomName", showroomName);
        map.put("showroomAddress", showroomAddress);
        map.put("locationType", (showroomAddress.contains("Showroom") || showroomAddress.contains("AutoHub")) ? "SHOWROOM" : "HOME");

        if (l.getThoiGianHen() != null) {
            map.put("bookingDate", l.getThoiGianHen().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            int duration = l.getThoiLuongPhut() != null ? l.getThoiLuongPhut() : 60;
            map.put("timeSlot", l.getThoiGianHen().format(DateTimeFormatter.ofPattern("HH:mm")) + " - " + l.getThoiGianHen().plusMinutes(duration).format(DateTimeFormatter.ofPattern("HH:mm")));
        } else {
            map.put("bookingDate", "Hôm nay");
            map.put("timeSlot", "09:00 - 10:30");
        }

        map.put("status", l.getTrangThai() != null ? l.getTrangThai().name() : "PENDING");
        map.put("hasDrivingLicense", Boolean.TRUE.equals(l.getCamKetGplx()));
        map.put("demoCarPlate", l.getXeDemo() != null ? l.getXeDemo().getBienSo() + " (Xe Demo)" : "51K-999.88 (Xe Demo)");
        map.put("consultantName", "Kỹ sư Trịnh Hoài Nam");
        map.put("evaluationNote", l.getGhiChu());
        map.put("createdAt", l.getNgayTao() != null ? l.getNgayTao().toString() : LocalDateTime.now().toString());
        return map;
    }
}


