package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffTestDriveDto {
    private String id;
    private String bookingCode;
    private String customerName;
    private String phone;
    private String carModel;
    private String scheduledTime;
    private String pickupLocation;
    private boolean licenseVerified;
    private String status;
    private String assignedDemoPlate;
    private String notes;
}

