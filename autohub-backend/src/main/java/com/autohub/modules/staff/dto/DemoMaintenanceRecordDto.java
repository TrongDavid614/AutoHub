package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemoMaintenanceRecordDto {
    private String id;
    private String ticketCode;
    private String demoCarId;
    private String licensePlate;
    private String carModel;
    private String maintenanceItem;
    private Integer odoAtMaintenance;
    private String startDate;
    private String expectedReturnDate;
    private String actualReturnDate;
    private String status;
    private String notes;
    private String createdBy;
}
