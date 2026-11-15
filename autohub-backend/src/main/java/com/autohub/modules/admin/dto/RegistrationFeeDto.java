package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationFeeDto {
    private Long id;
    private Long tinhThanhId;
    private String tenTinhThanh;
    private String phanVungBienSo;
    private Double tyLePhiTruocBa; // (%)
    private BigDecimal phiCapBienSo;
    private BigDecimal phiDangKiem;
    private BigDecimal phiBaoTriDuongBo;
    private BigDecimal phiBaoHiemTnds;
    private LocalDate ngayApDung;
    private LocalDate ngayHetHieuLuc;
}
