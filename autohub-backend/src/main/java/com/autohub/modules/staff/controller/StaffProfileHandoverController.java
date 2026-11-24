package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.enums.VaiTroNguoiDung;
import com.autohub.core.showroom.entity.BienBanBanGiaoCa;
import com.autohub.core.showroom.entity.Showroom;
import com.autohub.core.showroom.repository.BienBanBanGiaoCaRepository;
import com.autohub.core.showroom.repository.ShowroomRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.staff.dto.ChangeStaffPasswordRequest;
import com.autohub.modules.staff.dto.CreateShiftHandoverRequest;
import com.autohub.modules.staff.dto.ShiftHandoverDto;
import com.autohub.modules.staff.dto.StaffColleagueDto;
import com.autohub.modules.staff.dto.StaffProfileDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/staff")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffProfileHandoverController {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATE_TIME_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final Pattern META_PATTERN = Pattern.compile("^\\[LEADS=(\\d+);KEYS=(true|false)]\\s*(.*)$", Pattern.DOTALL);

    private final NguoiDungRepository nguoiDungRepository;
    private final BienBanBanGiaoCaRepository handoverRepository;
    private final ShowroomRepository showroomRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<StaffProfileDto>> getMyProfile(Authentication authentication) {
        NguoiDung user = resolveCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy hồ sơ nhân sự đang đăng nhập"));
        }

        StaffProfileDto dto = StaffProfileDto.builder()
                .id(user.getId())
                .staffCode(formatStaffCode(user))
                .fullName(user.getHoTen())
                .role(user.getVaiTro() != null ? user.getVaiTro().name() : "ROLE_STAFF")
                .roleLabel(formatRoleLabel(user.getVaiTro()))
                .showroomId(user.getShowroom() != null ? user.getShowroom().getId() : null)
                .showroomName(user.getShowroom() != null ? user.getShowroom().getTenShowroom() : "AutoHub Showroom")
                .email(user.getEmail())
                .phone(user.getSoDienThoai() != null ? user.getSoDienThoai() : "-")
                .accountStatus(user.getTrangThaiTaiKhoan() != null ? user.getTrangThaiTaiKhoan().name() : "HOAT_DONG")
                .build();

        return ResponseEntity.ok(ApiResponse.ok(dto, "Lấy hồ sơ nhân sự thành công"));
    }

    @PutMapping("/profile/password")
    @Transactional
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangeStaffPasswordRequest payload,
            Authentication authentication
    ) {
        NguoiDung user = resolveCurrentUser(authentication);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy tài khoản nhân sự"));
        }
        if (!passwordEncoder.matches(payload.getCurrentPassword(), user.getMatKhauBam())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mật khẩu hiện tại không chính xác"));
        }

        user.setMatKhauBam(passwordEncoder.encode(payload.getNewPassword()));
        nguoiDungRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok("PASSWORD_UPDATED", "Đã cập nhật mật khẩu đăng nhập thành công"));
    }

    @GetMapping("/handovers/colleagues")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffColleagueDto>>> getColleagues(Authentication authentication) {
        NguoiDung currentUser = resolveCurrentUser(authentication);
        Long currentUserId = currentUser != null ? currentUser.getId() : -1L;
        Long currentShowroomId = (currentUser != null && currentUser.getShowroom() != null)
                ? currentUser.getShowroom().getId() : null;

        List<NguoiDung> staffList = nguoiDungRepository.findAll().stream()
                .filter(u -> !u.isDeleted())
                .filter(u -> u.getVaiTro() == VaiTroNguoiDung.ROLE_STAFF || u.getVaiTro() == VaiTroNguoiDung.ROLE_ADMIN)
                .filter(u -> !Objects.equals(u.getId(), currentUserId))
                .sorted(Comparator
                        .comparing((NguoiDung u) -> currentShowroomId != null
                                && u.getShowroom() != null
                                && currentShowroomId.equals(u.getShowroom().getId()) ? 0 : 1)
                        .thenComparing(NguoiDung::getId))
                .collect(Collectors.toList());

        List<StaffColleagueDto> result = staffList.stream()
                .map(u -> StaffColleagueDto.builder()
                        .id(u.getId())
                        .staffCode(formatStaffCode(u))
                        .fullName(u.getHoTen())
                        .roleLabel(formatRoleLabel(u.getVaiTro()))
                        .showroomName(u.getShowroom() != null ? u.getShowroom().getTenShowroom() : "AutoHub")
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách nhân sự tiếp nhận ca thành công"));
    }

    @GetMapping("/handovers")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<ShiftHandoverDto>>> getHandovers(Authentication authentication) {
        NguoiDung currentUser = resolveCurrentUser(authentication);
        List<BienBanBanGiaoCa> records;
        if (currentUser != null
                && currentUser.getVaiTro() == VaiTroNguoiDung.ROLE_STAFF
                && currentUser.getShowroom() != null) {
            records = handoverRepository.findByShowroomIdOrderByThoiGianBanGiaoDesc(currentUser.getShowroom().getId());
        } else {
            records = handoverRepository.findAllByOrderByThoiGianBanGiaoDesc();
        }

        List<ShiftHandoverDto> result = records.stream()
                .map(this::toHandoverDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy lịch sử biên bản bàn giao ca từ SQL Server thành công"));
    }

    @PostMapping("/handovers")
    @Transactional
    public ResponseEntity<ApiResponse<ShiftHandoverDto>> createHandover(
            @Valid @RequestBody CreateShiftHandoverRequest payload,
            Authentication authentication
    ) {
        NguoiDung giver = resolveCurrentUser(authentication);
        if (giver == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không xác định được nhân viên bàn giao ca"));
        }

        NguoiDung receiver = nguoiDungRepository.findById(payload.getReceiverId())
                .orElse(null);
        if (receiver == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy nhân viên tiếp nhận ca"));
        }
        if (Objects.equals(giver.getId(), receiver.getId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Người bàn giao và người tiếp nhận ca không được trùng nhau"));
        }

        Showroom showroom = giver.getShowroom();
        if (showroom == null) {
            showroom = receiver.getShowroom();
        }
        if (showroom == null) {
            showroom = showroomRepository.findAll().stream().findFirst().orElse(null);
        }
        if (showroom == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy showroom để ghi nhận biên bản"));
        }

        String shiftCode = normalizeShiftCode(payload.getShiftCode(), payload.getShiftType());
        int leads = payload.getPendingLeadsCount() != null ? Math.max(0, payload.getPendingLeadsCount()) : 0;
        boolean keysOk = payload.getDemoKeysVerified() == null || payload.getDemoKeysVerified();
        int orders = payload.getPackedOrdersHandedOver() != null ? Math.max(0, payload.getPackedOrdersHandedOver()) : 0;
        String cleanNote = payload.getNotes() != null ? payload.getNotes().trim() : "";
        String storedNote = "[LEADS=" + leads + ";KEYS=" + keysOk + "] " + cleanNote;

        String handoverCode = "BGC-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"))
                + "-" + String.format("%02d", new Random().nextInt(100));

        BienBanBanGiaoCa entity = BienBanBanGiaoCa.builder()
                .maBanGiao(handoverCode)
                .showroom(showroom)
                .nguoiBanGiao(giver)
                .nguoiNhanCa(receiver)
                .thoiGianBanGiao(LocalDateTime.now())
                .caBanGiao(shiftCode)
                .tienMatDauCa(BigDecimal.ZERO)
                .tienMatCuoiCa(BigDecimal.ZERO)
                .soHopDongPhatSinh(orders)
                .ghiChuCongViec(storedNote)
                .chuKyNguoiGiao("SIGNED_BY_" + formatStaffCode(giver))
                .build();

        BienBanBanGiaoCa saved = handoverRepository.save(entity);
        return ResponseEntity.ok(ApiResponse.ok(
                toHandoverDto(saved),
                "Đã ký điện tử và lưu biên bản bàn giao ca " + saved.getMaBanGiao() + " vào SQL Server"
        ));
    }

    private NguoiDung resolveCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            Optional<NguoiDung> found = nguoiDungRepository.findByEmail(authentication.getName());
            if (found.isPresent()) {
                return found.get();
            }
        }
        return nguoiDungRepository.findAll().stream()
                .filter(u -> !u.isDeleted() && u.getVaiTro() == VaiTroNguoiDung.ROLE_STAFF)
                .min(Comparator.comparing(NguoiDung::getId))
                .orElse(null);
    }

    private ShiftHandoverDto toHandoverDto(BienBanBanGiaoCa b) {
        int leads = 0;
        boolean keysVerified = true;
        String displayNotes = b.getGhiChuCongViec() != null ? b.getGhiChuCongViec() : "";

        Matcher m = META_PATTERN.matcher(displayNotes);
        if (m.matches()) {
            leads = Integer.parseInt(m.group(1));
            keysVerified = Boolean.parseBoolean(m.group(2));
            displayNotes = m.group(3);
        }

        return ShiftHandoverDto.builder()
                .id(b.getMaBanGiao() != null ? b.getMaBanGiao() : "BGC-" + b.getId())
                .handoverCode(b.getMaBanGiao())
                .shiftCode(b.getCaBanGiao())
                .shiftType(formatShiftDisplay(b.getCaBanGiao()))
                .date(b.getThoiGianBanGiao() != null ? b.getThoiGianBanGiao().format(DATE_FMT) : "-")
                .handedOverBy(formatPersonDisplay(b.getNguoiBanGiao()))
                .receivedBy(formatPersonDisplay(b.getNguoiNhanCa()))
                .pendingLeadsCount(leads)
                .demoKeysVerified(keysVerified)
                .packedOrdersHandedOver(b.getSoHopDongPhatSinh() != null ? b.getSoHopDongPhatSinh() : 0)
                .notes(displayNotes)
                .createdAt(b.getThoiGianBanGiao() != null ? b.getThoiGianBanGiao().format(DATE_TIME_FMT) : "-")
                .build();
    }

    private String formatPersonDisplay(NguoiDung u) {
        if (u == null) return "-";
        return u.getHoTen() + " (" + formatStaffCode(u) + ")";
    }

    private String formatStaffCode(NguoiDung u) {
        if (u == null || u.getId() == null) return "STF-000";
        return "STF-" + String.format("%03d", u.getId());
    }

    private String formatRoleLabel(VaiTroNguoiDung role) {
        if (role == null) return "Nhân Viên Showroom";
        return switch (role) {
            case ROLE_ADMIN -> "Quản Trị Viên Hệ Thống";
            case ROLE_STAFF -> "Chuyên Viên Vận Hành Showroom";
            default -> "Khách Hàng";
        };
    }

    private String normalizeShiftCode(String shiftCode, String shiftType) {
        if (shiftCode != null && List.of("CA_SANG", "CA_CHIEU", "CA_TOI", "CA_HANH_CHINH").contains(shiftCode)) {
            return shiftCode;
        }
        if (shiftType != null) {
            String lower = shiftType.toLowerCase(Locale.ROOT);
            if (lower.contains("sáng") && !lower.startsWith("ca chiều")) return "CA_SANG";
            if (lower.contains("chiều")) return "CA_CHIEU";
            if (lower.contains("tối")) return "CA_TOI";
            if (lower.contains("hành chính")) return "CA_HANH_CHINH";
        }
        return "CA_SANG";
    }

    private String formatShiftDisplay(String caBanGiao) {
        if (caBanGiao == null) return "Ca trực";
        return switch (caBanGiao) {
            case "CA_SANG" -> "Ca Sáng -> Ca Chiều";
            case "CA_CHIEU" -> "Ca Chiều -> Ca Tối / Sáng hôm sau";
            case "CA_TOI" -> "Ca Tối -> Ca Sáng hôm sau";
            case "CA_HANH_CHINH" -> "Ca Hành Chính";
            default -> caBanGiao;
        };
    }
}
