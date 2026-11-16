package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStaffScheduleRequest {
    @NotNull(message = "Nhân viên trực không được để trống")
    private Long staffId;

    @NotNull(message = "Showroom không được để trống")
    private Long showroomId;

    @NotNull(message = "Ngày trực không được để trống")
    private LocalDate ngayTruc;

    @NotBlank(message = "Ca trực không được để trống")
    private String caTruc;

    private String ghiChu;
}

