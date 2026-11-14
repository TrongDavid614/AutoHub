package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.pricing.entity.Voucher;
import com.autohub.core.pricing.repository.VoucherRepository;
import com.autohub.modules.admin.dto.AdminVoucherDto;
import com.autohub.modules.admin.dto.CreateVoucherRequest;
import com.autohub.modules.admin.dto.UpdateVoucherRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin/vouchers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVoucherController {

    private final VoucherRepository voucherRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminVoucherDto>>> getAllVouchers() {
        List<Voucher> list = voucherRepository.findAllByOrderByIdDesc();
        List<AdminVoucherDto> dtos = list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtos, "Tải danh sách voucher khuyến mãi thành công"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<AdminVoucherDto>> createVoucher(
            @Valid @RequestBody CreateVoucherRequest request) {

        String code = request.getCode().trim().toUpperCase();
        if (voucherRepository.existsByMaVoucher(code)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã voucher '" + code + "' đã tồn tại trong hệ thống"));
        }

        Voucher voucher = Voucher.builder()
                .maVoucher(code)
                .phanTramGiam(request.getDiscountPercent())
                .giamToiDa(request.getMaxDiscountAmount())
                .ngayHetHan(request.getExpiryDate())
                .dangHoatDong(request.getActive() != null ? request.getActive() : true)
                .build();

        voucher = voucherRepository.save(voucher);
        log.info("Admin created new voucher: #{} {}", voucher.getId(), voucher.getMaVoucher());

        return ResponseEntity.ok(ApiResponse.ok(toDto(voucher), "Tạo mã voucher mới thành công"));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<AdminVoucherDto>> updateVoucher(
            @PathVariable Long id,
            @Valid @RequestBody UpdateVoucherRequest request) {

        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy voucher với ID: " + id));

        if (request.getDiscountPercent() != null) {
            voucher.setPhanTramGiam(request.getDiscountPercent());
        }
        if (request.getMaxDiscountAmount() != null) {
            voucher.setGiamToiDa(request.getMaxDiscountAmount());
        }
        if (request.getExpiryDate() != null) {
            voucher.setNgayHetHan(request.getExpiryDate());
        }
        if (request.getActive() != null) {
            voucher.setDangHoatDong(request.getActive());
        }

        voucherRepository.save(voucher);
        log.info("Admin updated voucher #{}", id);

        return ResponseEntity.ok(ApiResponse.ok(toDto(voucher), "Cập nhật voucher thành công"));
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<AdminVoucherDto>> toggleStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {

        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy voucher với ID: " + id));

        voucher.setDangHoatDong(active);
        voucherRepository.save(voucher);
        log.info("Admin set active status for voucher #{}: {}", id, active);

        return ResponseEntity.ok(ApiResponse.ok(toDto(voucher), "Cập nhật trạng thái voucher thành công"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteVoucher(@PathVariable Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy voucher với ID: " + id));

        voucherRepository.delete(voucher);
        log.info("Admin deleted voucher #{}", id);

        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa mã voucher thành công"));
    }

    private AdminVoucherDto toDto(Voucher v) {
        LocalDate today = LocalDate.now();
        boolean isExpired = v.getNgayHetHan() != null && v.getNgayHetHan().isBefore(today);

        String statusText;
        if (!v.isDangHoatDong()) {
            statusText = "Tạm dừng";
        } else if (isExpired) {
            statusText = "Đã hết hạn";
        } else {
            statusText = "Đang chạy";
        }

        return AdminVoucherDto.builder()
                .id(v.getId())
                .code(v.getMaVoucher())
                .discountPercent(v.getPhanTramGiam())
                .maxDiscountAmount(v.getGiamToiDa())
                .expiryDate(v.getNgayHetHan())
                .active(v.isDangHoatDong())
                .statusText(statusText)
                .expired(isExpired)
                .build();
    }
}
