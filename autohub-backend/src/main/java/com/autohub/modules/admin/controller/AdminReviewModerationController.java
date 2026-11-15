package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.DanhGia;
import com.autohub.core.accessory.repository.DanhGiaRepository;
import com.autohub.core.enums.TrangThaiDanhGia;
import com.autohub.modules.admin.dto.AdminReviewDto;
import com.autohub.modules.admin.dto.BatchApproveResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin/reviews")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReviewModerationController {

    private final DanhGiaRepository danhGiaRepository;

    private static final Pattern TOXIC_PATTERN = Pattern.compile(
            "(lừa đảo|tệ hại|đm|dkm|đmm|vớ vẩn|rác rưởi|gian lận|chó|cút|bịp|hàng đểu|fake|đồ đểu|hàng nhái|kém chất lượng|mất dạy|khốn nạn)",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE
    );

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminReviewDto>>> getAllReviews(
            @RequestParam(required = false) TrangThaiDanhGia status) {

        List<DanhGia> list;
        if (status != null) {
            list = danhGiaRepository.findByTrangThaiDuyet(status);
        } else {
            list = danhGiaRepository.findAllByOrderByNgayDanhGiaDesc();
        }

        List<AdminReviewDto> dtos = list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtos, "Tải danh sách đánh giá phụ kiện thành công"));
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<AdminReviewDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam TrangThaiDanhGia status) {

        DanhGia danhGia = danhGiaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đánh giá với ID: " + id));

        // Chống lặp lại trạng thái đích (tránh xử lý trùng 2 lần)
        if (danhGia.getTrangThaiDuyet() == status) {
            return ResponseEntity.badRequest().body(ApiResponse.error(
                    "Đánh giá #" + id + " hiện đã ở trạng thái " + status + ", không cần cập nhật lại!"
            ));
        }

        String comment = danhGia.getNoiDung() != null ? danhGia.getNoiDung() : "";
        if (status == TrangThaiDanhGia.APPROVED && TOXIC_PATTERN.matcher(comment).find()) {
            log.warn("[Review Moderation] Cảnh báo: Admin đã phê duyệt đánh giá nghi vấn vi phạm nội dung ID #{}", id);
        }

        danhGia.setTrangThaiDuyet(status);
        danhGiaRepository.save(danhGia);

        log.info("Admin updated review #{} status to {}", id, status);
        return ResponseEntity.ok(ApiResponse.ok(toDto(danhGia), "Cập nhật trạng thái đánh giá thành công"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        DanhGia danhGia = danhGiaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đánh giá với ID: " + id));

        danhGiaRepository.delete(danhGia);
        log.info("Admin deleted review #{}", id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Đã xóa đánh giá vi phạm thành công"));
    }

    @PostMapping("/batch-approve")
    @Transactional
    public ResponseEntity<ApiResponse<BatchApproveResponseDto>> batchApprove(
            @RequestBody(required = false) List<Long> reviewIds) {

        List<DanhGia> targets;
        if (reviewIds != null && !reviewIds.isEmpty()) {
            targets = danhGiaRepository.findAllById(reviewIds);
        } else {
            targets = danhGiaRepository.findByTrangThaiDuyet(TrangThaiDanhGia.PENDING);
        }

        int count = 0;
        for (DanhGia d : targets) {
            // Chỉ phê duyệt những đánh giá chưa APPROVED để tránh trùng lặp
            if (d.getTrangThaiDuyet() != TrangThaiDanhGia.APPROVED) {
                d.setTrangThaiDuyet(TrangThaiDanhGia.APPROVED);
                count++;
            }
        }
        if (count > 0) {
            danhGiaRepository.saveAll(targets);
        }

        log.info("Admin batch-approved {} reviews", count);
        return ResponseEntity.ok(ApiResponse.ok(
                new BatchApproveResponseDto(count),
                "Phê duyệt hàng loạt " + count + " đánh giá thành công"
        ));
    }

    private AdminReviewDto toDto(DanhGia d) {
        String comment = d.getNoiDung() != null ? d.getNoiDung() : "";
        boolean isToxic = TOXIC_PATTERN.matcher(comment).find();
        String moderationNote = isToxic ? "Cảnh báo: Phát hiện từ ngữ nghi vấn vi phạm tiêu chuẩn cộng đồng" : "Nội dung hợp lệ";

        Double avgRating = null;
        Integer reviewCount = null;
        if (d.getPhuKien() != null && d.getPhuKien().getId() != null) {
            List<DanhGia> approvedList = danhGiaRepository.findByPhuKienIdAndTrangThaiDuyet(d.getPhuKien().getId(), TrangThaiDanhGia.APPROVED);
            if (approvedList != null && !approvedList.isEmpty()) {
                reviewCount = approvedList.size();
                double avg = approvedList.stream().mapToInt(DanhGia::getSoSao).average().orElse(5.0);
                avgRating = Math.round(avg * 10.0) / 10.0;
            }
        }

        return AdminReviewDto.builder()
                .id(d.getId())
                .displayId("REV-" + (d.getId() != null ? d.getId() : "0"))
                .userId(d.getNguoiDung() != null ? d.getNguoiDung().getId() : null)
                .customer(d.getNguoiDung() != null ? d.getNguoiDung().getHoTen() : "Khách hàng ẩn danh")
                .accessoryId(d.getPhuKien() != null ? d.getPhuKien().getId() : null)
                .product(d.getPhuKien() != null ? d.getPhuKien().getTenPhuKien() : "Phụ kiện ô tô")
                .rating(d.getSoSao() != null ? d.getSoSao() : 5)
                .comment(comment)
                .imageUrl(d.getHinhAnhDanhGia())
                .submittedAt(d.getNgayDanhGia())
                .status(d.getTrangThaiDuyet())
                .flaggedToxic(isToxic)
                .moderationNote(moderationNote)
                .accessoryAverageRating(avgRating)
                .accessoryReviewCount(reviewCount)
                .build();
    }
}
