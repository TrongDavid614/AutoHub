package com.autohub.modules.customer.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessoryDetailDto {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryBadge;
    private String name;
    private String sku;
    private String brand;
    private Long price;
    private Long discountPrice;

    @Builder.Default
    private Integer stockQuantity = 0;

    private String thumbnailUrl;

    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Builder.Default
    private List<String> galleryUrls = new ArrayList<>();

    private String description;
    private String installationGuide;

    @Builder.Default
    private Map<String, String> specifications = new LinkedHashMap<>();

    @Builder.Default
    private List<String> specPills = new ArrayList<>();

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private List<AccessoryCompatibilityDto> compatibilities = new ArrayList<>();

    @Builder.Default
    private List<AccessoryCompatibilityDto> compatibility = new ArrayList<>();

    @Builder.Default
    private List<AccessoryReviewDto> reviews = new ArrayList<>();

    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean readyInShowroom = true;

    @Builder.Default
    private Boolean homeInstallation = true;

    @Builder.Default
    private Boolean isGenuine = true;

    @Builder.Default
    private Integer warrantyYears = 2;

    @Builder.Default
    private Boolean dungChung = false;

    @Builder.Default
    private Boolean isUniversal = false;
}
