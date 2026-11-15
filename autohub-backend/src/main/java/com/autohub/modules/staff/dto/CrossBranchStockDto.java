package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrossBranchStockDto {
    private String sku;
    private String name;
    private String category;
    private String shelfLocation;
    private Integer localStock;
    private List<BranchStockDto> branches;
}

