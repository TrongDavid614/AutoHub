package com.autohub.core.ai.tools;

import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import com.autohub.core.pricing.entity.BieuPhiLanBanh;
import com.autohub.core.pricing.entity.TinhThanh;
import com.autohub.core.pricing.repository.BieuPhiLanBanhRepository;
import com.autohub.core.pricing.repository.TinhThanhRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class RegistrationFeeCalculatorTool {

    private final PhienBanXeRepository phienBanXeRepository;
    private final TinhThanhRepository tinhThanhRepository;
    private final BieuPhiLanBanhRepository bieuPhiLanBanhRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RolloutCalculationResult {
        private String tenPhienBan;
        private String tinhThanh;
        private BigDecimal giaNiemYet;
        private boolean isElectric;
        private Double tyLePhiTruocBa;
        private BigDecimal phiTruocBa;
        private BigDecimal phiCapBienSo;
        private BigDecimal phiDangKiem;
        private BigDecimal phiBaoTriDuongBo;
        private BigDecimal phiBaoHiemTNDS;
        private BigDecimal tongChiPhiLanBanh;
        private String ghiChuChinhSach;
    }

    @Tool(description = "Tính dự toán chi phí lăn bánh chính xác (bao gồm thuế trước bạ, phí biển số, bảo hiểm, đăng kiểm, phí đường bộ) tại một tỉnh thành cụ thể từ dbo.bieu_phi_lan_banh và dbo.tinh_thanh")
    public RolloutCalculationResult calculateRolloutFee(
            @ToolParam(description = "Tên hoặc ID của phiên bản xe cần tính (ví dụ: VF8 Plus, SantaFe)") String variantKeyword,
            @ToolParam(description = "Tên tỉnh thành phố (ví dụ: Hà Nội, TP.HCM, Đà Nẵng)") String provinceName
    ) {
        return calculateRolloutFee(null, null, variantKeyword, provinceName);
    }

    public RolloutCalculationResult calculateRolloutFee(
            Long contextCarId,
            String targetVehicleName,
            String variantKeyword,
            String provinceName
    ) {
        log.info("[Spring AI Tool] calculateRolloutFee called with contextCarId: {}, targetVehicle: {}, variantKw: {}, province: {}",
                contextCarId, targetVehicleName, variantKeyword, provinceName);

        // 1. Tìm phiên bản xe (Ưu tiên: contextCarId -> targetVehicleName -> variantKeyword)
        PhienBanXe variant = null;
        if (contextCarId != null) {
            variant = phienBanXeRepository.findById(contextCarId).filter(v -> !v.isDeleted()).orElse(null);
        }

        if (variant == null) {
            List<PhienBanXe> variants = phienBanXeRepository.findAll();
            String vKw = (targetVehicleName != null && !targetVehicleName.isBlank())
                    ? targetVehicleName.trim().toLowerCase()
                    : (variantKeyword != null ? variantKeyword.trim().toLowerCase() : "");

            variant = variants.stream()
                    .filter(v -> !v.isDeleted())
                    .filter(v -> {
                        if (vKw.isEmpty()) return false;
                        String name = v.getTenPhienBan().toLowerCase();
                        String modelName = v.getDongXe() != null ? v.getDongXe().getTenDongXe().toLowerCase() : "";
                        return name.contains(vKw) || modelName.contains(vKw) || vKw.contains(name);
                    })
                    .findFirst()
                    .orElse(variants.isEmpty() ? null : variants.get(0));
        }

        if (variant == null) {
            return RolloutCalculationResult.builder()
                    .ghiChuChinhSach("Không tìm thấy phiên bản xe phù hợp với từ khóa: " + (targetVehicleName != null ? targetVehicleName : variantKeyword))
                    .build();
        }

        // 2. Tìm tỉnh thành
        List<TinhThanh> provinces = tinhThanhRepository.findAll();
        String pKw = provinceName != null ? provinceName.trim().toLowerCase() : "hà nội";
        TinhThanh province = provinces.stream()
                .filter(p -> p.getTenTinh() != null && p.getTenTinh().toLowerCase().contains(pKw))
                .findFirst()
                .orElse(provinces.isEmpty() ? null : provinces.get(0));

        Long provinceId = province != null ? province.getId() : 1L;
        boolean isVung1 = province != null && province.getPhanVungBienSo() != null && province.getPhanVungBienSo().contains("1");

        // 3. Lấy biểu phí
        BieuPhiLanBanh bieuPhi = bieuPhiLanBanhRepository.findByTinhThanhId(provinceId)
                .orElseGet(() -> BieuPhiLanBanh.builder()
                        .tyLePhiTruocBa(isVung1 ? 12.0 : 10.0)
                        .phiCapBienSo(BigDecimal.valueOf(isVung1 ? 20000000 : 1000000))
                        .phiDangKiem(BigDecimal.valueOf(340000))
                        .phiBaoTriDuongBo(BigDecimal.valueOf(1560000))
                        .phiBaoHiemTNDS(BigDecimal.valueOf(873400))
                        .build());

        BigDecimal giaNiemYet = variant.getGiaNiemYet();
        Double tyLeDouble = bieuPhi.getTyLePhiTruocBa() != null ? bieuPhi.getTyLePhiTruocBa() : (isVung1 ? 12.0 : 10.0);

        boolean isElectric = (variant.getLoaiNhienLieu() != null && (
                variant.getLoaiNhienLieu().toLowerCase().contains("điện") ||
                variant.getLoaiNhienLieu().toLowerCase().contains("ev") ||
                variant.getLoaiNhienLieu().toLowerCase().contains("electric"))) ||
                variant.getDungLuongPinKwh() != null;

        BigDecimal phiTruocBa = isElectric ? BigDecimal.ZERO :
                giaNiemYet.multiply(BigDecimal.valueOf(tyLeDouble)).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);

        BigDecimal phiBienSo = bieuPhi.getPhiCapBienSo() != null ? bieuPhi.getPhiCapBienSo() : (isVung1 ? BigDecimal.valueOf(20000000) : BigDecimal.valueOf(1000000));
        BigDecimal phiDangKiem = bieuPhi.getPhiDangKiem() != null ? bieuPhi.getPhiDangKiem() : BigDecimal.valueOf(340000);
        BigDecimal phiDuongBo = bieuPhi.getPhiBaoTriDuongBo() != null ? bieuPhi.getPhiBaoTriDuongBo() : BigDecimal.valueOf(1560000);
        BigDecimal phiBaoHiem = bieuPhi.getPhiBaoHiemTNDS() != null ? bieuPhi.getPhiBaoHiemTNDS() : BigDecimal.valueOf(873400);

        BigDecimal tong = giaNiemYet.add(phiTruocBa).add(phiBienSo).add(phiDangKiem).add(phiDuongBo).add(phiBaoHiem);

        String ghiChu = isElectric
                ? "Xe thuần điện được MIỄN 100% lệ phí trước bạ theo Nghị định 10/2022/NĐ-CP (tiết kiệm hàng trăm triệu đồng)."
                : "Thuế trước bạ áp dụng theo biểu phí tỉnh/thành hiện hành.";

        return RolloutCalculationResult.builder()
                .tenPhienBan(com.autohub.core.ai.executor.CarCatalogExecutor.getFullName(variant))
                .tinhThanh(province != null ? province.getTenTinh() : "Hà Nội")
                .giaNiemYet(giaNiemYet)
                .isElectric(isElectric)
                .tyLePhiTruocBa(isElectric ? 0.0 : tyLeDouble)
                .phiTruocBa(phiTruocBa)
                .phiCapBienSo(phiBienSo)
                .phiDangKiem(phiDangKiem)
                .phiBaoTriDuongBo(phiDuongBo)
                .phiBaoHiemTNDS(phiBaoHiem)
                .tongChiPhiLanBanh(tong)
                .ghiChuChinhSach(ghiChu)
                .build();
    }
}
