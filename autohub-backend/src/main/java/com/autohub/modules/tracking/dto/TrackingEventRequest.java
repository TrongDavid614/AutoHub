package com.autohub.modules.tracking.dto;

import com.autohub.core.enums.LoaiHanhViTracking;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TrackingEventRequest {
    private String maPhien;
    private Long nguoiDungId;

    @NotNull(message = "Loại hành vi không được để trống")
    private LoaiHanhViTracking loaiHanhVi;

    private String loaiThucThe; // CAR hoặc ACCESSORY
    private Long maThucThe;     // ID của xe hoặc phụ kiện
    private Integer thoiGianDungXem; // Số giây dwell time
    private String duLieuBoSung;     // JSON bổ sung
}
