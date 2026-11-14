package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.pricing.entity.Voucher;
import com.autohub.core.pricing.repository.VoucherRepository;
import com.autohub.modules.admin.dto.AdminVoucherDto;
import com.autohub.modules.admin.dto.CreateVoucherRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/vouchers")
@RequiredArgsConstructor
public class AdminVoucherController {

    private final VoucherRepository voucherRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllVouchers() {
        List<Voucher> list = voucherRepository.findAll();

        long activeCount = list.stream().filter(v -> v.isDangHoatDong() && (v.getNgayHetHan() == null || !v.getNgayHetHan().isBefore(LocalDate.now()))).count();

        List<AdminVoucherDto> dtos = list.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("vouchers", dtos);
        response.put("activeCount", activeCount);
        response.put("totalVouchers", list.size());
        response.put("totalBudgetDisbursed", "450.000.000 ₫");
        response.put("totalAppliedCount", 375);

        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách voucher thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminVoucherDto>> createVoucher(@Valid @RequestBody CreateVoucherRequest req) {
        String code = req.getMaVoucher().trim().toUpperCase();
        if (voucherRepository.findByMaVoucher(code).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã voucher '" + code + "' đã tồn tại!"));
        }

        Voucher v = Voucher.builder()
                .maVoucher(code)
                .phanTramGiam(req.getPhanTramGiam())
                .giamToiDa(req.getGiamToiDa())
                .ngayHetHan(req.getNgayHetHan())
                .dangHoatDong(req.getDangHoatDong() != null ? req.getDangHoatDong() : true)
                .build();

        Voucher saved = voucherRepository.save(v);
        return ResponseEntity.ok(ApiResponse.ok(mapToDto(saved), "Tạo voucher mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminVoucherDto>> updateVoucher(
            @PathVariable Long id,
            @RequestBody CreateVoucherRequest req
    ) {
        Optional<Voucher> opt = voucherRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy voucher với ID: " + id));
        }

        Voucher v = opt.get();
        if (req.getPhanTramGiam() != null) {
            v.setPhanTramGiam(req.getPhanTramGiam());
        }
        if (req.getGiamToiDa() != null) {
            v.setGiamToiDa(req.getGiamToiDa());
        }
        if (req.getNgayHetHan() != null) {
            v.setNgayHetHan(req.getNgayHetHan());
        }
        if (req.getDangHoatDong() != null) {
            v.setDangHoatDong(req.getDangHoatDong());
        }

        Voucher updated = voucherRepository.save(v);
        return ResponseEntity.ok(ApiResponse.ok(mapToDto(updated), "Cập nhật voucher thành công"));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Boolean>> toggleStatus(@PathVariable Long id) {
        Optional<Voucher> opt = voucherRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy voucher với ID: " + id));
        }

        Voucher v = opt.get();
        v.setDangHoatDong(!v.isDangHoatDong());
        voucherRepository.save(v);

        return ResponseEntity.ok(ApiResponse.ok(v.isDangHoatDong(),
                v.isDangHoatDong() ? "Đã kích hoạt chiến dịch voucher" : "Đã tạm dừng chiến dịch voucher"));
    }

    private AdminVoucherDto mapToDto(Voucher v) {
        NumberFormat nf = NumberFormat.getInstance(new Locale("vi", "VN"));
        String discountText;
        if (v.getPhanTramGiam() != null && v.getPhanTramGiam() > 0) {
            discountText = "Giảm " + v.getPhanTramGiam() + "%" + 
                    (v.getGiamToiDa() != null ? " (Tối đa " + nf.format(v.getGiamToiDa()) + " ₫)" : "");
        } else if (v.getGiamToiDa() != null) {
            discountText = "Giảm " + nf.format(v.getGiamToiDa()) + " ₫";
        } else {
            discountText = "Ưu đãi theo đơn hàng";
        }

        boolean isExpired = v.getNgayHetHan() != null && v.getNgayHetHan().isBefore(LocalDate.now());
        String status = !v.isDangHoatDong() ? "Đã tạm dừng" : (isExpired ? "Đã hết hạn" : "Đang chạy");

        int usageCount = 85;
        int maxUsage = 100;
        int pct = Math.min(100, (int) Math.round((usageCount * 100.0) / maxUsage));

        return AdminVoucherDto.builder()
                .id(v.getId())
                .code(v.getMaVoucher())
                .title("Chương trình ưu đãi mã " + v.getMaVoucher())
                .discountPercentage(v.getPhanTramGiam())
                .maxDiscount(v.getGiamToiDa())
                .formattedDiscount(discountText)
                .minOrderFormatted("Áp dụng đơn từ 2 triệu")
                .usageCount(usageCount)
                .maxUsage(maxUsage)
                .usagePercent(pct)
                .expiryDate(v.getNgayHetHan())
                .isActive(v.isDangHoatDong())
                .status(status)
                .build();
    }
}
