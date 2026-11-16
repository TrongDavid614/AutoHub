package com.autohub.core.ai.dto;

import java.math.BigDecimal;

public record AiRouteDecision(
    AiIntent intent,
    String targetVehicleName,
    String fuelType,
    String bodyType,
    Integer seats,
    BigDecimal budgetLimit,
    String province,
    String queryKeyword,
    String sortOrder, // "PRICE_DESC", "PRICE_ASC", "ACCELERATION_ASC", "DEFAULT"
    double confidenceScore,
    Long contextCarId
) {
    public AiRouteDecision(
        AiIntent intent,
        String targetVehicleName,
        String fuelType,
        String bodyType,
        Integer seats,
        BigDecimal budgetLimit,
        String province,
        String queryKeyword,
        String sortOrder,
        double confidenceScore
    ) {
        this(intent, targetVehicleName, fuelType, bodyType, seats, budgetLimit, province, queryKeyword, sortOrder, confidenceScore, null);
    }

    public AiRouteDecision withContext(String vehicleName, Long carId) {
        return new AiRouteDecision(
            this.intent,
            vehicleName != null && !vehicleName.isBlank() ? vehicleName : this.targetVehicleName,
            this.fuelType,
            this.bodyType,
            this.seats,
            this.budgetLimit,
            this.province,
            this.queryKeyword,
            this.sortOrder,
            this.confidenceScore,
            carId != null ? carId : this.contextCarId
        );
    }

    public enum AiIntent {
        CAR_CONSULTATION,         // Hỏi về dòng xe, so sánh, thông số kỹ thuật, giá xe
        ROLLOUT_FEE_CALCULATION,  // Hỏi chi phí lăn bánh, thuế trước bạ, phí ra biển số
        INVENTORY_SHOWROOM_CHECK, // Hỏi xe có sẵn giao, kho showroom, xe lái thử
        ACCESSORY_COMPATIBILITY,  // Hỏi đồ chơi xe, phụ kiện, trạm sạc
        DEPOSIT_POLICY_72H,       // Hỏi chính sách đặt cọc giữ xe 72h, quy chế hoàn tiền 100%
        BATTERY_WARRANTY_POLICY,  // Hỏi về pin xe điện, chính sách bảo hành pin 800V SiC, tuổi thọ pin
        GENERAL_CONVERSATION,     // Trò chuyện, bảo mật CSDL, quyền hạn của AI, hỏi đáp chung
        GENERAL_GREETING          // Chào hỏi mở đầu
    }
}
