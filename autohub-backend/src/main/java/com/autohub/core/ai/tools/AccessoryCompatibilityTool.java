package com.autohub.core.ai.tools;

import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.PhuKienRepository;
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
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccessoryCompatibilityTool {

    private final PhuKienRepository phuKienRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccessoryDetail {
        private Long id;
        private String tenPhuKien;
        private String thuongHieu;
        private BigDecimal giaBan;
        private Integer soLuongTon;
        private String quyCachLapDat;
        private boolean dungChung;
        private String trangThaiTon;
    }

    @Tool(description = "Tìm kiếm phụ kiện chính hãng tương thích với dòng xe và còn tồn kho từ bảng dbo.phu_kien")
    public List<AccessoryDetail> searchCompatibleAccessories(
            @ToolParam(description = "Từ khóa phụ kiện (ví dụ: sạc, thảm, camera, phim cách nhiệt) hoặc tên dòng xe") String keyword
    ) {
        log.info("[Spring AI Tool] searchCompatibleAccessories called with keyword: {}", keyword);
        List<PhuKien> accessories = phuKienRepository.findAll();
        String kw = keyword != null ? keyword.trim().toLowerCase() : "";

        return accessories.stream()
                .filter(PhuKien::isDangHoatDong)
                .filter(pk -> {
                    if (kw.isEmpty()) return true;
                    boolean matchName = pk.getTenPhuKien() != null && pk.getTenPhuKien().toLowerCase().contains(kw);
                    boolean matchBrand = pk.getThuongHieu() != null && pk.getThuongHieu().toLowerCase().contains(kw);
                    boolean matchCat = pk.getDanhMucPhuKien() != null && pk.getDanhMucPhuKien().getTenDanhMuc() != null &&
                            pk.getDanhMucPhuKien().getTenDanhMuc().toLowerCase().contains(kw);
                    boolean matchModel = pk.getDongXes() != null && pk.getDongXes().stream()
                            .anyMatch(dx -> dx.getTenDongXe() != null && dx.getTenDongXe().toLowerCase().contains(kw));
                    return matchName || matchBrand || matchCat || matchModel || pk.isDungChung();
                })
                .map(pk -> {
                    int ton = pk.getSoLuongTon() != null ? pk.getSoLuongTon() : 0;
                    return AccessoryDetail.builder()
                            .id(pk.getId())
                            .tenPhuKien(pk.getTenPhuKien())
                            .thuongHieu(pk.getThuongHieu())
                            .giaBan(pk.getGiaBan())
                            .soLuongTon(ton)
                            .quyCachLapDat(pk.getQuyCachLapDat())
                            .dungChung(pk.isDungChung())
                            .trangThaiTon(ton > 0 ? "CÒN HÀNG TRONG KHO" : "HẾT HÀNG TẠM THỜI")
                            .build();
                })
                .limit(8)
                .collect(Collectors.toList());
    }
}
