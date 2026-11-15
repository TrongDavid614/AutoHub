package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.engagement.entity.NhatKyTuVan;
import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.engagement.repository.NhatKyTuVanRepository;
import com.autohub.core.engagement.repository.YeuCauTuVanRepository;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import com.autohub.core.enums.VaiTroNguoiDung;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.staff.dto.AddConsultationNoteRequest;
import com.autohub.modules.staff.dto.StaffConsultationDto;
import com.autohub.modules.staff.dto.UpdateConsultationStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/staff/consultations")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffConsultationController {

    private final YeuCauTuVanRepository consultationRepository;
    private final NhatKyTuVanRepository nhatKyTuVanRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffConsultationDto>>> getConsultations() {
        List<YeuCauTuVan> list = consultationRepository.findAll();
        List<StaffConsultationDto> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (YeuCauTuVan y : list) {
            List<String> history = new ArrayList<>();
            List<NhatKyTuVan> logs = nhatKyTuVanRepository.findByYeuCauTuVanId(y.getId());
            for (NhatKyTuVan l : logs) {
                if (l.getNoiDungTraoDoi() != null) {
                    history.add(l.getThoiGianTuongTac() != null ? l.getThoiGianTuongTac().format(fmt) + ": " + l.getNoiDungTraoDoi() : l.getNoiDungTraoDoi());
                }
            }
            if (history.isEmpty() && y.getGhiChuCSKH() != null && !y.getGhiChuCSKH().isBlank()) {
                history.addAll(Arrays.asList(y.getGhiChuCSKH().split("\\s*\\|\\s*")));
            }

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
                    .callHistory(history)
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
        y.setTrangThai(TrangThaiYeuCauTuVan.CONTACTED);
        consultationRepository.save(y);

        // Lưu vào bảng nhat_ky_tu_van (CRM Activity Timeline - UC20)
        NguoiDung staff = getAuthenticatedStaff().orElseGet(() -> nguoiDungRepository.findAll().stream()
                .filter(u -> u.getVaiTro() == VaiTroNguoiDung.ROLE_STAFF || u.getVaiTro() == VaiTroNguoiDung.ROLE_ADMIN)
                .findFirst().orElse(null));

        if (staff != null) {
            NhatKyTuVan logEntry = NhatKyTuVan.builder()
                    .yeuCauTuVan(y)
                    .nhanVien(staff)
                    .loaiTuongTac("CUOC_GOI")
                    .noiDungTraoDoi(note)
                    .thoiGianTuongTac(LocalDateTime.now())
                    .build();
            nhatKyTuVanRepository.save(logEntry);
        }

        return ResponseEntity.ok(ApiResponse.ok(y.getGhiChuCSKH(), "Lưu nhật ký tư vấn CRM thành công vào database"));
    }

    private Optional<NguoiDung> getAuthenticatedStaff() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getName() != null && !"anonymousUser".equals(auth.getName())) {
                return nguoiDungRepository.findByEmail(auth.getName());
            }
        } catch (Exception ignored) {}
        return Optional.empty();
    }
}
