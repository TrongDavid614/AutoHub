package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCarMasterRequest {
    private Long brandId;
    private String brandName;
    private Long modelId;
    private String modelName;
    private String segment; // D-SUV, C-SUV, Sedan...
    private String origin; // Lắp ráp trong nước, Nhập khẩu
    private String versionName; // Plus AWD (402 HP)
    private Integer releaseYear;
    private String transmission;
    private String fuelType;
    private Integer seats;
    private BigDecimal price; // Giá niêm yết
    private BigDecimal deposit; // Mức cọc 72h: 10.000.000 hoặc 20.000.000
    private Integer tamHoatDongKm;
    private BigDecimal dungLuongPinKwh;
    private String specs; // JSON specs
    private String imageUrl;
    private Integer demoCount; // Số xe demo muốn khởi tạo
}
