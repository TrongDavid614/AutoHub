package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAccessoryRequest {

    private String name;
    private Long categoryId;
    private String brand;

    @DecimalMin(value = "0.0", inclusive = false, message = "Đơn giá bán phải lớn hơn 0")
    private BigDecimal price;

    @Min(value = 0, message = "Số lượng tồn kho không được âm")
    private Integer stock;

    private String installationSpec;
    private String imageUrl;
    private Boolean universal;
    private Boolean active;
}
