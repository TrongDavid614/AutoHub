package com.autohub.core.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatMessageDto {

    private String id;
    private String sender; // "AI" hoặc "USER"
    private String senderTitle; // "AutoHub AI Consultant"
    private String timestamp;
    private String avatarText;
    private String content;
    private AiFunctionCallNotificationDto functionCall;
    private String rationale;
    private String uiBlockType; // "CAR_CARD", "ROLLOUT_TABLE", "INVENTORY_CARD", "ACCESSORY_LIST", "DEPOSIT_POLICY", "NONE"
    private com.autohub.core.ai.tools.RegistrationFeeCalculatorTool.RolloutCalculationResult rolloutFeeData;
    private List<com.autohub.core.ai.tools.InventoryCheckTool.InventoryStockDetail> inventoryData;
    private AiRecommendedVehicleDto recommendedVehicle;
    private AiRecommendedAccessoryDto recommendedAccessory;
    private List<String> suggestedPrompts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiFunctionCallNotificationDto {
        private String querySegment;
        private String priceRange;
        private Double matchPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiRecommendedVehicleDto {
        private Long variantId;
        private Long modelId;
        private String name;
        private String badge;
        private String categoryBadge;
        private String availabilityBadge;
        private String flagshipLabel;
        private Long listedPrice;
        private String priceNote;
        private String imageUrl;
        private String acceleration0100;
        private Integer rangeKm;
        private String interior;
        private String seats;
        private String safetyRating;
        private String safetyOrg;
        private String deliveryTime;
        private Long depositAmount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiRecommendedAccessoryDto {
        private Long accessoryId;
        private Double matchPercentage;
        private String badgeTitle;
        private String name;
        private Long price;
        private String description;
        private List<String> benefits;
        private String sku;
        private String imageUrl;
    }
}
