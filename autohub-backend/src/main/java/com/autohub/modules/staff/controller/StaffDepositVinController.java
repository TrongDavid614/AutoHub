package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.car.repository.XeDinhDanhRepository;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.deposit.repository.PhieuDatCocRepository;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import com.autohub.core.enums.TrangThaiXeVIN;
import com.autohub.modules.staff.dto.AssignVinRequest;
import com.autohub.modules.staff.dto.AvailableVinOptionDto;
import com.autohub.modules.staff.dto.StaffDepositDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/staff/deposits")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffDepositVinController {

    private final PhieuDatCocRepository depositRepository;
    private final XeDinhDanhRepository xeDinhDanhRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffDepositDto>>> getDepositsForAudit() {
        List<PhieuDatCoc> list = depositRepository.findAll();
        List<StaffDepositDto> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (PhieuDatCoc d : list) {
            long remainingSeconds = 0;
            if (d.getHanGiuXe() != null) {
                remainingSeconds = Math.max(0, Duration.between(now, d.getHanGiuXe()).getSeconds());
            }

            StaffDepositDto dto = StaffDepositDto.builder()
                    .id(String.valueOf(d.getId()))
                    .depositCode(d.getMaPhieuCoc() != null ? d.getMaPhieuCoc() : "#DEP-" + d.getId())
                    .customerName(d.getNguoiDung() != null ? d.getNguoiDung().getHoTen() : "-")
                    .customerPhone(d.getNguoiDung() != null && d.getNguoiDung().getSoDienThoai() != null ? d.getNguoiDung().getSoDienThoai() : "-")
                    .identityCardNumber(d.getSoCCCD() != null ? d.getSoCCCD() : "-")
                    .carModel(d.getTonKhoXe() != null && d.getTonKhoXe().getPhienBanXe() != null
                            ? d.getTonKhoXe().getPhienBanXe().getTenPhienBan() : "Chưa xác định")
                    .variant(d.getTonKhoXe() != null && d.getTonKhoXe().getMauSac() != null
                            ? d.getTonKhoXe().getMauSac().getTenMau() : "Tiêu chuẩn")
                    .depositAmount(d.getSoTienCoc() != null ? d.getSoTienCoc().doubleValue() : 0.0)
                    .remainingSeconds(remainingSeconds)
                    .assignedVin(d.getXeDinhDanh() != null ? d.getXeDinhDanh().getSoKhungVIN() : null)
                    .sepayTxnRef(d.getMaPhieuCoc() != null ? d.getMaPhieuCoc() : "DEP_" + d.getId())
                    .status(d.getTrangThai() != null ? d.getTrangThai().name() : "PAID")
                    .build();
            result.add(dto);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách phiếu cọc cần đối soát thành công từ database"));
    }

    @GetMapping("/available-vins")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<AvailableVinOptionDto>>> getAvailableVins() {
        List<XeDinhDanh> vins = xeDinhDanhRepository.findByTrangThai(TrangThaiXeVIN.CO_SAN);
        List<AvailableVinOptionDto> result = new ArrayList<>();

        for (XeDinhDanh v : vins) {
            AvailableVinOptionDto item = AvailableVinOptionDto.builder()
                    .id(String.valueOf(v.getId()))
                    .vin(v.getSoKhungVIN())
                    .model(v.getTonKhoXe() != null && v.getTonKhoXe().getPhienBanXe() != null
                            ? v.getTonKhoXe().getPhienBanXe().getTenPhienBan() : "Chưa xác định")
                    .color(v.getTonKhoXe() != null && v.getTonKhoXe().getMauSac() != null
                            ? v.getTonKhoXe().getMauSac().getTenMau() : "Tiêu chuẩn")
                    .location(v.getTonKhoXe() != null && v.getTonKhoXe().getShowroom() != null
                            ? v.getTonKhoXe().getShowroom().getTenShowroom() : "Kho AutoHub")
                    .build();
            result.add(item);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách số khung VIN sẵn sàng trong kho thành công"));
    }

    @PostMapping("/{depositId}/assign-vin")
    @Transactional
    public ResponseEntity<ApiResponse<String>> assignVinNumber(
            @PathVariable Long depositId,
            @Valid @RequestBody AssignVinRequest payload
    ) {
        String vin = payload.getVinNumber();
        PhieuDatCoc deposit = depositRepository.findById(depositId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu cọc ID: " + depositId));

        XeDinhDanh xeDinhDanh = xeDinhDanhRepository.findBySoKhungVIN(vin)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe định danh với số khung VIN: " + vin));

        if (xeDinhDanh.getTrangThai() != TrangThaiXeVIN.CO_SAN) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Số khung VIN " + vin + " đã được giữ chỗ hoặc đã bán"));
        }

        // Kiểm tra tính tương thích giữa phiên bản xe đặt cọc và số khung VIN
        if (deposit.getTonKhoXe() != null && xeDinhDanh.getTonKhoXe() != null) {
            Long depVariantId = deposit.getTonKhoXe().getPhienBanXe() != null ? deposit.getTonKhoXe().getPhienBanXe().getId() : null;
            Long vinVariantId = xeDinhDanh.getTonKhoXe().getPhienBanXe() != null ? xeDinhDanh.getTonKhoXe().getPhienBanXe().getId() : null;
            if (depVariantId != null && vinVariantId != null && !depVariantId.equals(vinVariantId)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Số khung VIN không khớp với phiên bản xe khách đặt cọc"));
            }
        }

        // Thu hồi VIN cũ nếu phiếu cọc trước đó đã có VIN khác
        if (deposit.getXeDinhDanh() != null && !deposit.getXeDinhDanh().getId().equals(xeDinhDanh.getId())) {
            XeDinhDanh oldVin = deposit.getXeDinhDanh();
            oldVin.setTrangThai(TrangThaiXeVIN.CO_SAN);
            xeDinhDanhRepository.save(oldVin);
        }

        xeDinhDanh.setTrangThai(TrangThaiXeVIN.DA_GIU_CHO);
        xeDinhDanhRepository.save(xeDinhDanh);

        deposit.setXeDinhDanh(xeDinhDanh);
        if (deposit.getTrangThai() == TrangThaiPhieuCoc.PENDING_PAYMENT) {
            deposit.setTrangThai(TrangThaiPhieuCoc.PAID);
        }
        depositRepository.save(deposit);

        return ResponseEntity.ok(ApiResponse.ok(vin, "Gán số khung VIN thành công cho phiếu cọc 72h trong database"));
    }

    @PostMapping("/{depositId}/sign-contract")
    @Transactional
    public ResponseEntity<ApiResponse<String>> signContract(@PathVariable Long depositId) {
        PhieuDatCoc deposit = depositRepository.findById(depositId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu cọc ID: " + depositId));

        deposit.setTrangThai(TrangThaiPhieuCoc.COMPLETED);
        deposit.setThoiGianHoanTat(LocalDateTime.now());
        if (deposit.getXeDinhDanh() != null) {
            XeDinhDanh vinEntity = deposit.getXeDinhDanh();
            vinEntity.setTrangThai(TrangThaiXeVIN.DA_BAN);
            xeDinhDanhRepository.save(vinEntity);
        }
        depositRepository.save(deposit);

        return ResponseEntity.ok(ApiResponse.ok("COMPLETED", "Ký hợp đồng mua bán thành công, đã cập nhật CSDL"));
    }
}
