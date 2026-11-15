package com.autohub.modules.admin.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.pricing.entity.BieuPhiLanBanh;
import com.autohub.core.pricing.entity.GoiVayNganHang;
import com.autohub.core.pricing.entity.TinhThanh;
import com.autohub.core.pricing.repository.BieuPhiLanBanhRepository;
import com.autohub.core.pricing.repository.GoiVayNganHangRepository;
import com.autohub.core.pricing.repository.TinhThanhRepository;
import com.autohub.modules.admin.dto.*;
import jakarta.annotation.PostConstruct;
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
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping({"/admin/registration-fees", "/admin/fees"})
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRegistrationFeeController {

    private final BieuPhiLanBanhRepository bieuPhiLanBanhRepository;
    private final TinhThanhRepository tinhThanhRepository;
    private final GoiVayNganHangRepository goiVayNganHangRepository;

    @PostConstruct
    public void initDefaultBankLoans() {
        try {
            if (goiVayNganHangRepository.count() == 0) {
                log.info("Khởi tạo danh sách ngân hàng liên kết và gói vay ưu đãi mặc định...");
                List<GoiVayNganHang> list = new ArrayList<>();
                list.add(GoiVayNganHang.builder()
                        .tenNganHang("Vietcombank")
                        .maNganHang("VCB")
                        .laiSuatNamDau(6.99)
                        .laiSuatThaNoi(10.5)
                        .kyHanVayToiDaNam(8)
                        .hanMucVayToiDaPhanTram(80)
                        .ghiChu("Ưu đãi lãi suất cố định 12 tháng đầu, miễn phí phạt trả nợ trước hạn từ năm thứ 5")
                        .dangHoatDong(true)
                        .build());
                list.add(GoiVayNganHang.builder()
                        .tenNganHang("Techcombank")
                        .maNganHang("TCB")
                        .laiSuatNamDau(7.49)
                        .laiSuatThaNoi(11.2)
                        .kyHanVayToiDaNam(8)
                        .hanMucVayToiDaPhanTram(85)
                        .ghiChu("Hỗ trợ duyệt hồ sơ siêu tốc trong 4 giờ làm việc qua hạn mức liên kết AutoHub VIP")
                        .dangHoatDong(true)
                        .build());
                list.add(GoiVayNganHang.builder()
                        .tenNganHang("VPBank")
                        .maNganHang("VPB")
                        .laiSuatNamDau(7.99)
                        .laiSuatThaNoi(11.8)
                        .kyHanVayToiDaNam(7)
                        .hanMucVayToiDaPhanTram(80)
                        .ghiChu("Tài trợ đến 80% giá trị xe lăn bánh, thủ tục thẩm định linh hoạt không chứng minh phức tạp")
                        .dangHoatDong(true)
                        .build());
                list.add(GoiVayNganHang.builder()
                        .tenNganHang("Shinhan Bank")
                        .maNganHang("SHB")
                        .laiSuatNamDau(6.80)
                        .laiSuatThaNoi(10.2)
                        .kyHanVayToiDaNam(8)
                        .hanMucVayToiDaPhanTram(75)
                        .ghiChu("Lãi suất ưu đãi hấp dẫn dành riêng cho ô tô điện thân thiện môi trường")
                        .dangHoatDong(true)
                        .build());
                list.add(GoiVayNganHang.builder()
                        .tenNganHang("BIDV")
                        .maNganHang("BIDV")
                        .laiSuatNamDau(7.10)
                        .laiSuatThaNoi(10.8)
                        .kyHanVayToiDaNam(8)
                        .hanMucVayToiDaPhanTram(80)
                        .ghiChu("Gói tín dụng xanh đồng hành cùng chương trình chuyển đổi Net Zero 2026")
                        .dangHoatDong(true)
                        .build());

                goiVayNganHangRepository.saveAll(list);
                log.info("Đã khởi tạo thành công {} gói vay ngân hàng liên kết!", list.size());
            }
        } catch (Exception ex) {
            log.warn("Không thể tự động seed gói vay ngân hàng: {}", ex.getMessage());
        }
    }

    // ==========================================
    // 1. BIỂU PHÍ LĂN BÁNH & TRƯỚC BẠ THEO TỈNH
    // ==========================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminRegistrationFeeDto>>> getAllRegistrationFees() {
        List<BieuPhiLanBanh> list = bieuPhiLanBanhRepository.findAllByOrderByIdAsc();
        List<AdminRegistrationFeeDto> dtos = list.stream()
                .map(this::toFeeDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtos, "Tải biểu phí lăn bánh theo tỉnh thành thành công"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<AdminRegistrationFeeDto>> createRegistrationFee(
            @Valid @RequestBody CreateRegistrationFeeRequest request) {

        TinhThanh tinhThanh = tinhThanhRepository.findById(request.getProvinceId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tỉnh/thành phố với ID: " + request.getProvinceId()));

        if (bieuPhiLanBanhRepository.existsByTinhThanhId(request.getProvinceId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Biểu phí cho tỉnh/thành '" + tinhThanh.getTenTinh() + "' đã tồn tại"));
        }

        BieuPhiLanBanh fee = BieuPhiLanBanh.builder()
                .tinhThanh(tinhThanh)
                .tyLePhiTruocBa(request.getRegistrationTaxRate())
                .phiCapBienSo(request.getLicensePlateFee())
                .phiDangKiem(request.getInspectionFee() != null ? request.getInspectionFee() : BigDecimal.valueOf(340000))
                .phiBaoTriDuongBo(request.getRoadMaintenanceFee() != null ? request.getRoadMaintenanceFee() : BigDecimal.valueOf(1560000))
                .phiBaoHiemTNDS(request.getMandatoryInsuranceFee() != null ? request.getMandatoryInsuranceFee() : BigDecimal.valueOf(873400))
                .ngayApDung(request.getEffectiveDate() != null ? request.getEffectiveDate() : LocalDate.now())
                .ngayHetHieuLuc(request.getExpiryDate())
                .build();

        fee = bieuPhiLanBanhRepository.save(fee);
        log.info("Admin created new registration fee for province: {}", tinhThanh.getTenTinh());

        return ResponseEntity.ok(ApiResponse.ok(toFeeDto(fee), "Thêm biểu phí lăn bánh mới thành công"));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<AdminRegistrationFeeDto>> updateRegistrationFee(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRegistrationFeeRequest request) {

        BieuPhiLanBanh fee = bieuPhiLanBanhRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy biểu phí với ID: " + id));

        if (request.getRegistrationTaxRate() != null) fee.setTyLePhiTruocBa(request.getRegistrationTaxRate());
        if (request.getLicensePlateFee() != null) fee.setPhiCapBienSo(request.getLicensePlateFee());
        if (request.getInspectionFee() != null) fee.setPhiDangKiem(request.getInspectionFee());
        if (request.getRoadMaintenanceFee() != null) fee.setPhiBaoTriDuongBo(request.getRoadMaintenanceFee());
        if (request.getMandatoryInsuranceFee() != null) fee.setPhiBaoHiemTNDS(request.getMandatoryInsuranceFee());
        if (request.getEffectiveDate() != null) fee.setNgayApDung(request.getEffectiveDate());
        if (request.getExpiryDate() != null) fee.setNgayHetHieuLuc(request.getExpiryDate());

        fee = bieuPhiLanBanhRepository.save(fee);
        log.info("Admin updated registration fee #{}", id);

        return ResponseEntity.ok(ApiResponse.ok(toFeeDto(fee), "Cập nhật biểu phí lăn bánh thành công"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteRegistrationFee(@PathVariable Long id) {
        BieuPhiLanBanh fee = bieuPhiLanBanhRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy biểu phí với ID: " + id));

        bieuPhiLanBanhRepository.delete(fee);
        log.info("Admin deleted registration fee #{}", id);

        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa biểu phí thành công"));
    }

    // ==========================================
    // 2. GÓI VAY NGÂN HÀNG & LÃI SUẤT TRẢ GÓP
    // ==========================================

    @GetMapping("/loans")
    public ResponseEntity<ApiResponse<List<AdminBankLoanDto>>> getAllBankLoans() {
        List<GoiVayNganHang> list = goiVayNganHangRepository.findAllByOrderByIdAsc();
        List<AdminBankLoanDto> dtos = list.stream()
                .map(this::toLoanDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtos, "Tải danh sách gói vay ngân hàng thành công"));
    }

    @PostMapping("/loans")
    @Transactional
    public ResponseEntity<ApiResponse<AdminBankLoanDto>> createBankLoan(
            @Valid @RequestBody CreateBankLoanRequest request) {

        String name = request.getBankName().trim();
        if (goiVayNganHangRepository.existsByTenNganHangIgnoreCase(name)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Ngân hàng '" + name + "' đã tồn tại trong danh sách liên kết"));
        }

        GoiVayNganHang loan = GoiVayNganHang.builder()
                .tenNganHang(name)
                .maNganHang(request.getBankCode() != null ? request.getBankCode().trim().toUpperCase() : null)
                .logoUrl(request.getLogoUrl())
                .laiSuatNamDau(request.getFirstYearRate())
                .laiSuatThaNoi(request.getFloatingRate())
                .kyHanVayToiDaNam(request.getMaxTenorYears())
                .hanMucVayToiDaPhanTram(request.getMaxLtvPercent())
                .ghiChu(request.getNote())
                .dangHoatDong(request.getActive() != null ? request.getActive() : true)
                .build();

        loan = goiVayNganHangRepository.save(loan);
        log.info("Admin added bank loan: {}", loan.getTenNganHang());

        return ResponseEntity.ok(ApiResponse.ok(toLoanDto(loan), "Thêm gói vay ngân hàng mới thành công"));
    }

    @PutMapping("/loans/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<AdminBankLoanDto>> updateBankLoan(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBankLoanRequest request) {

        GoiVayNganHang loan = goiVayNganHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói vay với ID: " + id));

        if (request.getBankName() != null && !request.getBankName().trim().isEmpty()) {
            String name = request.getBankName().trim();
            if (goiVayNganHangRepository.existsByTenNganHangIgnoreCaseAndIdNot(name, id)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Tên ngân hàng '" + name + "' đã tồn tại"));
            }
            loan.setTenNganHang(name);
        }

        if (request.getBankCode() != null) loan.setMaNganHang(request.getBankCode().trim().toUpperCase());
        if (request.getLogoUrl() != null) loan.setLogoUrl(request.getLogoUrl());
        if (request.getFirstYearRate() != null) loan.setLaiSuatNamDau(request.getFirstYearRate());
        if (request.getFloatingRate() != null) loan.setLaiSuatThaNoi(request.getFloatingRate());
        if (request.getMaxTenorYears() != null) loan.setKyHanVayToiDaNam(request.getMaxTenorYears());
        if (request.getMaxLtvPercent() != null) loan.setHanMucVayToiDaPhanTram(request.getMaxLtvPercent());
        if (request.getNote() != null) loan.setGhiChu(request.getNote());
        if (request.getActive() != null) loan.setDangHoatDong(request.getActive());

        loan = goiVayNganHangRepository.save(loan);
        log.info("Admin updated bank loan #{}", id);

        return ResponseEntity.ok(ApiResponse.ok(toLoanDto(loan), "Cập nhật gói vay ngân hàng thành công"));
    }

    @PutMapping("/loans/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<AdminBankLoanDto>> toggleBankLoanStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {

        GoiVayNganHang loan = goiVayNganHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói vay với ID: " + id));

        loan.setDangHoatDong(active);
        loan = goiVayNganHangRepository.save(loan);
        log.info("Admin toggled bank loan #{} active to {}", id, active);

        return ResponseEntity.ok(ApiResponse.ok(toLoanDto(loan), "Cập nhật trạng thái gói vay thành công"));
    }

    @DeleteMapping("/loans/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteBankLoan(@PathVariable Long id) {
        GoiVayNganHang loan = goiVayNganHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói vay với ID: " + id));

        goiVayNganHangRepository.delete(loan);
        log.info("Admin deleted bank loan #{}", id);

        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa gói vay ngân hàng thành công"));
    }

    // ==========================================
    // 3. THỐNG KÊ TỔNG QUAN
    // ==========================================

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<FeeStatsDto>> getFeeStats() {
        int totalProvinces = (int) tinhThanhRepository.count();
        List<BieuPhiLanBanh> fees = bieuPhiLanBanhRepository.findAll();
        int configuredProvinces = fees.size();

        double avgTax = fees.stream()
                .filter(f -> f.getTyLePhiTruocBa() != null)
                .mapToDouble(BieuPhiLanBanh::getTyLePhiTruocBa)
                .average()
                .orElse(10.0);

        List<GoiVayNganHang> loans = goiVayNganHangRepository.findByDangHoatDongTrueOrderByIdAsc();
        double lowestRate = loans.stream()
                .filter(l -> l.getLaiSuatNamDau() != null)
                .mapToDouble(GoiVayNganHang::getLaiSuatNamDau)
                .min()
                .orElse(6.8);

        int maxLtv = loans.stream()
                .filter(l -> l.getHanMucVayToiDaPhanTram() != null)
                .mapToInt(GoiVayNganHang::getHanMucVayToiDaPhanTram)
                .max()
                .orElse(85);

        FeeStatsDto stats = FeeStatsDto.builder()
                .totalProvinces(totalProvinces)
                .configuredProvinces(configuredProvinces)
                .avgRegistrationTaxRate(Math.round(avgTax * 10.0) / 10.0)
                .evTaxRate(0.0)
                .totalBankPartners(loans.size())
                .lowestInterestRate(lowestRate)
                .maxLtv(maxLtv)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(stats, "Tải thống kê biểu phí & lãi suất thành công"));
    }

    // ==========================================
    // MAPPERS
    // ==========================================

    private AdminRegistrationFeeDto toFeeDto(BieuPhiLanBanh b) {
        TinhThanh tt = b.getTinhThanh();
        LocalDate now = LocalDate.now();
        boolean isActive = b.getNgayHetHieuLuc() == null || !b.getNgayHetHieuLuc().isBefore(now);

        return AdminRegistrationFeeDto.builder()
                .id(b.getId())
                .provinceId(tt != null ? tt.getId() : null)
                .provinceName(tt != null ? tt.getTenTinh() : "Toàn quốc")
                .region(resolveRegion(tt))
                .licensePlateZone(tt != null ? tt.getPhanVungBienSo() : "Vùng 2")
                .registrationTaxRate(b.getTyLePhiTruocBa() != null ? b.getTyLePhiTruocBa() : 10.0)
                .electricTaxRate(0.0)
                .licensePlateFee(b.getPhiCapBienSo() != null ? b.getPhiCapBienSo() : BigDecimal.valueOf(1000000))
                .inspectionFee(b.getPhiDangKiem() != null ? b.getPhiDangKiem() : BigDecimal.valueOf(340000))
                .roadMaintenanceFee(b.getPhiBaoTriDuongBo() != null ? b.getPhiBaoTriDuongBo() : BigDecimal.valueOf(1560000))
                .mandatoryInsuranceFee(b.getPhiBaoHiemTNDS() != null ? b.getPhiBaoHiemTNDS() : BigDecimal.valueOf(873400))
                .effectiveDate(b.getNgayApDung())
                .expiryDate(b.getNgayHetHieuLuc())
                .active(isActive)
                .build();
    }

    private AdminBankLoanDto toLoanDto(GoiVayNganHang g) {
        return AdminBankLoanDto.builder()
                .id(g.getId())
                .bankName(g.getTenNganHang())
                .bankCode(g.getMaNganHang())
                .logoUrl(g.getLogoUrl())
                .firstYearRate(g.getLaiSuatNamDau())
                .floatingRate(g.getLaiSuatThaNoi())
                .maxTenorYears(g.getKyHanVayToiDaNam())
                .maxLtvPercent(g.getHanMucVayToiDaPhanTram())
                .note(g.getGhiChu())
                .active(g.isDangHoatDong())
                .build();
    }

    private String resolveRegion(TinhThanh tinhThanh) {
        if (tinhThanh == null || tinhThanh.getTenTinh() == null) return "Toàn quốc";
        String name = tinhThanh.getTenTinh().toLowerCase();

        if (name.contains("hà nội") || name.contains("quảng ninh") || name.contains("hải phòng") ||
                name.contains("hưng yên") || name.contains("hải dương") || name.contains("bắc ninh") ||
                name.contains("vĩnh phúc") || name.contains("thái nguyên") || name.contains("nam định") ||
                name.contains("ninh bình") || name.contains("thái bình") || name.contains("hà nam") ||
                name.contains("bắc giang") || name.contains("phú thọ") || name.contains("lạng sơn") ||
                name.contains("hòa bình")) {
            return "Miền Bắc";
        }

        if (name.contains("đà nẵng") || name.contains("huế") || name.contains("quảng nam") ||
                name.contains("quảng ngãi") || name.contains("bình định") || name.contains("khánh hòa") ||
                name.contains("nghệ an") || name.contains("hà tĩnh") || name.contains("thanh hóa") ||
                name.contains("lâm đồng")) {
            return "Miền Trung";
        }

        return "Miền Nam";
    }
}
