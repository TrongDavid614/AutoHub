package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.pricing.entity.BieuPhiLanBanh;
import com.autohub.core.pricing.entity.TinhThanh;
import com.autohub.core.pricing.repository.BieuPhiLanBanhRepository;
import com.autohub.core.pricing.repository.TinhThanhRepository;
import com.autohub.modules.admin.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin/registration-fees")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRegistrationFeeController {

    private final BieuPhiLanBanhRepository bieuPhiLanBanhRepository;
    private final TinhThanhRepository tinhThanhRepository;

    // Danh sách cấu hình gói vay ngân hàng liên kết tham chiếu
    private static final List<BankLoanPackageDto> BANK_LOANS = new CopyOnWriteArrayList<>(List.of(
            BankLoanPackageDto.builder().id("VCB").bank("Vietcombank").firstYearRate(6.99).floatRate(10.5).maxTenorYears(8).maxLtvPercent(80).build(),
            BankLoanPackageDto.builder().id("TCB").bank("Techcombank").firstYearRate(7.49).floatRate(11.2).maxTenorYears(8).maxLtvPercent(85).build(),
            BankLoanPackageDto.builder().id("VPB").bank("VPBank").firstYearRate(7.99).floatRate(11.8).maxTenorYears(7).maxLtvPercent(80).build(),
            BankLoanPackageDto.builder().id("SHB").bank("Shinhan Bank").firstYearRate(6.80).floatRate(10.2).maxTenorYears(8).maxLtvPercent(75).build()
    ));

    @GetMapping
    @Transactional
    public ResponseEntity<ApiResponse<FeeOverviewResponse>> getFeeOverview() {
        FeeOverviewResponse response = loadFeeOverview();
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách biểu phí lăn bánh và lãi suất vay thành công"));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<RegistrationFeeDto>> updateRegistrationFee(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRegistrationFeeRequest request) {

        if (request.getTyLePhiTruocBa() < 0 || request.getTyLePhiTruocBa() > 100) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Tỷ lệ lệ phí trước bạ phải từ 0% đến 100%"));
        }
        if (request.getPhiCapBienSo().compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Phí cấp biển số không được âm"));
        }
        if (request.getPhiDangKiem().compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Phí đăng kiểm không được âm"));
        }
        if (request.getPhiBaoTriDuongBo().compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Phí bảo trì đường bộ không được âm"));
        }
        if (request.getPhiBaoHiemTnds().compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Phí bảo hiểm TNDS không được âm"));
        }

        // Tìm theo id của biểu phí hoặc fallback theo tinhThanhId
        Optional<BieuPhiLanBanh> opt = bieuPhiLanBanhRepository.findById(id);
        if (opt.isEmpty()) {
            opt = bieuPhiLanBanhRepository.findByTinhThanhId(id);
        }

        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BieuPhiLanBanh entity = opt.get();
        entity.setTyLePhiTruocBa(request.getTyLePhiTruocBa());
        entity.setPhiCapBienSo(request.getPhiCapBienSo());
        entity.setPhiDangKiem(request.getPhiDangKiem());
        entity.setPhiBaoTriDuongBo(request.getPhiBaoTriDuongBo());
        entity.setPhiBaoHiemTNDS(request.getPhiBaoHiemTnds());

        BieuPhiLanBanh saved = bieuPhiLanBanhRepository.save(entity);
        return ResponseEntity.ok(ApiResponse.ok(toDto(saved), "Cập nhật biểu phí tỉnh thành thành công"));
    }

    @PostMapping("/batch-update")
    @Transactional
    public ResponseEntity<ApiResponse<FeeOverviewResponse>> batchUpdateFees(
            @Valid @RequestBody BatchUpdateFeeRequest request) {

        // 1. Cập nhật biểu phí tỉnh thành
        if (request.getProvincialFees() != null && !request.getProvincialFees().isEmpty()) {
            for (RegistrationFeeDto item : request.getProvincialFees()) {
                if (item.getTyLePhiTruocBa() == null || item.getTyLePhiTruocBa() < 0 || item.getTyLePhiTruocBa() > 100) {
                    return ResponseEntity.badRequest().body(ApiResponse.error("Tỷ lệ lệ phí trước bạ của '" + item.getTenTinhThanh() + "' không hợp lệ"));
                }

                Optional<BieuPhiLanBanh> opt = Optional.empty();
                if (item.getId() != null) {
                    opt = bieuPhiLanBanhRepository.findById(item.getId());
                }
                if (opt.isEmpty() && item.getTinhThanhId() != null) {
                    opt = bieuPhiLanBanhRepository.findByTinhThanhId(item.getTinhThanhId());
                }

                if (opt.isPresent()) {
                    BieuPhiLanBanh entity = opt.get();
                    entity.setTyLePhiTruocBa(item.getTyLePhiTruocBa());
                    if (item.getPhiCapBienSo() != null) entity.setPhiCapBienSo(item.getPhiCapBienSo());
                    if (item.getPhiDangKiem() != null) entity.setPhiDangKiem(item.getPhiDangKiem());
                    if (item.getPhiBaoTriDuongBo() != null) entity.setPhiBaoTriDuongBo(item.getPhiBaoTriDuongBo());
                    if (item.getPhiBaoHiemTnds() != null) entity.setPhiBaoHiemTNDS(item.getPhiBaoHiemTnds());
                    bieuPhiLanBanhRepository.save(entity);
                }
            }
        }

        // 2. Cập nhật thông số gói vay ngân hàng nếu có
        if (request.getBankLoans() != null && !request.getBankLoans().isEmpty()) {
            BANK_LOANS.clear();
            BANK_LOANS.addAll(request.getBankLoans());
        }

        FeeOverviewResponse response = loadFeeOverview();
        return ResponseEntity.ok(ApiResponse.ok(response, "Lưu toàn bộ cấu hình biểu phí lăn bánh & lãi suất thành công"));
    }

    private FeeOverviewResponse loadFeeOverview() {
        List<TinhThanh> provinces = tinhThanhRepository.findAll();
        List<RegistrationFeeDto> feeDtos = new ArrayList<>();

        for (TinhThanh province : provinces) {
            Optional<BieuPhiLanBanh> bpOpt = bieuPhiLanBanhRepository.findByTinhThanhId(province.getId());
            BieuPhiLanBanh bp;

            if (bpOpt.isPresent()) {
                bp = bpOpt.get();
            } else {
                // Tự động khởi tạo biểu phí mặc định theo vùng quy chuẩn nếu tỉnh chưa có bản ghi
                boolean isVung1 = province.getPhanVungBienSo() != null && province.getPhanVungBienSo().contains("1");
                bp = BieuPhiLanBanh.builder()
                        .tinhThanh(province)
                        .tyLePhiTruocBa(isVung1 ? 12.0 : 10.0)
                        .phiCapBienSo(BigDecimal.valueOf(isVung1 ? 20000000 : 1000000))
                        .phiDangKiem(BigDecimal.valueOf(90000))
                        .phiBaoTriDuongBo(BigDecimal.valueOf(1560000))
                        .phiBaoHiemTNDS(BigDecimal.valueOf(480700))
                        .ngayApDung(LocalDate.now())
                        .ngayHetHieuLuc(null)
                        .build();
                bp = bieuPhiLanBanhRepository.save(bp);
            }

            feeDtos.add(toDto(bp));
        }

        return FeeOverviewResponse.builder()
                .provincialFees(feeDtos)
                .bankLoans(new ArrayList<>(BANK_LOANS))
                .build();
    }

    private RegistrationFeeDto toDto(BieuPhiLanBanh entity) {
        TinhThanh province = entity.getTinhThanh();
        return RegistrationFeeDto.builder()
                .id(entity.getId())
                .tinhThanhId(province != null ? province.getId() : null)
                .tenTinhThanh(province != null ? province.getTenTinh() : "N/A")
                .phanVungBienSo(province != null ? province.getPhanVungBienSo() : "N/A")
                .tyLePhiTruocBa(entity.getTyLePhiTruocBa() != null ? entity.getTyLePhiTruocBa() : 10.0)
                .phiCapBienSo(entity.getPhiCapBienSo() != null ? entity.getPhiCapBienSo() : BigDecimal.ZERO)
                .phiDangKiem(entity.getPhiDangKiem() != null ? entity.getPhiDangKiem() : BigDecimal.valueOf(90000))
                .phiBaoTriDuongBo(entity.getPhiBaoTriDuongBo() != null ? entity.getPhiBaoTriDuongBo() : BigDecimal.valueOf(1560000))
                .phiBaoHiemTnds(entity.getPhiBaoHiemTNDS() != null ? entity.getPhiBaoHiemTNDS() : BigDecimal.valueOf(480700))
                .ngayApDung(entity.getNgayApDung())
                .ngayHetHieuLuc(entity.getNgayHetHieuLuc())
                .build();
    }
}
