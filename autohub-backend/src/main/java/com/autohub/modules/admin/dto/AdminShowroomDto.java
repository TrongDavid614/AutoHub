package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminShowroomDto {
    private Long id;
    private String code;
    private String name;
    private Long provinceId;
    private String provinceName;
    private String region;
    private String address;
    private String hotline;
    private LocalTime openTime;
    private LocalTime closeTime;
    private boolean active;
    private int staffCount;
    private int demoFleet;
    private int demoFleetReady;
    private int inventoryPhysical;
    private int inventoryReserved;
}
