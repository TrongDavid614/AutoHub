package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.PhuongThucVanChuyen;
import com.autohub.core.accessory.repository.PhuongThucVanChuyenRepository;
import com.autohub.modules.customer.dto.ShippingMethodDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping({"/customer/shipping-methods", "/shipping-methods"})
@RequiredArgsConstructor
public class CustomerShippingController {

    private final PhuongThucVanChuyenRepository shippingRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShippingMethodDto>>> getShippingMethods() {
        List<PhuongThucVanChuyen> entities = shippingRepository.findByDangHoatDongTrueAndIsDeletedFalseOrderByThuTuAsc();

        // Tự động khởi tạo dữ liệu mẫu nếu bảng chưa có bản ghi
        if (entities.isEmpty()) {
            ensureDefaultShippingMethods();
            entities = shippingRepository.findByDangHoatDongTrueAndIsDeletedFalseOrderByThuTuAsc();
        }

        List<ShippingMethodDto> dtoList = entities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtoList, "Lấy danh sách phương thức vận chuyển thành công"));
    }

    private ShippingMethodDto mapToDto(PhuongThucVanChuyen entity) {
        String methodId = entity.getMaPhuongThuc() != null
                ? entity.getMaPhuongThuc().toLowerCase().replace('_', '-')
                : "standard";

        boolean isDefault = "STANDARD".equalsIgnoreCase(entity.getMaPhuongThuc())
                || "standard".equalsIgnoreCase(methodId);

        return ShippingMethodDto.builder()
                .id(entity.getId())
                .methodId(methodId)
                .code(entity.getMaPhuongThuc())
                .title(entity.getTenPhuongThuc())
                .tag(entity.getTag() != null ? entity.getTag() : "TIÊU CHUẨN")
                .price(entity.getChiPhi() != null ? entity.getChiPhi() : BigDecimal.ZERO)
                .estimatedDelivery(entity.getThoiGianDuKien() != null ? entity.getThoiGianDuKien() : "1 - 2 ngày")
                .subDescription(entity.getSubMoTa() != null ? entity.getSubMoTa() : "")
                .freeThreshold(entity.getDieuKienMienPhi())
                .isDefault(isDefault)
                .build();
    }

    private void ensureDefaultShippingMethods() {
        try {
            shippingRepository.save(PhuongThucVanChuyen.builder()
                    .maPhuongThuc("STANDARD")
                    .tenPhuongThuc("Giao hàng tiêu chuẩn AutoHub Logistics")
                    .tag("BẢO HIỂM HÀNG HÓA 100%")
                    .thoiGianDuKien("1 - 2 ngày làm việc")
                    .chiPhi(BigDecimal.ZERO)
                    .subMoTa("Bàn giao niêm phong thùng chuyên dụng, kiểm tra hàng trước khi nhận")
                    .thuTu(1)
                    .dangHoatDong(true)
                    .build());

            shippingRepository.save(PhuongThucVanChuyen.builder()
                    .maPhuongThuc("EXPRESS_TECHNICIAN")
                    .tenPhuongThuc("Hỏa tốc & Kỹ thuật viên hỗ trợ lắp đặt tại chỗ")
                    .tag("VIP ON-SITE TECH")
                    .thoiGianDuKien("Trong ngày (2 - 4h)")
                    .chiPhi(new BigDecimal("150000"))
                    .dieuKienMienPhi(new BigDecimal("50000000"))
                    .subMoTa("Bao gồm khảo sát đường dây điện, kích hoạt sạc thông minh và kiểm tra an toàn tải điện")
                    .thuTu(2)
                    .dangHoatDong(true)
                    .build());

            shippingRepository.save(PhuongThucVanChuyen.builder()
                    .maPhuongThuc("SHOWROOM_PICKUP")
                    .tenPhuongThuc("Nhận trực tiếp tại Hệ thống Showroom AutoHub")
                    .tag("TRẢI NGHIỆM SHOWROOM")
                    .thoiGianDuKien("Sẵn sàng trong 2 giờ")
                    .chiPhi(BigDecimal.ZERO)
                    .subMoTa("Hỗ trợ kỹ thuật viên hướng dẫn lắp đặt trực tiếp và thử nghiệm thiết bị tại Showroom")
                    .thuTu(3)
                    .dangHoatDong(true)
                    .build());

            log.info("Initialized default shipping methods in database");
        } catch (Exception e) {
            log.warn("Could not seed default shipping methods: {}", e.getMessage());
        }
    }
}
