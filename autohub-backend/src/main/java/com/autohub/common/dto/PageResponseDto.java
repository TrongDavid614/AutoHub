package com.autohub.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.Collections;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponseDto<T> {
    private List<T> items;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;

    public static <T> PageResponseDto<T> of(Page<T> springPage) {
        if (springPage == null) {
            return empty(0, 10);
        }
        return PageResponseDto.<T>builder()
                .items(springPage.getContent())
                .page(springPage.getNumber())
                .size(springPage.getSize())
                .totalElements(springPage.getTotalElements())
                .totalPages(springPage.getTotalPages())
                .first(springPage.isFirst())
                .last(springPage.isLast())
                .build();
    }

    public static <T, R> PageResponseDto<R> of(Page<T> springPage, List<R> mappedItems) {
        if (springPage == null) {
            return empty(0, 10);
        }
        return PageResponseDto.<R>builder()
                .items(mappedItems)
                .page(springPage.getNumber())
                .size(springPage.getSize())
                .totalElements(springPage.getTotalElements())
                .totalPages(springPage.getTotalPages())
                .first(springPage.isFirst())
                .last(springPage.isLast())
                .build();
    }

    public static <T> PageResponseDto<T> of(List<T> allItems, int page, int size) {
        if (allItems == null) {
            allItems = Collections.emptyList();
        }
        if (size <= 0) size = 10;
        if (page < 0) page = 0;

        int totalElements = allItems.size();
        int totalPages = totalElements == 0 ? 1 : (int) Math.ceil((double) totalElements / size);
        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);
        List<T> subList = allItems.subList(fromIndex, toIndex);

        return PageResponseDto.<T>builder()
                .items(subList)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .first(page == 0)
                .last(page >= totalPages - 1)
                .build();
    }

    public static <T> PageResponseDto<T> empty(int page, int size) {
        return PageResponseDto.<T>builder()
                .items(Collections.emptyList())
                .page(Math.max(page, 0))
                .size(size > 0 ? size : 10)
                .totalElements(0)
                .totalPages(1)
                .first(true)
                .last(true)
                .build();
    }
}
