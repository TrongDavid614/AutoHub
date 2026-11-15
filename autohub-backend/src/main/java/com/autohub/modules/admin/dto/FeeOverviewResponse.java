package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeeOverviewResponse {
    private List<RegistrationFeeDto> provincialFees;
    private List<BankLoanPackageDto> bankLoans;
}
