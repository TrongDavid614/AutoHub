package com.autohub.core.ai.tools;

import com.autohub.core.showroom.entity.TonKhoXe;
import com.autohub.core.showroom.repository.TonKhoXeRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryCheckTool {

    private final TonKhoXeRepository tonKhoXeRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryStockDetail {
        private String tenPhienBan;
        private String mauSac;
        private String tenShowroom;
        private String diaChiShowroom;
        private Integer soLuongKhaDung;
        private Integer soLuongDangGiuCho;
        private String trangThaiGiao;
    }

    @Tool(description = "Kiểm tra tồn kho xe thực tế, số lượng xe sẵn sàng giao ngay tại các showroom và số lượng xe đang giữ cọc theo phiên bản hoặc showroom từ dbo.ton_kho_xe")
    public List<InventoryStockDetail> checkCarInventory(
            @ToolParam(description = "Tên phiên bản xe hoặc từ khóa tìm kiếm (ví dụ: VF8, SantaFe, Track Edition)") String variantKeyword,
            @ToolParam(description = "Tên thành phố hoặc showroom (tùy chọn)") String showroomLocation
    ) {
        return checkCarInventory(null, null, variantKeyword, showroomLocation);
    }

    public List<InventoryStockDetail> checkCarInventory(
            Long contextCarId,
            String targetVehicleName,
            String variantKeyword,
            String showroomLocation
    ) {
        log.info("[Spring AI Tool] checkCarInventory called with contextCarId: {}, targetVehicle: {}, variantKw: {}, showroom: {}",
                contextCarId, targetVehicleName, variantKeyword, showroomLocation);
        List<TonKhoXe> stocks = tonKhoXeRepository.findAll();
        String vKw = (targetVehicleName != null && !targetVehicleName.isBlank())
                ? targetVehicleName.trim().toLowerCase()
                : (variantKeyword != null ? variantKeyword.trim().toLowerCase() : "");
        String sKw = showroomLocation != null ? showroomLocation.trim().toLowerCase() : "";

        return stocks.stream()
                .filter(stock -> {
                    if (stock.getPhienBanXe() == null) return false;
                    boolean matchV;
                    if (contextCarId != null) {
                        matchV = contextCarId.equals(stock.getPhienBanXe().getId());
                    } else if (!vKw.isEmpty()) {
                        String vName = stock.getPhienBanXe().getTenPhienBan().toLowerCase();
                        String mName = stock.getPhienBanXe().getDongXe() != null ? stock.getPhienBanXe().getDongXe().getTenDongXe().toLowerCase() : "";
                        matchV = vName.contains(vKw) || mName.contains(vKw) || vKw.contains(vName);
                    } else {
                        matchV = true;
                    }

                    boolean matchS = true;
                    if (!sKw.isEmpty() && stock.getShowroom() != null) {
                        String sName = (stock.getShowroom().getTenShowroom() + " " + (stock.getShowroom().getDiaChi() != null ? stock.getShowroom().getDiaChi() : "")).toLowerCase();
                        matchS = sName.contains(sKw);
                    }
                    return matchV && matchS;
                })
                .map(stock -> {
                    int khaDung = stock.getSoLuongKhaDung() != null ? stock.getSoLuongKhaDung() : 0;
                    String status = khaDung > 0 ? "SẴN SÀNG GIAO NGAY" : "HẾT XE SẴN (CẦN ĐẶT TRƯỚC)";
                    return InventoryStockDetail.builder()
                            .tenPhienBan(com.autohub.core.ai.executor.CarCatalogExecutor.getFullName(stock.getPhienBanXe()))
                            .mauSac(stock.getMauSac() != null ? stock.getMauSac().getTenMau() : "Tiêu chuẩn")
                            .tenShowroom(stock.getShowroom() != null ? stock.getShowroom().getTenShowroom() : "Showroom AutoHub")
                            .diaChiShowroom(stock.getShowroom() != null ? stock.getShowroom().getDiaChi() : "")
                            .soLuongKhaDung(khaDung)
                            .soLuongDangGiuCho(stock.getSoLuongDangGiuCho() != null ? stock.getSoLuongDangGiuCho() : 0)
                            .trangThaiGiao(status)
                            .build();
                })
                .limit(10)
                .collect(Collectors.toList());
    }
}
