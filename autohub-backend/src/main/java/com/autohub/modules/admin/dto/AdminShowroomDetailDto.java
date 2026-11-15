package com.autohub.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminShowroomDetailDto {
    private AdminShowroomDto showroom;
    private List<DemoCarItemDto> demoCars;
    private List<InventoryItemDto> inventoryItems;
    private List<StaffItemDto> staffMembers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DemoCarItemDto {
        private Long id;
        private Long carVersionId;
        private String carModelName;
        private String carVersionName;
        private String licensePlate;
        private Integer currentOdo;
        private LocalDate lastMaintenanceDate;
        private LocalDate nextMaintenanceDate;
        private String status;
        private boolean active;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryItemDto {
        private Long id;
        private Long carVersionId;
        private String carModelName;
        private String carVersionName;
        private String colorName;
        private String colorHex;
        private Integer availableStock;
        private Integer reservedStock;
        private Integer totalStock;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StaffItemDto {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String role;
        private String status;
    }
}
