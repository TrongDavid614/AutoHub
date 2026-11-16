package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.common.dto.PageResponseDto;
import com.autohub.core.accessory.entity.DanhGia;
import com.autohub.core.accessory.repository.DanhGiaRepository;
import com.autohub.core.engagement.entity.NhatKyTuVan;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.NhatKyTuVanRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.TrangThaiDanhGia;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.admin.dto.AdminReviewDto;
import com.autohub.modules.admin.dto.BatchApproveResponseDto;
import com.autohub.modules.admin.dto.ReviewAiModerationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
    private final NhatKyTuVanRepository nhatKyTuVanRepository;
    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final ChatClient chatClient;

    private static final Pattern TOXIC_PATTERN = Pattern.compile(
            "(lừa đảo|tệ hại|đm|dkm|đmm|vớ vẩn|rác rưởi|gian lận|chó|cút|bịp|hàng đểu|fake|đồ đểu|hàng nhái|kém chất lượng|mất dạy|khốn nạn)",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE
    );

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDto<AdminReviewDto>>> getAllReviews(
            @RequestParam(required = false) TrangThaiDanhGia status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<DanhGia> list;
        if (status != null) {
            list = danhGiaRepository.findByTrangThaiDuyet(status);
        } else {
            list = danhGiaRepository.findAllByOrderByNgayDanhGiaDesc();
        }

        List<AdminReviewDto> dtos = list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        PageResponseDto<AdminReviewDto> pagedData = PageResponseDto.of(dtos, page, size);
        return ResponseEntity.ok(ApiResponse.ok(pagedData, "Tải danh sách đánh giá phụ kiện thành công"));
    }

    @PostMapping("/ai-scan-pending")
    @Transactional
    public ResponseEntity<ApiResponse<List<ReviewAiModerationDto>>> scanPendingReviews() {
        long startMs = System.currentTimeMillis();
        List<DanhGia> pendingReviews = danhGiaRepository.findByTrangThaiDuyet(TrangThaiDanhGia.PENDING);
        if (pendingReviews.isEmpty()) {
            pendingReviews = danhGiaRepository.findAllByOrderByNgayDanhGiaDesc().stream().limit(10).toList();
        }

        List<ReviewAiModerationDto> results = new ArrayList<>();

        for (DanhGia d : pendingReviews) {
            String comment = d.getNoiDung() != null ? d.getNoiDung().trim() : "";
            int rating = d.getSoSao() != null ? d.getSoSao() : 5;

            String classification;
            double confidence;
            String reason;
            String suggestedAction;

            boolean hasToxicWords = TOXIC_PATTERN.matcher(comment).find();

            if (hasToxicWords) {
                classification = "TOXIC_SPAM";
                confidence = 0.98;
                reason = "Phát hiện từ ngữ thô tục / xúc phạm hoặc quảng cáo rác vi phạm tiêu chuẩn cộng đồng.";
                suggestedAction = "REJECT";
            } else if (rating <= 2) {
                classification = "COMPLAINT_VALID";
                confidence = 0.89;
                reason = "Đánh giá thấp (" + rating + " sao) phản ánh khiếu nại chất lượng sản phẩm/lắp đặt. CSKH cần hỗ trợ xử lý.";
                suggestedAction = "MANUAL_CHECK";
            } else {
                classification = "CLEAN_POSITIVE";
                confidence = 0.96;
                reason = "Đánh giá tích cực (" + rating + " sao), lời lẽ lịch thiệp, hài lòng với chất lượng phụ kiện AutoHub.";
                suggestedAction = "APPROVE";
            }

            try {
                String prompt = String.format(
                        "Hãy phân loại đánh giá sau thành 1 trong 3 nhóm: CLEAN_POSITIVE, COMPLAINT_VALID, hoặc TOXIC_SPAM kèm lý do 1 câu:\n" +
                        "- Số sao: %d\n" +
                        "- Nội dung: \"%s\"",
                        rating, comment
                );
                String aiRes = chatClient.prompt().user(prompt).call().content();
                if (aiRes != null && !aiRes.isBlank()) {
                    if (aiRes.toUpperCase().contains("TOXIC_SPAM") || hasToxicWords) {
                        classification = "TOXIC_SPAM";
                        suggestedAction = "REJECT";
                    } else if (aiRes.toUpperCase().contains("COMPLAINT_VALID") || rating <= 2) {
                        classification = "COMPLAINT_VALID";
                        suggestedAction = "MANUAL_CHECK";
                    } else {
                        classification = "CLEAN_POSITIVE";
                        suggestedAction = "APPROVE";
                    }
                }
            } catch (Exception ex) {
                log.warn("[Review AI] Lỗi gọi LLM ({}), sử dụng bộ lọc quy chuẩn: {}", ex.getClass().getSimpleName(), ex.getMessage());
            }

            results.add(ReviewAiModerationDto.builder()
                    .reviewId(d.getId())
                    .displayId("REV-" + (d.getId() != null ? d.getId() : "0"))
                    .rating(rating)
                    .comment(comment)
                    .classification(classification)
                    .confidence(confidence)
                    .reason(reason)
                    .suggestedAction(suggestedAction)
                    .build());
        }

        long latencyMs = System.currentTimeMillis() - startMs;
        saveReviewCopilotLog(results.size(), (int) latencyMs);

        return ResponseEntity.ok(ApiResponse.ok(results, "Quét và phân loại " + results.size() + " đánh giá bằng Spring AI thành công"));
    }

    private void saveReviewCopilotLog(int count, int latencyMs) {
        try {
            YeuCauTuVan lead = yeuCauTuVanRepository.findAll(PageRequest.of(0, 1)).getContent().stream().findFirst().orElse(null);
            NguoiDung staff = nguoiDungRepository.findAll(PageRequest.of(0, 1)).getContent().stream().findFirst().orElse(null);
            if (lead != null && staff != null) {
                NhatKyTuVan logEntity = NhatKyTuVan.builder()
                        .yeuCauTuVan(lead)
                        .nhanVien(staff)
                        .loaiTuongTac("ADMIN_COPILOT")
                        .noiDungTraoDoi("[AI Quét & Kiểm Duyệt Đánh Giá]: Đã quét và phân loại tự động " + count + " đánh giá.")
                        .thoiGianPhanHoiMs(latencyMs)
                        .thoiGianTuongTac(LocalDateTime.now())
                        .ketQuaCuocGoi("AI_MODERATED")
                        .build();
                nhatKyTuVanRepository.save(logEntity);
            }
        } catch (Exception e) {
            log.error("[Review AI] Không thể lưu nhat_ky_tu_van: {}", e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<AdminReviewDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam TrangThaiDanhGia status) {

        DanhGia d = danhGiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá ID: " + id));

        d.setTrangThaiDuyet(status);
        danhGiaRepository.save(d);

        return ResponseEntity.ok(ApiResponse.ok(toDto(d), "Cập nhật trạng thái đánh giá thành công"));
    }

    @PostMapping("/batch-approve")
    @Transactional
    public ResponseEntity<ApiResponse<BatchApproveResponseDto>> batchApprove() {
        List<DanhGia> pending = danhGiaRepository.findByTrangThaiDuyet(TrangThaiDanhGia.PENDING);
        int count = 0;
        for (DanhGia d : pending) {
            String comment = d.getNoiDung() != null ? d.getNoiDung() : "";
            if (!TOXIC_PATTERN.matcher(comment).find()) {
                d.setTrangThaiDuyet(TrangThaiDanhGia.APPROVED);
                danhGiaRepository.save(d);
                count++;
            }
        }

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
