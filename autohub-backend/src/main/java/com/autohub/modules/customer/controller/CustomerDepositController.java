package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.HinhAnhXe;
import com.autohub.core.car.repository.HinhAnhXeRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.showroom.entity.TonKhoXe;
import com.autohub.core.showroom.repository.TonKhoXeRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import lombok.*;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyDeposits(@RequestParam(required = false) Long customerId) {
        List<PhieuDatCoc> deposits;
        if (customerId != null) {
            deposits = depositRepository.findByNguoiDungId(customerId);
            if (deposits.isEmpty()) {
                deposits = depositRepository.findAll();
            }
        } else {
            deposits = depositRepository.findAll();
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
    public ResponseEntity<ApiResponse<Map<String, Object>>> createDeposit(@RequestBody CreateDepositRequestDto req) {
        Long custId = req.getCustomerId() != null ? req.getCustomerId() : 5L;
        NguoiDung customer = nguoiDungRepository.findById(custId)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));

        TonKhoXe tonKho = null;
        if (req.getTonKhoId() != null) {
            tonKho = tonKhoXeRepository.findById(req.getTonKhoId()).orElse(null);
        }
        if (tonKho == null && req.getPhienBanId() != null) {
            tonKho = tonKhoXeRepository.findAll().stream()
                    .filter(tk -> tk.getPhienBanXe() != null && req.getPhienBanId().equals(tk.getPhienBanXe().getId()))
                    .findFirst()
                    .orElse(null);
        }
        if (tonKho == null) {
            tonKho = tonKhoXeRepository.findAll().stream().findFirst().orElse(null);
        }

        String maPhieu = "DEP-" + (System.currentTimeMillis() % 1000000);
        BigDecimal amount = (req.getSoTienCoc() != null) ? req.getSoTienCoc() : BigDecimal.valueOf(20000000);
        LocalDateTime now = LocalDateTime.now();

        // EXTENSION POINT: TÍCH HỢP CỔNG THANH TOÁN (VNPay / SePay / Ngân hàng)
        // Module thanh toán của thành viên khác có thể cắm trực tiếp tại đây:
        // 1. Chuyển trạng thái ban đầu thành TrangThaiPhieuCoc.PENDING_PAYMENT (hoặc PAID nếu thanh toán trực tiếp)
        // 2. Tạo bản ghi GiaoDichThanhToan liên kết với phieu_dat_coc_id
        // 3. Sinh Payment URL / QR Code trả về trong DTO cho Frontend
        PhieuDatCoc deposit = PhieuDatCoc.builder()
                .maPhieuCoc(maPhieu)
                .nguoiDung(customer)
                .tonKhoXe(tonKho)
                .soCCCD(req.getSoCCCD() != null ? req.getSoCCCD() : "001201009988")
                .soTienCoc(amount)
                .ngayDatCoc(now)
                .hanThanhToan(now.plusHours(72))
                .thoiGianThanhToan(now)
                .hanGiuXe(now.plusHours(72))
                .trangThai(TrangThaiPhieuCoc.PAID)
                .build();

        PhieuDatCoc saved = depositRepository.save(deposit);
        return ResponseEntity.ok(ApiResponse.ok(mapDepositToDto(saved), "Đặt cọc giữ chỗ xe thành công! Suất giữ xe có hiệu lực 72 giờ."));
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<Map<String, Object>>> requestRefund(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        PhieuDatCoc deposit = depositRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu cọc ID: " + id));
        deposit.setTrangThai(TrangThaiPhieuCoc.REFUND_REQUESTED);
        PhieuDatCoc saved = depositRepository.save(deposit);
        return ResponseEntity.ok(ApiResponse.ok(mapDepositToDto(saved), "Gửi yêu cầu hoàn cọc thành công! Nhân viên đối soát và Admin sẽ thẩm định theo quy chế BR05."));
    }

    // EXTENSION POINT: CALLBACK / WEBHOOK XÁC NHẬN THANH TOÁN TIỀN CỌC
    // Cổng thanh toán (VNPay IPN / SePay Webhook) hoặc admin đối soát sẽ gọi endpoint này
    // để kích hoạt trạng thái PAID và kích hoạt thời hạn giữ xe 72 giờ trong kho
    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<Map<String, Object>>> confirmPayment(@PathVariable Long id) {
        PhieuDatCoc deposit = depositRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu cọc ID: " + id));
        LocalDateTime now = LocalDateTime.now();
        deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
        deposit.setThoiGianThanhToan(now);
        deposit.setHanGiuXe(now.plusHours(72));
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
        map.put("customerName", p.getNguoiDung() != null ? p.getNguoiDung().getHoTen() : "Nguyễn Văn A");
        map.put("customerPhone", p.getNguoiDung() != null ? p.getNguoiDung().getSoDienThoai() : "0912345678");
        map.put("showroomName", showroomName);
        map.put("showroomAddress", showroomAddress);
        map.put("status", p.getTrangThai() != null ? p.getTrangThai().name() : "PAID");

        if (p.getXeDinhDanh() != null) {
            map.put("vinNumber", p.getXeDinhDanh().getSoKhungVIN());
        } else {
            map.put("vinNumber", "VIN-" + (code.replace("#", "").replace("DEP-", "")));
        }

        map.put("sepayTransactionId", "SP_" + (Math.abs(code.hashCode()) % 10000000));
        map.put("paidAt", p.getThoiGianThanhToan() != null ? p.getThoiGianThanhToan().toString() : (p.getNgayDatCoc() != null ? p.getNgayDatCoc().toString() : LocalDateTime.now().toString()));
        map.put("expireAt", p.getHanGiuXe() != null ? p.getHanGiuXe().toString() : LocalDateTime.now().plusHours(72).toString());
        map.put("createdAt", p.getNgayDatCoc() != null ? p.getNgayDatCoc().toString() : LocalDateTime.now().toString());

        return map;
    }
}
