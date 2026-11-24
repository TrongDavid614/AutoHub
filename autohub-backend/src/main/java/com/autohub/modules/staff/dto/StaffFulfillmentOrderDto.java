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
public class StaffFulfillmentOrderDto {
    private String id;
    private String orderCode;
    private String customerName;
    private String customerPhone;
    private String shippingAddress;
    private String paymentMethod;
    private String orderDate;
    private Double totalAmount;
    private String status;
    private List<OrderItemDto> items;
    private String courier;
    private String trackingNumber;
}

