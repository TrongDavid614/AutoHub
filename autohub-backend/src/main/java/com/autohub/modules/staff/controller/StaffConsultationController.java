package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import com.autohub.modules.staff.dto.AddConsultationNoteRequest;
import com.autohub.modules.staff.dto.StaffConsultationDto;
import com.autohub.modules.staff.dto.UpdateConsultationStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/staff/consultations")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffConsultationController {

    private final YeuCauTuVanRepository consultationRepository;

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
