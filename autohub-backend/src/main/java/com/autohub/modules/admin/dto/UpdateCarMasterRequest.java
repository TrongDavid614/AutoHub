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
public class UpdateCarMasterRequest {
    private String modelName;
    private String segment;
    private String versionName;
    private Integer releaseYear;
    private String transmission;
    private String fuelType;
    private Integer seats;
    private BigDecimal price;
    private BigDecimal deposit;
    private Integer tamHoatDongKm;
    private BigDecimal dungLuongPinKwh;
    private String specs;
    private Boolean active;
    private String imageUrl;
}
