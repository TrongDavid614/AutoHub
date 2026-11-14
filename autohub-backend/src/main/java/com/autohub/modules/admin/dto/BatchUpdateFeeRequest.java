package com.autohub.modules.admin.dto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchUpdateFeeRequest {
    @Valid
    private List<RegistrationFeeDto> provincialFees;

    @Valid
    private List<BankLoanPackageDto> bankLoans;
}
