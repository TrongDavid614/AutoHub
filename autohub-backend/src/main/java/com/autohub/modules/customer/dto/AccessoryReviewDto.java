package com.autohub.modules.customer.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessoryReviewDto {
    private Long id;
    private String userName;
    private String userAvatar;
    private Integer rating;
    private String comment;
    private String createdAt;
}
