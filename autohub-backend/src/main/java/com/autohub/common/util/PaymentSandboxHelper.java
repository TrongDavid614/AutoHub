package com.autohub.common.util;

import java.math.BigDecimal;

/**
 * Tiện ích quy đổi số tiền thanh toán trong chế độ Sandbox Test Mode:
 * - Cọc xe: 20.000.000 ₫ -> 4.000 ₫ ; 10.000.000 ₫ -> 2.000 ₫ (chia 5000, làm tròn chẵn nghìn [2.000 - 10.000])
 * - Phụ kiện: scale theo bậc 500.000 ₫ để nằm trong khoảng [2.000 ₫ - 10.000 ₫]
 */
public final class PaymentSandboxHelper {

    private PaymentSandboxHelper() {}

    public static long calculateSandboxTestAmount(BigDecimal originalAmount, boolean isDeposit) {
        if (originalAmount == null || originalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return 2000L;
        }
        long raw = originalAmount.longValue();
        if (isDeposit) {
            // Cọc xe: 20.000.000 -> 4.000; 10.000.000 -> 2.000
            long reduced = raw / 5000;
            long rounded = Math.round(reduced / 1000.0) * 1000;
            return Math.min(10000L, Math.max(2000L, rounded));
        } else {
            // Đơn hàng phụ kiện: map vào [2000, 10000] theo từng nấc 500k
            long step = (raw / 500000) * 1000;
            long result = 2000L + step;
            return Math.min(10000L, Math.max(2000L, result));
        }
    }
}
