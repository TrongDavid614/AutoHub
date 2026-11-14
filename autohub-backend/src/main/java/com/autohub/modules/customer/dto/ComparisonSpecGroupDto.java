package com.autohub.modules.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonSpecGroupDto {
    private String id;
    private String sectionNumber;
    private String title;
    private List<ComparisonSpecRowDto> rows;
}
