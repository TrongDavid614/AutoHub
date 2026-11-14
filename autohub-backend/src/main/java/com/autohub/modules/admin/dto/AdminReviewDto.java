package com.autohub.modules.admin.dto;

import com.autohub.core.enums.TrangThaiDanhGia;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminReviewDto {
    private Long id;
    private String displayId;
    private Long userId;
    private String customer;
    private Long accessoryId;
    private String product;
    private Integer rating;
    private String comment;
    private String imageUrl;
    private LocalDateTime submittedAt;
    private TrangThaiDanhGia status;
    private boolean flaggedToxic;
    private String moderationNote;
}
