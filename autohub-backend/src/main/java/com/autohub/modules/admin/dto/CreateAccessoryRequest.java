package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAccessoryRequest {

    @NotBlank(message = "Tên phụ kiện không được để trống")
    private String name;

    @NotNull(message = "Danh mục phụ kiện là bắt buộc")
    private Long categoryId;

    private String brand;

    @NotNull(message = "Đơn giá bán là bắt buộc")
    @DecimalMin(value = "0.0", inclusive = false, message = "Đơn giá bán phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Số lượng tồn kho là bắt buộc")
    @Min(value = 0, message = "Số lượng tồn kho không được âm")
    private Integer stock;

    private String installationSpec;
    private String imageUrl;
    private Boolean universal;
}
