package com.autohub.integration.sepay.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SepayWebhookRequest {
    private Long id;
    private String gateway;
    
    @JsonProperty("transactionDate")
    private String transactionDate;
    
    @JsonProperty("accountNumber")
    private String accountNumber;
    
    private String subAccount;
    
    @JsonProperty("transferType")
    private String transferType;
    
    @JsonProperty("transferAmount")
    private BigDecimal transferAmount;
    
    @JsonProperty("accumulated")
    private BigDecimal accumulated;
    
    private String code;
    
    private String content; // Nội dung chuyển khoản chứa mã đơn hoặc mã cọc (#DEP-...)
    
    private String referenceCode;
    
    private String description;
}
