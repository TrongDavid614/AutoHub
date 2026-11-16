package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemoFleetCarDto {
    private String id;
    private String licensePlate;
    private String carModel;
    private Integer currentOdo;
    private String status;
    private String lastMaintenanceDate;
    private String nextMaintenanceDate;
}

