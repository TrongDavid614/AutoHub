package com.autohub.core.ai.tools;

import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
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
public class CarSpecificationTool {

    private final PhienBanXeRepository phienBanXeRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CarSpecSummary {
        private Long id;
        private String tenPhienBan;
        private String tenDongXe;
        private String phanKhuc;
        private BigDecimal giaNiemYet;
        private BigDecimal mucTienCoc;
        private String loaiNhienLieu;
        private Integer soChoNgoi;
        private Integer tamHoatDongKm;
        private BigDecimal dungLuongPinKwh;
        private String hopSo;
        private String thongSoKyThuat;
    }

    @Tool(description = "Tìm kiếm thông số kỹ thuật, giá niêm yết, động cơ, dung lượng pin và số chỗ ngồi của các phiên bản xe trong hệ thống AutoHub từ bảng dbo.phien_ban_xe")
    public List<CarSpecSummary> searchCarSpecifications(
            @ToolParam(description = "Từ khóa tìm kiếm xe (ví dụ: VF8, SantaFe, Track Edition, sedan, điện...) hoặc để trống để xem tất cả") String keyword
    ) {
        log.info("[Spring AI Tool] searchCarSpecifications called with keyword: {}", keyword);
        List<PhienBanXe> variants = phienBanXeRepository.findAll();
        String kw = keyword != null ? keyword.trim().toLowerCase() : "";

        return variants.stream()
                .filter(v -> !v.isDeleted() && v.isDangHoatDong())
                .filter(v -> {
                    if (kw.isEmpty()) return true;
                    boolean matchName = v.getTenPhienBan() != null && v.getTenPhienBan().toLowerCase().contains(kw);
                    boolean matchDongXe = v.getDongXe() != null && v.getDongXe().getTenDongXe() != null && v.getDongXe().getTenDongXe().toLowerCase().contains(kw);
                    boolean matchFuel = v.getLoaiNhienLieu() != null && v.getLoaiNhienLieu().toLowerCase().contains(kw);
                    boolean matchPhanKhuc = v.getDongXe() != null && v.getDongXe().getPhanKhuc() != null && v.getDongXe().getPhanKhuc().toLowerCase().contains(kw);
                    return matchName || matchDongXe || matchFuel || matchPhanKhuc;
                })
                .map(v -> CarSpecSummary.builder()
                        .id(v.getId())
                        .tenPhienBan(com.autohub.core.ai.executor.CarCatalogExecutor.getFullName(v))
                        .tenDongXe(v.getDongXe() != null ? v.getDongXe().getTenDongXe() : "")
                        .phanKhuc(v.getDongXe() != null ? v.getDongXe().getPhanKhuc() : "")
                        .giaNiemYet(v.getGiaNiemYet())
                        .mucTienCoc(v.getMucTienCoc())
                        .loaiNhienLieu(v.getLoaiNhienLieu())
                        .soChoNgoi(v.getSoChoNgoi())
                        .tamHoatDongKm(v.getTamHoatDongKm())
                        .dungLuongPinKwh(v.getDungLuongPinKwh())
                        .hopSo(v.getHopSo())
                        .thongSoKyThuat(v.getThongSoKyThuat())
                        .build())
                .limit(10)
                .collect(Collectors.toList());
    }
}
