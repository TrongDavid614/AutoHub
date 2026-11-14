package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccessoryRequest {
    private String tenPhuKien;
    private Long danhMucId;
    private String thuongHieu;

    @PositiveOrZero(message = "Giá bán phải lớn hơn hoặc bằng 0")
    private BigDecimal giaBan;

    @PositiveOrZero(message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    private Integer soLuongTon;

    private String quyCachLapDat;
    private String hinhAnh;
    private Boolean dungChung;
    private Boolean dangHoatDong;
}
