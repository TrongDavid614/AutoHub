package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.modules.admin.dto.*;
import com.autohub.modules.admin.service.AdminStaffScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin/staff-schedules")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStaffScheduleController {

    private final AdminStaffScheduleService adminStaffScheduleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminStaffScheduleDto>>> getSchedules(
            @RequestParam(required = false) Long showroomId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String shiftType,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String keyword
    ) {
        List<AdminStaffScheduleDto> list = adminStaffScheduleService.getSchedules(
                showroomId, startDate, endDate, shiftType, role, keyword
        );
        return ResponseEntity.ok(ApiResponse.ok(list, "Tải danh sách lịch trực nhân viên thành công"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StaffScheduleStatsDto>> getStats(
            @RequestParam(required = false) Long showroomId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        StaffScheduleStatsDto stats = adminStaffScheduleService.getStats(showroomId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(stats, "Tải thống kê lịch trực showroom thành công"));
    }

    @GetMapping("/staff-options")
    public ResponseEntity<ApiResponse<List<StaffMemberOptionDto>>> getStaffOptions(
            @RequestParam(required = false) Long showroomId
    ) {
        List<StaffMemberOptionDto> staffList = adminStaffScheduleService.getStaffOptions(showroomId);
        return ResponseEntity.ok(ApiResponse.ok(staffList, "Tải danh sách nhân sự thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminStaffScheduleDto>> createSchedule(
            @Valid @RequestBody CreateStaffScheduleRequest request
    ) {
        AdminStaffScheduleDto created = adminStaffScheduleService.createSchedule(request);
        return ResponseEntity.ok(ApiResponse.ok(created, "Phân công ca trực thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        adminStaffScheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa ca trực thành công"));
    }

    @PostMapping("/auto-schedule")
    public ResponseEntity<ApiResponse<AutoScheduleResultDto>> autoSchedule(
            @RequestBody(required = false) AutoScheduleRequest request
    ) {
        AutoScheduleRequest req = (request != null) ? request : new AutoScheduleRequest();
        AutoScheduleResultDto result = adminStaffScheduleService.autoSchedule(req);
        return ResponseEntity.ok(ApiResponse.ok(result, result.getMessage()));
    }

    @GetMapping("/swap-requests")
    public ResponseEntity<ApiResponse<List<ShiftSwapRequestDto>>> getSwapRequests() {
        List<ShiftSwapRequestDto> list = adminStaffScheduleService.getSwapRequests();
        return ResponseEntity.ok(ApiResponse.ok(list, "Tải danh sách yêu cầu đổi ca thành công"));
    }

    @PostMapping("/swap-requests")
    public ResponseEntity<ApiResponse<ShiftSwapRequestDto>> createSwapRequest(
            @Valid @RequestBody CreateSwapRequestDto request
    ) {
        ShiftSwapRequestDto created = adminStaffScheduleService.createSwapRequest(request);
        return ResponseEntity.ok(ApiResponse.ok(created, "Gửi yêu cầu đổi ca trực thành công"));
    }

    @PutMapping("/swap-requests/{id}/approve")
    public ResponseEntity<ApiResponse<ShiftSwapRequestDto>> approveSwapRequest(@PathVariable String id) {
        ShiftSwapRequestDto approved = adminStaffScheduleService.approveSwapRequest(id);
        return ResponseEntity.ok(ApiResponse.ok(approved, "Phê duyệt đổi ca thành công"));
    }

    @PutMapping("/swap-requests/{id}/reject")
    public ResponseEntity<ApiResponse<ShiftSwapRequestDto>> rejectSwapRequest(@PathVariable String id) {
        ShiftSwapRequestDto rejected = adminStaffScheduleService.rejectSwapRequest(id);
        return ResponseEntity.ok(ApiResponse.ok(rejected, "Từ chối yêu cầu đổi ca thành công"));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) Long showroomId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        byte[] csvData = adminStaffScheduleService.exportSchedulesCsv(showroomId, startDate, endDate);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"lich_truc_nhan_vien.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }
}

