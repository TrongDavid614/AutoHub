package com.autohub.modules.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRegistrationFeeRequest {

    @NotNull(message = "Tỷ lệ phí trước bạ không được để trống")
    @DecimalMin(value = "0.0", message = "Tỷ lệ phí trước bạ không được âm")
    private Double tyLePhiTruocBa;

    @NotNull(message = "Phí cấp biển số không được để trống")
    @DecimalMin(value = "0", message = "Phí cấp biển số không được âm")
    private BigDecimal phiCapBienSo;

    @NotNull(message = "Phí đăng kiểm không được để trống")
    @DecimalMin(value = "0", message = "Phí đăng kiểm không được âm")
    private BigDecimal phiDangKiem;

    @NotNull(message = "Phí bảo trì đường bộ không được để trống")
    @DecimalMin(value = "0", message = "Phí bảo trì đường bộ không được âm")
    private BigDecimal phiBaoTriDuongBo;

    @NotNull(message = "Phí bảo hiểm TNDS không được để trống")
    @DecimalMin(value = "0", message = "Phí bảo hiểm TNDS không được âm")
    private BigDecimal phiBaoHiemTnds;
}
