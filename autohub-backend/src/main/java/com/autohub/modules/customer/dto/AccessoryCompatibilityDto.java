package com.autohub.modules.customer.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessoryCompatibilityDto {
    private Long carModelId;
    private String carModelName;
    @Builder.Default
    private Integer manufactureYearStart = 2022;
    @Builder.Default
    private Integer manufactureYearEnd = 2026;
    private String note;
}
