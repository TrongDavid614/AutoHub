package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.pricing.entity.BieuPhiLanBanh;
import com.autohub.core.pricing.entity.TinhThanh;
import com.autohub.core.pricing.repository.BieuPhiLanBanhRepository;
import com.autohub.core.pricing.repository.TinhThanhRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer/estimator")
@RequiredArgsConstructor
public class CustomerEstimatorController {

    private final TinhThanhRepository tinhThanhRepository;
    private final BieuPhiLanBanhRepository bieuPhiLanBanhRepository;
    private final PhienBanXeRepository phienBanXeRepository;

    @GetMapping("/provinces")
    public ResponseEntity<ApiResponse<List<TinhThanh>>> getProvinces() {
        return ResponseEntity.ok(ApiResponse.ok(tinhThanhRepository.findAll(), "Lấy danh sách tỉnh thành tính biểu phí thành công"));
    }

    @GetMapping("/calculate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateRollingCost(
            @RequestParam Long variantId,
            @RequestParam(required = false) Long provinceId,
            @RequestParam(required = false) Long tinhThanhId
    ) {
        Long targetProvinceId = tinhThanhId != null ? tinhThanhId : (provinceId != null ? provinceId : 1L);

        PhienBanXe variant = phienBanXeRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiên bản xe ID: " + variantId));

        TinhThanh tinhThanh = tinhThanhRepository.findById(targetProvinceId).orElse(null);
        boolean isVung1 = tinhThanh != null && tinhThanh.getPhanVungBienSo() != null && tinhThanh.getPhanVungBienSo().contains("1");

        BieuPhiLanBanh bieuPhi = bieuPhiLanBanhRepository.findByTinhThanhId(targetProvinceId)
                .orElseGet(() -> BieuPhiLanBanh.builder()
                        .tyLePhiTruocBa(isVung1 ? 12.0 : 10.0)
                        .phiCapBienSo(BigDecimal.valueOf(isVung1 ? 20000000 : 1000000))
                        .phiDangKiem(BigDecimal.valueOf(340000))
                        .phiBaoTriDuongBo(BigDecimal.valueOf(1560000))
                        .phiBaoHiemTNDS(BigDecimal.valueOf(873400))
                        .build());

        BigDecimal giaNiemYet = variant.getGiaNiemYet();
        Double tyLeDouble = bieuPhi.getTyLePhiTruocBa() != null ? bieuPhi.getTyLePhiTruocBa() : (isVung1 ? 12.0 : 10.0);
        BigDecimal tyLe = BigDecimal.valueOf(tyLeDouble);

        // Kiểm tra loại nhiên liệu: Xe điện miễn 100% lệ phí trước bạ (Nghị định 10/2022/NĐ-CP)
        boolean isElectric = (variant.getLoaiNhienLieu() != null && (
                variant.getLoaiNhienLieu().toLowerCase().contains("điện") ||
                variant.getLoaiNhienLieu().toLowerCase().contains("ev") ||
                variant.getLoaiNhienLieu().toLowerCase().contains("electric"))) ||
                variant.getDungLuongPinKwh() != null;

        BigDecimal phiTruocBaStandard = giaNiemYet.multiply(tyLe)
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);

        BigDecimal phiTruocBa = isElectric ? BigDecimal.ZERO : phiTruocBaStandard;
        Double tyLeApDung = isElectric ? 0.0 : tyLeDouble;

        BigDecimal phiBienSo = bieuPhi.getPhiCapBienSo() != null ? bieuPhi.getPhiCapBienSo() : (isVung1 ? BigDecimal.valueOf(20000000) : BigDecimal.valueOf(1000000));
        BigDecimal phiDangKiem = bieuPhi.getPhiDangKiem() != null ? bieuPhi.getPhiDangKiem() : BigDecimal.valueOf(340000);
        BigDecimal phiDuongBo = bieuPhi.getPhiBaoTriDuongBo() != null ? bieuPhi.getPhiBaoTriDuongBo() : BigDecimal.valueOf(1560000);
        BigDecimal phiBaoHiem = bieuPhi.getPhiBaoHiemTNDS() != null ? bieuPhi.getPhiBaoHiemTNDS() : BigDecimal.valueOf(873400);

        BigDecimal tongChiPhiLanBanh = giaNiemYet
                .add(phiTruocBa)
                .add(phiBienSo)
                .add(phiDangKiem)
                .add(phiDuongBo)
                .add(phiBaoHiem);

        Map<String, Object> result = new HashMap<>();
        result.put("variantId", variant.getId());
        result.put("variantName", variant.getTenPhienBan());
        result.put("provinceId", targetProvinceId);
        result.put("tinhThanhId", targetProvinceId);
        result.put("provinceName", tinhThanh != null ? tinhThanh.getTenTinh() : "Hà Nội");
        result.put("giaNiemYet", giaNiemYet);
        result.put("isElectric", isElectric);
        result.put("tyLePhiTruocBa", tyLeApDung);
        result.put("tyLePhiTruocBaStandard", tyLeDouble);
        result.put("phiTruocBa", phiTruocBa);
        result.put("phiTruocBaStandard", phiTruocBaStandard);
        result.put("phiCapBienSo", phiBienSo);
        result.put("phiDangKiem", phiDangKiem);
        result.put("phiBaoTriDuongBo", phiDuongBo);
        result.put("phiBaoHiemTnds", phiBaoHiem);
        result.put("tongChiPhiLanBanh", tongChiPhiLanBanh);
        result.put("mucTienCoc", variant.getMucTienCoc() != null ? variant.getMucTienCoc() : BigDecimal.valueOf(20000000));

        return ResponseEntity.ok(ApiResponse.ok(result, "Dự toán chi phí lăn bánh ô tô điện thành công"));
    }
}
