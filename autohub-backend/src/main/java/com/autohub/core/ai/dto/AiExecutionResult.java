package com.autohub.core.ai.dto;

import com.autohub.core.ai.tools.InventoryCheckTool.InventoryStockDetail;
import com.autohub.core.ai.tools.RegistrationFeeCalculatorTool.RolloutCalculationResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiExecutionResult {

    private String aiAnswerText; // Fallback text hoặc bản tổng hợp
    private String retrievedContext; // Dữ liệu ngữ cảnh thật từ SQL Server để Gemini tổng hợp
    private String uiBlockType; // "CAR_CARD", "ROLLOUT_TABLE", "INVENTORY_CARD", "ACCESSORY_LIST", "DEPOSIT_POLICY", "NONE"
    private AiChatMessageDto.AiRecommendedVehicleDto recommendedVehicle;
    private AiChatMessageDto.AiRecommendedAccessoryDto recommendedAccessory;
    private RolloutCalculationResult rolloutFeeData;
    private List<InventoryStockDetail> inventoryData;
    private List<String> suggestedPrompts;
}
