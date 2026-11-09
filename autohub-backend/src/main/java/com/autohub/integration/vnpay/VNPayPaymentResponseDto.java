package com.autohub.integration.vnpay;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VNPayPaymentResponseDto {
    private String paymentUrl;
    private String txnRef;
    private BigDecimal amount;
    private String orderInfo;
    private Integer expiresInMinutes;
}

