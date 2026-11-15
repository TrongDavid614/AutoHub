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
public class StaffConsultationDto {
    private String id;
    private String customerName;
    private String phone;
    private String email;
    private String interestedCar;
    private String preferredTime;
    private String notes;
    private String receivedAt;
    private String status;
    private List<String> callHistory;
}

