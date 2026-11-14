package com.autohub.modules.tracking.dto;

import com.autohub.core.enums.LoaiHanhViTracking;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEventRequest {

    @Size(max = 100, message = "Mã phiên không được vượt quá 100 ký tự")
    private String maPhien;

    @NotNull(message = "Loại hành vi không được để trống")
    private LoaiHanhViTracking loaiHanhVi;

    @Size(max = 20, message = "Loại thực thể không được vượt quá 20 ký tự")
    private String loaiThucThe;

    private Long maThucThe;

    @Min(value = 0, message = "Thời gian dừng xem không được âm")
    @Max(value = 86400, message = "Thời gian dừng xem tối đa 24 giờ (86400 giây)")
    private Integer thoiGianDungXem;

    @Size(max = 4000, message = "Dữ liệu bổ sung không được vượt quá 4000 ký tự")
    private String duLieuBoSung;

    private Long nguoiDungId;
}
