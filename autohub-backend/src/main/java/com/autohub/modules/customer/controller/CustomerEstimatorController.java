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
            @RequestParam(defaultValue = "1") Long provinceId
    ) {
        PhienBanXe variant = phienBanXeRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiên bản xe ID: " + variantId));

        BieuPhiLanBanh bieuPhi = bieuPhiLanBanhRepository.findByTinhThanhId(provinceId)
                .orElseGet(() -> bieuPhiLanBanhRepository.findAll().stream().findFirst()
                        .orElse(BieuPhiLanBanh.builder()
                                .tyLePhiTruocBa(BigDecimal.valueOf(10.0))
                                .phiCapBienSo(BigDecimal.valueOf(20000000))
                                .phiDangKiem(BigDecimal.valueOf(340000))
                                .phiBaoTriDuongBo(BigDecimal.valueOf(1560000))
                                .phiBaoHiemTnds(BigDecimal.valueOf(873400))
                                .build()));

        BigDecimal giaNiemYet = variant.getGiaNiemYet();
        // Thuế trước bạ = Giá niêm yết * tỷ lệ / 100
        BigDecimal phiTruocBa = giaNiemYet.multiply(bieuPhi.getTyLePhiTruocBa())
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);

        BigDecimal tongChiPhiLanBanh = giaNiemYet
                .add(phiTruocBa)
                .add(bieuPhi.getPhiCapBienSo())
                .add(bieuPhi.getPhiDangKiem())
                .add(bieuPhi.getPhiBaoTriDuongBo())
                .add(bieuPhi.getPhiBaoHiemTnds());

        Map<String, Object> result = new HashMap<>();
        result.put("variantId", variant.getId());
        result.put("variantName", variant.getTenPhienBan());
        result.put("giaNiemYet", giaNiemYet);
        result.put("tyLePhiTruocBa", bieuPhi.getTyLePhiTruocBa());
        result.put("phiTruocBa", phiTruocBa);
        result.put("phiCapBienSo", bieuPhi.getPhiCapBienSo());
        result.put("phiDangKiem", bieuPhi.getPhiDangKiem());
        result.put("phiBaoTriDuongBo", bieuPhi.getPhiBaoTriDuongBo());
        result.put("phiBaoHiemTnds", bieuPhi.getPhiBaoHiemTnds());
        result.put("tongChiPhiLanBanh", tongChiPhiLanBanh);
        result.put("mucTienCoc", variant.getMucTienCoc());

        return ResponseEntity.ok(ApiResponse.ok(result, "Dự toán chi phí lăn bánh ô tô điện thành công"));
    }
}

