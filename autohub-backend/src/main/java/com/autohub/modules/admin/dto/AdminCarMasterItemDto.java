package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCarMasterItemDto {
    private String id; // Mã hiển thị: VF8-01, VF9-01, STF-01, CRV-01
    private Long variantId;
    private Long modelId;
    private Long brandId;
    private String brandName;
    private String name; // Tên dòng xe: VinFast VF8
    private String version; // Tên phiên bản: Plus AWD (402 HP)
    private String segment; // D-SUV • Thuần Điện
    private String bodySegment; // D-SUV, E-SUV, C-SUV
    private String powertrain; // Thuần Điện, Hybrid Xăng-Điện
    private String price; // 1.499.000.000 ₫
    private BigDecimal rawPrice;
    private String deposit; // 20.000.000 ₫
    private BigDecimal rawDeposit;
    private String demoCount; // 3 Xe sẵn sàng
    private Integer demoCountNumber;
    private String vectorStatus; // Đã Đồng Bộ Vector (18ms)
    private Boolean isVectorSynced;
    private Integer vectorLatencyMs;
    private LocalDateTime lastVectorSyncAt;
    private String status; // Đang mở bán, Ngừng kinh doanh
    private boolean active; // dangHoatDong
    private Integer releaseYear;
    private String transmission;
    private Integer seats;
    private Integer tamHoatDongKm;
    private BigDecimal dungLuongPinKwh;
    private String thongSoKyThuat;
    private String imageUrl;
}
