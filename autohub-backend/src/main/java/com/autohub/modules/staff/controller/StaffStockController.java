package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.core.showroom.entity.PhieuDieuChuyenPhuKien;
import com.autohub.core.showroom.entity.Showroom;
import com.autohub.core.showroom.entity.TonKhoPhuKienShowroom;
import com.autohub.core.showroom.repository.PhieuDieuChuyenPhuKienRepository;
import com.autohub.core.showroom.repository.ShowroomRepository;
import com.autohub.core.showroom.repository.TonKhoPhuKienShowroomRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.staff.dto.BranchStockDto;
import com.autohub.modules.staff.dto.CreateStockTransferRequest;
import com.autohub.modules.staff.dto.CrossBranchStockDto;
import com.autohub.modules.staff.dto.StockTransferTicketDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/staff/stocks")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffStockController {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final PhuKienRepository phuKienRepository;
    private final ShowroomRepository showroomRepository;
    private final TonKhoPhuKienShowroomRepository tonKhoPhuKienShowroomRepository;
    private final PhieuDieuChuyenPhuKienRepository phieuDieuChuyenPhuKienRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<CrossBranchStockDto>>> getCrossBranchStocks(Authentication authentication) {
        List<Showroom> activeShowrooms = showroomRepository.findAll().stream()
                .filter(Showroom::isDangHoatDong)
                .sorted(Comparator.comparing(Showroom::getId))
                .collect(Collectors.toList());

        Showroom currentShowroom = resolveCurrentShowroom(authentication, activeShowrooms);
        List<PhuKien> accessories = phuKienRepository.findAll().stream()
                .sorted(Comparator.comparing(PhuKien::getId))
                .collect(Collectors.toList());

        List<TonKhoPhuKienShowroom> allStocks;
        try {
            allStocks = tonKhoPhuKienShowroomRepository.findAll();
        } catch (Exception ex) {
            allStocks = List.of();
        }
        Map<String, TonKhoPhuKienShowroom> stockMap = new HashMap<>();
        for (TonKhoPhuKienShowroom tk : allStocks) {
            if (tk.getPhuKien() != null && tk.getShowroom() != null) {
                stockMap.put(tk.getPhuKien().getId() + "_" + tk.getShowroom().getId(), tk);
            }
        }

        List<CrossBranchStockDto> result = new ArrayList<>();
        for (PhuKien p : accessories) {
            Long pkId = p.getId();
            TonKhoPhuKienShowroom localRow = currentShowroom != null
                    ? stockMap.get(pkId + "_" + currentShowroom.getId())
                    : null;

            String sku = (localRow != null && localRow.getMaSku() != null && !localRow.getMaSku().isBlank())
                    ? localRow.getMaSku()
                    : formatDefaultSku(pkId);
            String shelfLocation = (localRow != null && localRow.getViTriKe() != null && !localRow.getViTriKe().isBlank())
                    ? localRow.getViTriKe()
                    : (p.getQuyCachLapDat() != null && !p.getQuyCachLapDat().isBlank()
                            ? p.getQuyCachLapDat()
                            : "Kho phụ kiện");
            int localStock = localRow != null && localRow.getSoLuongTon() != null
                    ? localRow.getSoLuongTon()
                    : (allStocks.isEmpty() && p.getSoLuongTon() != null ? p.getSoLuongTon() : 0);

            List<BranchStockDto> branches = new ArrayList<>();
            for (Showroom sr : activeShowrooms) {
                if (currentShowroom != null && Objects.equals(sr.getId(), currentShowroom.getId())) {
                    continue;
                }
                TonKhoPhuKienShowroom branchRow = stockMap.get(pkId + "_" + sr.getId());
                int branchQty = branchRow != null && branchRow.getSoLuongTon() != null ? branchRow.getSoLuongTon() : 0;
                branches.add(BranchStockDto.builder()
                        .showroomId(sr.getId())
                        .branchName(sr.getTenShowroom())
                        .stock(branchQty)
                        .build());
            }

            result.add(CrossBranchStockDto.builder()
                    .accessoryId(pkId)
                    .sku(sku)
                    .name(p.getTenPhuKien())
                    .category(p.getDanhMucPhuKien() != null ? p.getDanhMucPhuKien().getTenDanhMuc() : "Phụ kiện ô tô")
                    .shelfLocation(shelfLocation)
                    .currentShowroomId(currentShowroom != null ? currentShowroom.getId() : null)
                    .currentShowroomName(currentShowroom != null ? currentShowroom.getTenShowroom() : "Kho trung tâm")
                    .localStock(localStock)
                    .branches(branches)
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tồn kho phụ kiện thực tế từ SQL Server thành công"));
    }

    @GetMapping("/transfers")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StockTransferTicketDto>>> getTransferTickets() {
        List<PhieuDieuChuyenPhuKien> tickets;
        try {
            tickets = phieuDieuChuyenPhuKienRepository.findAllByOrderByNgayTaoDesc();
        } catch (Exception ex) {
            tickets = List.of();
        }
        List<StockTransferTicketDto> result = tickets.stream()
                .map(this::toTicketDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phiếu điều chuyển kho phụ kiện thành công"));
    }

    @PostMapping("/transfers")
    @Transactional
    public ResponseEntity<ApiResponse<StockTransferTicketDto>> createTransferTicket(
            @Valid @RequestBody CreateStockTransferRequest payload,
            Authentication authentication
    ) {
        NguoiDung staff = resolveCurrentUser(authentication);
        if (staff == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không xác định được tài khoản nhân viên đang đăng nhập"));
        }

        List<Showroom> activeShowrooms = showroomRepository.findAll().stream()
                .filter(Showroom::isDangHoatDong)
                .sorted(Comparator.comparing(Showroom::getId))
                .collect(Collectors.toList());
        Showroom toShowroom = resolveCurrentShowroom(authentication, activeShowrooms);
        if (toShowroom == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không xác định được showroom nhận hàng"));
        }

        Showroom fromShowroom = resolveSourceShowroom(payload, activeShowrooms);
        if (fromShowroom == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy showroom nguồn điều chuyển"));
        }
        if (Objects.equals(fromShowroom.getId(), toShowroom.getId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Showroom xuất và showroom nhập không được trùng nhau"));
        }

        PhuKien phuKien = resolveAccessory(payload);
        if (phuKien == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy phụ kiện cần điều chuyển"));
        }

        TonKhoPhuKienShowroom sourceStock = tonKhoPhuKienShowroomRepository
                .findByPhuKienIdAndShowroomId(phuKien.getId(), fromShowroom.getId())
                .orElse(null);

        int available = sourceStock != null && sourceStock.getSoLuongTon() != null ? sourceStock.getSoLuongTon() : 0;
        if (available < payload.getQuantity()) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Số lượng chuyển (" + payload.getQuantity() + ") vượt quá tồn khả dụng (" + available + ") tại " + fromShowroom.getTenShowroom())
            );
        }

        // Deduct from source showroom atomically when creating ticket (optimistic locked via @Version)
        sourceStock.setSoLuongTon(available - payload.getQuantity());
        sourceStock.setUpdatedAt(LocalDateTime.now());
        tonKhoPhuKienShowroomRepository.save(sourceStock);

        String transferCode = "CK-PK-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"))
                + "-" + String.format("%02d", new Random().nextInt(100));

        PhieuDieuChuyenPhuKien ticket = PhieuDieuChuyenPhuKien.builder()
                .maPhieuChuyen(transferCode)
                .phuKien(phuKien)
                .showroomXuat(fromShowroom)
                .showroomNhap(toShowroom)
                .soLuong(payload.getQuantity())
                .nguoiTao(staff)
                .lyDo(payload.getReason() != null ? payload.getReason().trim() : "")
                .trangThai("DANG_VAN_CHUYEN")
                .ngayTao(LocalDateTime.now())
                .build();

        PhieuDieuChuyenPhuKien saved = phieuDieuChuyenPhuKienRepository.save(ticket);
        return ResponseEntity.ok(ApiResponse.ok(
                toTicketDto(saved),
                "Đã lập phiếu điều chuyển " + saved.getMaPhieuChuyen() + " thành công"
        ));
    }

    @PostMapping("/transfers/{id}/confirm")
    @Transactional
    public ResponseEntity<ApiResponse<StockTransferTicketDto>> confirmTransferTicket(
            @PathVariable Long id,
            Authentication authentication
    ) {
        PhieuDieuChuyenPhuKien ticket = phieuDieuChuyenPhuKienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu điều chuyển ID: " + id));

        if (!"DANG_VAN_CHUYEN".equals(ticket.getTrangThai())) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Phiếu điều chuyển này đã ở trạng thái " + ticket.getTrangThai() + ", không thể xác nhận lại")
            );
        }

        NguoiDung staff = resolveCurrentUser(authentication);

        TonKhoPhuKienShowroom destStock = tonKhoPhuKienShowroomRepository
                .findByPhuKienIdAndShowroomId(ticket.getPhuKien().getId(), ticket.getShowroomNhap().getId())
                .orElseGet(() -> TonKhoPhuKienShowroom.builder()
                        .phuKien(ticket.getPhuKien())
                        .showroom(ticket.getShowroomNhap())
                        .maSku(formatDefaultSku(ticket.getPhuKien().getId()))
                        .viTriKe("Kệ phụ kiện")
                        .soLuongTon(0)
                        .updatedAt(LocalDateTime.now())
                        .build());

        destStock.setSoLuongTon((destStock.getSoLuongTon() != null ? destStock.getSoLuongTon() : 0) + ticket.getSoLuong());
        destStock.setUpdatedAt(LocalDateTime.now());
        tonKhoPhuKienShowroomRepository.save(destStock);

        ticket.setTrangThai("DA_TIEP_NHAN");
        ticket.setNguoiXacNhan(staff);
        ticket.setNgayHoanTat(LocalDateTime.now());
        PhieuDieuChuyenPhuKien saved = phieuDieuChuyenPhuKienRepository.save(ticket);

        return ResponseEntity.ok(ApiResponse.ok(
                toTicketDto(saved),
                "Đã xác nhận tiếp nhận phiếu " + saved.getMaPhieuChuyen() + " và cộng tồn kho thành công"
        ));
    }

    @PostMapping("/transfers/{id}/cancel")
    @Transactional
    public ResponseEntity<ApiResponse<StockTransferTicketDto>> cancelTransferTicket(
            @PathVariable Long id,
            Authentication authentication
    ) {
        PhieuDieuChuyenPhuKien ticket = phieuDieuChuyenPhuKienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu điều chuyển ID: " + id));

        if (!"DANG_VAN_CHUYEN".equals(ticket.getTrangThai())) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Chỉ có thể hủy phiếu đang ở trạng thái Đang vận chuyển")
            );
        }

        NguoiDung staff = resolveCurrentUser(authentication);

        // Refund stock back to source showroom atomically
        TonKhoPhuKienShowroom sourceStock = tonKhoPhuKienShowroomRepository
                .findByPhuKienIdAndShowroomId(ticket.getPhuKien().getId(), ticket.getShowroomXuat().getId())
                .orElseGet(() -> TonKhoPhuKienShowroom.builder()
                        .phuKien(ticket.getPhuKien())
                        .showroom(ticket.getShowroomXuat())
                        .maSku(formatDefaultSku(ticket.getPhuKien().getId()))
                        .viTriKe("Kệ phụ kiện")
                        .soLuongTon(0)
                        .updatedAt(LocalDateTime.now())
                        .build());

        sourceStock.setSoLuongTon((sourceStock.getSoLuongTon() != null ? sourceStock.getSoLuongTon() : 0) + ticket.getSoLuong());
        sourceStock.setUpdatedAt(LocalDateTime.now());
        tonKhoPhuKienShowroomRepository.save(sourceStock);

        ticket.setTrangThai("DA_HUY");
        ticket.setNguoiXacNhan(staff);
        ticket.setNgayHoanTat(LocalDateTime.now());
        PhieuDieuChuyenPhuKien saved = phieuDieuChuyenPhuKienRepository.save(ticket);

        return ResponseEntity.ok(ApiResponse.ok(
                toTicketDto(saved),
                "Đã hủy phiếu " + saved.getMaPhieuChuyen() + " và hoàn tồn kho về showroom xuất"
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
                .filter(u -> !u.isDeleted() && u.getVaiTro() == com.autohub.core.enums.VaiTroNguoiDung.ROLE_STAFF)
                .min(Comparator.comparing(NguoiDung::getId))
                .orElse(null);
    }

    private Showroom resolveCurrentShowroom(Authentication authentication, List<Showroom> activeShowrooms) {
        NguoiDung user = resolveCurrentUser(authentication);
        if (user != null && user.getShowroom() != null) {
            return user.getShowroom();
        }
        return activeShowrooms.isEmpty() ? null : activeShowrooms.get(0);
    }

    private Showroom resolveSourceShowroom(CreateStockTransferRequest payload, List<Showroom> activeShowrooms) {
        if (payload.getFromShowroomId() != null) {
            return showroomRepository.findById(payload.getFromShowroomId()).orElse(null);
        }
        if (payload.getFromBranchName() != null && !payload.getFromBranchName().isBlank()) {
            return activeShowrooms.stream()
                    .filter(s -> s.getTenShowroom().equalsIgnoreCase(payload.getFromBranchName().trim()))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    private PhuKien resolveAccessory(CreateStockTransferRequest payload) {
        if (payload.getAccessoryId() != null) {
            return phuKienRepository.findById(payload.getAccessoryId()).orElse(null);
        }
        if (payload.getSku() != null && !payload.getSku().isBlank()) {
            Optional<TonKhoPhuKienShowroom> bySku = tonKhoPhuKienShowroomRepository.findAll().stream()
                    .filter(t -> payload.getSku().equalsIgnoreCase(t.getMaSku()))
                    .findFirst();
            if (bySku.isPresent()) {
                return bySku.get().getPhuKien();
            }
            for (PhuKien pk : phuKienRepository.findAll()) {
                if (payload.getSku().equalsIgnoreCase(formatDefaultSku(pk.getId()))) {
                    return pk;
                }
            }
        }
        return null;
    }

    private StockTransferTicketDto toTicketDto(PhieuDieuChuyenPhuKien t) {
        String sku = formatDefaultSku(t.getPhuKien().getId());
        Optional<TonKhoPhuKienShowroom> srRow = tonKhoPhuKienShowroomRepository
                .findByPhuKienIdAndShowroomId(t.getPhuKien().getId(), t.getShowroomXuat().getId());
        if (srRow.isPresent() && srRow.get().getMaSku() != null && !srRow.get().getMaSku().isBlank()) {
            sku = srRow.get().getMaSku();
        }
        return StockTransferTicketDto.builder()
                .id(String.valueOf(t.getId()))
                .transferCode(t.getMaPhieuChuyen())
                .accessoryId(t.getPhuKien().getId())
                .sku(sku)
                .accessoryName(t.getPhuKien().getTenPhuKien())
                .fromShowroomId(t.getShowroomXuat().getId())
                .fromShowroomName(t.getShowroomXuat().getTenShowroom())
                .toShowroomId(t.getShowroomNhap().getId())
                .toShowroomName(t.getShowroomNhap().getTenShowroom())
                .quantity(t.getSoLuong())
                .status(t.getTrangThai())
                .reason(t.getLyDo() != null ? t.getLyDo() : "")
                .createdBy(t.getNguoiTao() != null ? t.getNguoiTao().getHoTen() : "-")
                .confirmedBy(t.getNguoiXacNhan() != null ? t.getNguoiXacNhan().getHoTen() : null)
                .createdAt(t.getNgayTao() != null ? t.getNgayTao().format(FMT) : "-")
                .completedAt(t.getNgayHoanTat() != null ? t.getNgayHoanTat().format(FMT) : null)
                .build();
    }

    private String formatDefaultSku(Long id) {
        if (id == null) return "ACC-000";
        if (id == 1L) return "ACC-CHARGER-01";
        if (id == 2L) return "ACC-CAM-4K";
        if (id == 3L) return "ACC-CARPET-5D";
        if (id == 4L) return "ACC-FILM-NANO";
        if (id == 5L) return "ACC-BOOSTER-35";
        return "ACC-" + String.format("%03d", id);
    }
}
