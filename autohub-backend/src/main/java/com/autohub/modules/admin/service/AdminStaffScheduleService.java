package com.autohub.modules.admin.service;

import com.autohub.modules.admin.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface AdminStaffScheduleService {
    List<AdminStaffScheduleDto> getSchedules(Long showroomId, LocalDate startDate, LocalDate endDate, String shiftType, String role, String keyword);
    StaffScheduleStatsDto getStats(Long showroomId, LocalDate startDate, LocalDate endDate);
    List<StaffMemberOptionDto> getStaffOptions(Long showroomId);
    AdminStaffScheduleDto createSchedule(CreateStaffScheduleRequest request);
    void deleteSchedule(Long id);
    AutoScheduleResultDto autoSchedule(AutoScheduleRequest request);
    List<ShiftSwapRequestDto> getSwapRequests();
    ShiftSwapRequestDto createSwapRequest(CreateSwapRequestDto request);
    ShiftSwapRequestDto approveSwapRequest(String id);
    ShiftSwapRequestDto rejectSwapRequest(String id);
    byte[] exportSchedulesCsv(Long showroomId, LocalDate startDate, LocalDate endDate);
}

