package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemoFleetCarDto {
    private String id;
    private String licensePlate;
    private String carModel;
    private String showroomName;
    private Integer currentOdo;
    private String status;
    private String lastMaintenanceDate;
    private String nextMaintenanceDate;
    private String maintenanceReason;
    private String expectedReturnDate;
    private List<DemoMaintenanceRecordDto> maintenanceHistory;
}

