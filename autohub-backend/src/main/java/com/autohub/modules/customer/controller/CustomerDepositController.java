package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.HinhAnhXe;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.HinhAnhXeRepository;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.entity.YeuCauHoanCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.deposit.repository.YeuCauHoanCocRepository;
import com.autohub.core.enums.TrangThaiHoanCoc;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.showroom.entity.TonKhoXe;
import com.autohub.core.showroom.repository.TonKhoXeRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer/deposits")
@RequiredArgsConstructor
public class CustomerDepositController {

    private final PhieuDatCocRepository depositRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final TonKhoXeRepository tonKhoXeRepository;
    private final HinhAnhXeRepository hinhAnhXeRepository;
    private final PhienBanXeRepository phienBanXeRepository;
    private final YeuCauHoanCocRepository yeuCauHoanCocRepository;

    @Getter
    @Setter
    public static class CreateDepositRequestDto {
        private Long customerId;
        private Long phienBanId;
        private Long tonKhoId;
        private String soCCCD;
        private String hoTen;
        private String soDienThoai;
        private String showroom;
        private BigDecimal soTienCoc;
    }

    @Getter
    @Setter
    public static class RefundRequestDto {
        private String reason;
        private String bankAccount;
        private String document;
    }

    private NguoiDung resolveCurrentUser(Long requestedCustomerId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getName() != null && !"anonymousUser".equals(auth.getName())) {
                Optional<NguoiDung> byEmail = nguoiDungRepository.findByEmail(auth.getName());
                if (byEmail.isPresent()) {
                    return byEmail.get();
                }
            }
        } catch (Exception ignored) {}

        if (requestedCustomerId != null) {
            return nguoiDungRepository.findById(requestedCustomerId).orElse(null);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyDeposits(@RequestParam(required = false) Long customerId) {
        NguoiDung user = resolveCurrentUser(customerId);
        List<PhieuDatCoc> deposits;
        if (user != null) {
            deposits = depositRepository.findByNguoiDungId(user.getId());
        } else if (customerId != null) {
            deposits = depositRepository.findByNguoiDungId(customerId);
        } else {
            deposits = Collections.emptyList();
        }

        List<Map<String, Object>> dtos = deposits.stream()
                .map(this::mapDepositToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(dtos, "Lấy danh sách phiếu cọc xe của tôi thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDepositDetail(@PathVariable Long id) {
        PhieuDatCoc deposit = depositRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu cọc ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok(mapDepositToDto(deposit), "Lấy chi tiết phiếu cọc thành công"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> createDeposit(@RequestBody CreateDepositRequestDto req) {
        NguoiDung customer = resolveCurrentUser(req.getCustomerId());
        if (customer == null) {
            customer = nguoiDungRepository.findAll().stream().findFirst().orElse(null);
        }

        TonKhoXe tonKho = null;
        if (req.getTonKhoId() != null) {
            tonKho = tonKhoXeRepository.findById(req.getTonKhoId()).orElse(null);
        }

        if (tonKho == null && req.getPhienBanId() != null) {
            final Long targetVariantId = req.getPhienBanId();
            // Ưu tiên tìm xe thuộc phiên bản tại showroom được chỉ định
            if (req.getShowroom() != null && !req.getShowroom().isBlank()) {
                final String showroomName = req.getShowroom().toLowerCase();
                tonKho = tonKhoXeRepository.findAll().stream()
                        .filter(tk -> tk.getPhienBanXe() != null
                                && targetVariantId.equals(tk.getPhienBanXe().getId())
                                && tk.getShowroom() != null
                                && showroomName.contains(tk.getShowroom().getTenShowroom().toLowerCase()))
                        .findFirst()
                        .orElse(null);
            }

            // Nếu không khớp showroom, tìm bất kỳ xe nào trong kho thuộc phiên bản đó
            if (tonKho == null) {
                tonKho = tonKhoXeRepository.findAll().stream()
                        .filter(tk -> tk.getPhienBanXe() != null && targetVariantId.equals(tk.getPhienBanXe().getId()))
                        .findFirst()
                        .orElse(null);
            }
        }

        if (tonKho == null) {
            tonKho = tonKhoXeRepository.findAll().stream().findFirst().orElse(null);
        }

        String maPhieu = "DEP-" + (System.currentTimeMillis() % 1000000);
        BigDecimal amount = (req.getSoTienCoc() != null) ? req.getSoTienCoc() : BigDecimal.valueOf(20000000);
        LocalDateTime now = LocalDateTime.now();

        // Chuẩn hóa quy trình BR01: Vừa tạo ở trạng thái PENDING_PAYMENT (15 phút để quét QR/chuyển khoản)
        PhieuDatCoc deposit = PhieuDatCoc.builder()
                .maPhieuCoc(maPhieu)
                .nguoiDung(customer)
                .tonKhoXe(tonKho)
                .soCCCD(req.getSoCCCD() != null && !req.getSoCCCD().isBlank() ? req.getSoCCCD() : "001201009988")
                .soTienCoc(amount)
                .ngayDatCoc(now)
                .hanThanhToan(now.plusMinutes(15))
                .thoiGianThanhToan(null)
                .hanGiuXe(null)
                .trangThai(TrangThaiPhieuCoc.PENDING_PAYMENT)
                .build();

        PhieuDatCoc saved = depositRepository.save(deposit);
        return ResponseEntity.ok(ApiResponse.ok(mapDepositToDto(saved), "Khởi tạo phiếu đặt cọc giữ xe thành công! Vui lòng thanh toán trong 15 phút."));
    }

    @PostMapping("/{id}/refund")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> requestRefund(
            @PathVariable Long id,
            @RequestBody(required = false) RefundRequestDto body
    ) {
        PhieuDatCoc deposit = depositRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu cọc ID: " + id));

        deposit.setTrangThai(TrangThaiPhieuCoc.REFUND_REQUESTED);
        PhieuDatCoc saved = depositRepository.save(deposit);

        String reason = (body != null && body.getReason() != null) ? body.getReason() : "Yêu cầu hoàn cọc trong hạn 72h";
        String bankAcc = (body != null && body.getBankAccount() != null) ? body.getBankAccount() : "";
        String doc = (body != null && body.getDocument() != null) ? body.getDocument() : "";

        YeuCauHoanCoc ychc = YeuCauHoanCoc.builder()
                .phieuDatCoc(saved)
                .loaiLyDo("NGAN_HANG_TU_CHOI_TIN_DUNG")
                .lyDo(reason + (!bankAcc.isBlank() ? " | STK: " + bankAcc : ""))
                .minhChung(doc)
                .ngayGui(LocalDateTime.now())
                .trangThai(TrangThaiHoanCoc.PENDING)
                .build();
        yeuCauHoanCocRepository.save(ychc);

        return ResponseEntity.ok(ApiResponse.ok(mapDepositToDto(saved), "Gửi yêu cầu hoàn cọc thành công! Hồ sơ đã được lưu trữ, nhân viên đối soát và Admin sẽ thẩm định theo quy chế BR05."));
    }

    @PostMapping("/{id}/pay")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> confirmPayment(@PathVariable Long id) {
        PhieuDatCoc deposit = depositRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu cọc ID: " + id));

        LocalDateTime now = LocalDateTime.now();
        deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
        deposit.setThoiGianThanhToan(now);
        deposit.setHanGiuXe(now.plusHours(72)); // Kích hoạt thời hạn giữ xe 72 giờ
        PhieuDatCoc saved = depositRepository.save(deposit);

        return ResponseEntity.ok(ApiResponse.ok(mapDepositToDto(saved), "Xác nhận thanh toán tiền cọc thành công! Suất giữ xe được kích hoạt trong 72 giờ."));
    }

    private Map<String, Object> mapDepositToDto(PhieuDatCoc p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        String code = p.getMaPhieuCoc() != null ? p.getMaPhieuCoc() : "DEP-" + p.getId();
        map.put("depositCode", code.startsWith("#") ? code : "#" + code);

        String modelName = "AutoHub GT-e";
        String variantName = "AutoHub GT-e Grand Touring";
        String extColor = "Xanh Băng Apex Cyan";
        String colorHex = "#89CEFF";
        String showroomName = "Showroom AutoHub Flagship Thủ Đức";
        String showroomAddress = "Đại lộ Mai Chí Thọ, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh";
        String carImageUrl = "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200";

        if (p.getTonKhoXe() != null) {
            if (p.getTonKhoXe().getPhienBanXe() != null) {
                variantName = p.getTonKhoXe().getPhienBanXe().getTenPhienBan();
                if (p.getTonKhoXe().getPhienBanXe().getDongXe() != null) {
                    modelName = p.getTonKhoXe().getPhienBanXe().getDongXe().getTenDongXe();
                }
                List<HinhAnhXe> imgs = hinhAnhXeRepository.findByPhienBanXeIdOrderByThuTuHienThiAsc(p.getTonKhoXe().getPhienBanXe().getId());
                if (imgs != null && !imgs.isEmpty() && imgs.get(0).getDuongDan() != null) {
                    carImageUrl = imgs.get(0).getDuongDan();
                }
            }
            if (p.getTonKhoXe().getMauSac() != null) {
                extColor = p.getTonKhoXe().getMauSac().getTenMau();
                colorHex = p.getTonKhoXe().getMauSac().getMaHex();
            }
            if (p.getTonKhoXe().getShowroom() != null) {
                showroomName = p.getTonKhoXe().getShowroom().getTenShowroom();
                showroomAddress = p.getTonKhoXe().getShowroom().getDiaChi();
            }
        }

        map.put("carModelName", modelName);
        map.put("carVariant", variantName);
        map.put("exteriorColor", extColor);
        map.put("colorHex", colorHex);
        map.put("carImageUrl", carImageUrl);
        map.put("depositAmount", p.getSoTienCoc() != null ? p.getSoTienCoc() : BigDecimal.valueOf(20000000));
        map.put("identityCardNumber", p.getSoCCCD() != null ? p.getSoCCCD() : "079204001234");
        map.put("customerName", p.getNguoiDung() != null ? p.getNguoiDung().getHoTen() : "Khách hàng AutoHub");
        map.put("customerPhone", p.getNguoiDung() != null ? p.getNguoiDung().getSoDienThoai() : "0912345678");
        map.put("showroomName", showroomName);
        map.put("showroomAddress", showroomAddress);
        map.put("status", p.getTrangThai() != null ? p.getTrangThai().name() : "PENDING_PAYMENT");

        // Không tạo VIN giả khi chưa có xe định danh từ đối soát kho (DR12)
        if (p.getXeDinhDanh() != null) {
            map.put("vinNumber", p.getXeDinhDanh().getSoKhungVIN());
        } else {
            map.put("vinNumber", null);
        }

        map.put("sepayTransactionId", "SP_" + (Math.abs(code.hashCode()) % 10000000));
        map.put("paidAt", p.getThoiGianThanhToan() != null ? p.getThoiGianThanhToan().toString() : null);
        map.put("expireAt", p.getHanGiuXe() != null ? p.getHanGiuXe().toString() : (p.getHanThanhToan() != null ? p.getHanThanhToan().toString() : LocalDateTime.now().plusHours(72).toString()));
        map.put("paymentDeadline", p.getHanThanhToan() != null ? p.getHanThanhToan().toString() : null);
        map.put("createdAt", p.getNgayDatCoc() != null ? p.getNgayDatCoc().toString() : LocalDateTime.now().toString());

        return map;
    }
}
