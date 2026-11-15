package com.autohub.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemoCarOptionDto {
    private String id;
    private String bienSo;
    private String model;
    private String showroom;
    private String trangThai;
}

