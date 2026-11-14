package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminBankLoanDto {
    private Long id;
    private String bankName;
    private String bankCode;
    private String logoUrl;
    private Double firstYearRate;
    private Double floatingRate;
    private Integer maxTenorYears;
    private Integer maxLtvPercent;
    private String note;
    private boolean active;
}
