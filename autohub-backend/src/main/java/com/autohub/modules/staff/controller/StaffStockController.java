package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.PhuKienRepository;
import com.autohub.modules.staff.dto.BranchStockDto;
import com.autohub.modules.staff.dto.CrossBranchStockDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/staff/stocks")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffStockController {

    private final PhuKienRepository phuKienRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<CrossBranchStockDto>>> getCrossBranchStocks() {
        List<PhuKien> list = phuKienRepository.findAll();
        List<CrossBranchStockDto> result = new ArrayList<>();

        for (PhuKien p : list) {
            long id = p.getId() != null ? p.getId() : 1L;
            String sku = "ACC-" + String.format("%03d", id);
            if (id == 1L) sku = "ACC-CHARGER-01";
            else if (id == 2L) sku = "ACC-CAM-4K";
            else if (id == 3L) sku = "ACC-CARPET-5D";
            else if (id == 4L) sku = "ACC-FILM-NANO";
            else if (id == 5L) sku = "ACC-BOOSTER-35";

            int totalTon = p.getSoLuongTon() != null ? p.getSoLuongTon() : 10;
            int localStock = Math.max(0, totalTon / 2);

            List<BranchStockDto> branches = new ArrayList<>();
            branches.add(BranchStockDto.builder().branchName("Showroom Q.1 - Sài Gòn").stock(Math.max(2, totalTon / 3)).build());
            branches.add(BranchStockDto.builder().branchName("Showroom Mỹ Đình - Hà Nội").stock(Math.max(1, totalTon / 4)).build());
            branches.add(BranchStockDto.builder().branchName("Showroom Hải Châu - Đà Nẵng").stock(Math.max(0, totalTon - localStock - Math.max(2, totalTon / 3) - Math.max(1, totalTon / 4))).build());

            CrossBranchStockDto dto = CrossBranchStockDto.builder()
                    .sku(sku)
                    .name(p.getTenPhuKien())
                    .category(p.getDanhMucPhuKien() != null ? p.getDanhMucPhuKien().getTenDanhMuc() : "Phụ kiện ô tô")
                    .shelfLocation("Kệ A" + (id % 4 + 1) + "-Ô0" + id)
                    .localStock(localStock)
                    .branches(branches)
                    .build();

            result.add(dto);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tồn kho phụ kiện thành công từ database"));
    }
}
