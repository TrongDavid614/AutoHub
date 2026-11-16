package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.engagement.entity.NhatKyTuVan;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.NhatKyTuVanRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import com.autohub.core.showroom.repository.TonKhoXeRepository;
import com.autohub.core.showroom.repository.XeDemoRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.staff.dto.AddConsultationNoteRequest;
import com.autohub.modules.staff.dto.StaffAiReplySuggestionDto;
import com.autohub.modules.staff.dto.StaffConsultationDto;
import com.autohub.modules.staff.dto.UpdateConsultationStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/staff/consultations")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffConsultationController {

    private final YeuCauTuVanRepository consultationRepository;
    private final TonKhoXeRepository tonKhoXeRepository;
    private final XeDemoRepository xeDemoRepository;
    private final NhatKyTuVanRepository nhatKyTuVanRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final ChatClient chatClient;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffConsultationDto>>> getConsultations() {
        List<YeuCauTuVan> list = consultationRepository.findAll();
        List<StaffConsultationDto> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (YeuCauTuVan y : list) {
            StaffConsultationDto dto = StaffConsultationDto.builder()
                    .id(String.valueOf(y.getId()))
                    .customerName(y.getHoTen() != null ? y.getHoTen() : "-")
                    .phone(y.getSoDienThoai() != null ? y.getSoDienThoai() : "")
                    .email(y.getEmail() != null ? y.getEmail() : "")
                    .interestedCar(y.getPhienBanXe() != null ? y.getPhienBanXe().getTenPhienBan() : "Chưa chọn dòng xe")
                    .preferredTime(y.getKhungGioTiepNhan() != null ? y.getKhungGioTiepNhan() : "-")
                    .notes(y.getNoiDungCanTuVan() != null ? y.getNoiDungCanTuVan() : "")
                    .receivedAt(y.getNgayGui() != null ? y.getNgayGui().format(fmt) : "-")
                    .status(y.getTrangThai() != null ? y.getTrangThai().name() : "PENDING")
                    .callHistory(y.getGhiChuCSKH() != null ? List.of(y.getGhiChuCSKH()) : List.of())
                    .build();
            result.add(dto);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách yêu cầu tư vấn thành công từ database"));
    }

    @PostMapping("/{id}/ai-suggest-reply")
    @Transactional
    public ResponseEntity<ApiResponse<StaffAiReplySuggestionDto>> getAiReplySuggestion(@PathVariable Long id) {
        long startMs = System.currentTimeMillis();
        YeuCauTuVan y = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn ID: " + id));

        String customerName = y.getHoTen() != null ? y.getHoTen() : "Quý khách";
        String interestedCar = y.getPhienBanXe() != null ? y.getPhienBanXe().getTenPhienBan() : "Dòng xe AutoHub";
        String customerNotes = y.getNoiDungCanTuVan() != null ? y.getNoiDungCanTuVan() : "";
        String preferredTime = y.getKhungGioTiepNhan() != null ? y.getKhungGioTiepNhan() : "Giờ hành chính";

        // Tra cứu tồn kho & xe lái thử thực tế từ SQL Server
        String stockNote = "Xe đang chờ xuất xưởng từ nhà máy. Khách có thể đặt cọc giữ chỗ 72h để ưu tiên nhận xe sớm.";
        if (y.getPhienBanXe() != null) {
            Long variantId = y.getPhienBanXe().getId();
            var stocks = tonKhoXeRepository.findAll().stream()
                    .filter(t -> t.getPhienBanXe() != null && t.getPhienBanXe().getId().equals(variantId))
                    .toList();
            int totalAvailable = stocks.stream().mapToInt(t -> t.getSoLuongKhaDung() != null ? t.getSoLuongKhaDung() : 0).sum();
            var demos = xeDemoRepository.findByPhienBanXeId(variantId);
            long activeDemos = demos.stream().filter(d -> d.isDangHoatDong()).count();

            if (totalAvailable > 0 || activeDemos > 0) {
                stockNote = String.format("Kho hiện có %d xe sẵn sàng giao ngay. Có %d xe Demo phục vụ lái thử trải nghiệm.", totalAvailable, activeDemos);
            }
        }

        String suggestedReply;
        try {
            String prompt = String.format(
                    "Hãy đóng vai Chuyên viên Tư vấn AutoHub soạn một tin nhắn phản hồi ngắn gọn (3-4 câu), lịch thiệp và chuẩn mực gửi tới khách hàng:\n" +
                    "- Tên khách: %s\n" +
                    "- Mẫu xe quan tâm: %s\n" +
                    "- Khung giờ khách tiện nhận cuộc gọi: %s\n" +
                    "- Nhu cầu/ghi chú của khách: %s\n" +
                    "- Tình trạng xe thực tế tại Showroom: %s\n\n" +
                    "Yêu cầu kịch bản: Chào đúng tên khách hàng, xác nhận quan tâm mẫu xe, chia sẻ nhanh tình trạng xe có sẵn/xe lái thử, và đề xuất thời gian tư vấn hoặc hẹn trải nghiệm.",
                    customerName, interestedCar, preferredTime, customerNotes, stockNote
            );

            suggestedReply = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            if (suggestedReply == null || suggestedReply.isBlank()) {
                suggestedReply = generateFallbackStaffReply(customerName, interestedCar, preferredTime, stockNote);
            }
        } catch (Exception ex) {
            log.warn("[Staff AI] Lỗi khi gọi LLM ({}), kích hoạt Fallback: {}", ex.getClass().getSimpleName(), ex.getMessage());
            suggestedReply = generateFallbackStaffReply(customerName, interestedCar, preferredTime, stockNote);
        }

        long latencyMs = System.currentTimeMillis() - startMs;

        // Lưu telemetry vào dbo.nhat_ky_tu_van
        saveStaffAiLog(y, suggestedReply, stockNote, (int) latencyMs);

        StaffAiReplySuggestionDto res = StaffAiReplySuggestionDto.builder()
                .consultationId(y.getId())
                .customerName(customerName)
                .interestedCar(interestedCar)
                .suggestedReply(suggestedReply)
                .stockNote(stockNote)
                .latencyMs((int) latencyMs)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(res, "Gợi ý kịch bản phản hồi thành công"));
    }

    private String generateFallbackStaffReply(String customerName, String interestedCar, String preferredTime, String stockNote) {
        return String.format(
                "Kính chào quý khách %s, em là nhân viên tư vấn tại AutoHub. Em đã tiếp nhận yêu cầu tìm hiểu mẫu xe %s của quý khách. %s Em xin phép liên hệ trao đổi chi tiết trong khung giờ %s hoặc hỗ trợ quý khách đăng ký lịch hẹn lái thử trải nghiệm thực tế.",
                customerName, interestedCar, stockNote, preferredTime
        );
    }

    private void saveStaffAiLog(YeuCauTuVan lead, String suggestedReply, String stockNote, int latencyMs) {
        try {
            NguoiDung staff = lead.getNhanVien() != null ? lead.getNhanVien()
                    : nguoiDungRepository.findAll(PageRequest.of(0, 1)).getContent().stream().findFirst().orElse(null);

            if (staff != null) {
                String logContent = "[AI GỢI Ý KỊCH BẢN PHẢN HỒI]\n" + suggestedReply + "\n[Tồn kho Showroom]: " + stockNote;
                if (logContent.length() > 4000) {
                    logContent = logContent.substring(0, 3990) + "...";
                }

                NhatKyTuVan logEntity = NhatKyTuVan.builder()
                        .yeuCauTuVan(lead)
                        .nhanVien(staff)
                        .loaiTuongTac("STAFF_ASSIST")
                        .noiDungTraoDoi(logContent)
                        .thoiGianPhanHoiMs(latencyMs)
                        .thoiGianTuongTac(LocalDateTime.now())
                        .ketQuaCuocGoi("AI_SUGGESTED")
                        .build();

                nhatKyTuVanRepository.save(logEntity);
                log.info("[Staff AI] Đã ghi nhận nhật ký tư vấn ID: {} ({}ms)", logEntity.getId(), latencyMs);
            }
        } catch (Exception e) {
            log.error("[Staff AI] Không thể lưu nhat_ky_tu_van: {}", e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateConsultationStatusRequest payload
    ) {
        String newStatus = payload.getStatus();
        YeuCauTuVan y = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn ID: " + id));

        try {
            y.setTrangThai(TrangThaiYeuCauTuVan.valueOf(newStatus));
            consultationRepository.save(y);
            return ResponseEntity.ok(ApiResponse.ok(newStatus, "Cập nhật trạng thái tư vấn thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Trạng thái không hợp lệ: " + newStatus));
        }
    }

    @PostMapping("/{id}/notes")
    @Transactional
    public ResponseEntity<ApiResponse<String>> addNote(
            @PathVariable Long id,
            @Valid @RequestBody AddConsultationNoteRequest payload
    ) {
        String note = payload.getNote();
        YeuCauTuVan y = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu tư vấn ID: " + id));

        String currentNotes = y.getGhiChuCSKH();
        y.setGhiChuCSKH(currentNotes != null && !currentNotes.isBlank() ? currentNotes + " | " + note : note);
        consultationRepository.save(y);

        return ResponseEntity.ok(ApiResponse.ok(y.getGhiChuCSKH(), "Lưu nhật ký tư vấn CRM thành công vào database"));
    }
}
