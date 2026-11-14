package com.autohub.modules.tracking.dto;

import com.autohub.core.enums.LoaiHanhViTracking;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEventRequest {
    private String maPhien;

    @NotNull(message = "Loại hành vi không được để trống")
    private LoaiHanhViTracking loaiHanhVi;

    private String loaiThucThe;
    private Long maThucThe;
    private Integer thoiGianDungXem;
    private String duLieuBoSung;
    private Long nguoiDungId;
}
