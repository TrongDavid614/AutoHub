package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccessoryRequest {
    @NotBlank(message = "Tên phụ kiện không được để trống")
    private String tenPhuKien;

    @NotNull(message = "Vui lòng chọn danh mục")
    private Long danhMucId;

    private String thuongHieu;

    @NotNull(message = "Giá bán không được để trống")
    @PositiveOrZero(message = "Giá bán phải lớn hơn hoặc bằng 0")
    private BigDecimal giaBan;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @PositiveOrZero(message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    private Integer soLuongTon;

    private String quyCachLapDat;
    private String hinhAnh;
    private Boolean dungChung;
}
