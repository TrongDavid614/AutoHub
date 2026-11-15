package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStaffScheduleDto {
    private Long id;
    private Long staffId;
    private String staffName;
    private String staffCode;
    private String staffPhone;
    private String staffAvatar;
    private String role; // SUPERVISOR, SALES, TEST_DRIVE, WAREHOUSE
    private String roleLabel;
    private Long showroomId;
    private String showroomName;
    private LocalDate ngayTruc;
    private Integer dayOfWeek; // 0=Thứ 2, ..., 6=Chủ nhật
    private String dateString; // "27/10/2026"
    private String caTruc; // CA_SANG, CA_CHIEU, CA_HANH_CHINH, CA_TOI
    private String shiftType; // MORNING, AFTERNOON, FULL_DAY
    private String shiftHours; // "08:00 - 15:00"
    private String specificTask;
    private String status; // CONFIRMED, IN_PROGRESS, COMPLETED
    private LocalDateTime ngayTao;
}

