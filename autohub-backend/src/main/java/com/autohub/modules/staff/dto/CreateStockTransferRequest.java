package com.autohub.modules.staff.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStockTransferRequest {
    private Long accessoryId;
    private String sku;
    private Long fromShowroomId;
    private String fromBranchName;

    @NotNull(message = "Số lượng điều chuyển không được để trống")
    @Min(value = 1, message = "Số lượng điều chuyển phải lớn hơn 0")
    private Integer quantity;

    private String reason;
}
