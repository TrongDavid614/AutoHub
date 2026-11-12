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

        BieuPhiLanBanh bieuPhi = bieuPhiLanBanhRepository.findByTinhThanhId(targetProvinceId)
                .orElseGet(() -> bieuPhiLanBanhRepository.findAll().stream().findFirst()
                        .orElse(BieuPhiLanBanh.builder()
                                .tyLePhiTruocBa(10.0)
                                .phiCapBienSo(BigDecimal.valueOf(20000000))
                                .phiDangKiem(BigDecimal.valueOf(340000))
                                .phiBaoTriDuongBo(BigDecimal.valueOf(1560000))
                                .phiBaoHiemTNDS(BigDecimal.valueOf(873400))
                                .build()));

        BigDecimal giaNiemYet = variant.getGiaNiemYet();
        Double tyLeDouble = bieuPhi.getTyLePhiTruocBa() != null ? bieuPhi.getTyLePhiTruocBa() : 10.0;
        BigDecimal tyLe = BigDecimal.valueOf(tyLeDouble);

        // Thuế trước bạ = Giá niêm yết * tỷ lệ / 100
        BigDecimal phiTruocBa = giaNiemYet.multiply(tyLe)
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);

        BigDecimal phiBienSo = bieuPhi.getPhiCapBienSo() != null ? bieuPhi.getPhiCapBienSo() : BigDecimal.ZERO;
        BigDecimal phiDangKiem = bieuPhi.getPhiDangKiem() != null ? bieuPhi.getPhiDangKiem() : BigDecimal.ZERO;
        BigDecimal phiDuongBo = bieuPhi.getPhiBaoTriDuongBo() != null ? bieuPhi.getPhiBaoTriDuongBo() : BigDecimal.ZERO;
        BigDecimal phiBaoHiem = bieuPhi.getPhiBaoHiemTNDS() != null ? bieuPhi.getPhiBaoHiemTNDS() : BigDecimal.ZERO;

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
        result.put("giaNiemYet", giaNiemYet);
        result.put("tyLePhiTruocBa", tyLeDouble);
        result.put("phiTruocBa", phiTruocBa);
        result.put("phiCapBienSo", phiBienSo);
        result.put("phiDangKiem", phiDangKiem);
        result.put("phiBaoTriDuongBo", phiDuongBo);
        result.put("phiBaoHiemTnds", phiBaoHiem);
        result.put("tongChiPhiLanBanh", tongChiPhiLanBanh);
        result.put("mucTienCoc", variant.getMucTienCoc());

        return ResponseEntity.ok(ApiResponse.ok(result, "Dự toán chi phí lăn bánh ô tô điện thành công"));
    }
}
