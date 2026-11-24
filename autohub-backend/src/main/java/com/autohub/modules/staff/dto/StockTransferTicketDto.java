package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransferTicketDto {
    private String id;
    private String transferCode;
    private Long accessoryId;
    private String sku;
    private String accessoryName;
    private Long fromShowroomId;
    private String fromShowroomName;
    private Long toShowroomId;
    private String toShowroomName;
    private Integer quantity;
    private String status;
    private String reason;
    private String createdBy;
    private String confirmedBy;
    private String createdAt;
    private String completedAt;
}
