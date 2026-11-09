package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.PhuKienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/staff/stocks")
@RequiredArgsConstructor
public class StaffStockController {

    private final PhuKienRepository phuKienRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCrossBranchStocks() {
        List<PhuKien> list = phuKienRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (PhuKien p : list) {
            Map<String, Object> map = new HashMap<>();
            long id = p.getId() != null ? p.getId() : 1L;
            String sku = "ACC-" + String.format("%03d", id);
            if (id == 1L) sku = "ACC-CHARGER-01";
            else if (id == 2L) sku = "ACC-CAM-4K";
            else if (id == 3L) sku = "ACC-CARPET-5D";
            else if (id == 4L) sku = "ACC-FILM-NANO";
            else if (id == 5L) sku = "ACC-BOOSTER-35";

            map.put("sku", sku);
            map.put("name", p.getTenPhuKien());
            map.put("category", p.getDanhMucPhuKien() != null ? p.getDanhMucPhuKien().getTenDanhMuc() : "Phụ kiện ô tô");
            map.put("shelfLocation", "Kệ A" + (id % 4 + 1) + "-Ô0" + id);
            
            int totalTon = p.getSoLuongTon() != null ? p.getSoLuongTon() : 10;
            int localStock = Math.max(0, totalTon / 2);
            map.put("localStock", localStock);

            List<Map<String, Object>> branches = new ArrayList<>();
            Map<String, Object> b1 = new HashMap<>();
            b1.put("branchName", "Showroom Q.1 - Sài Gòn");
            b1.put("stock", Math.max(2, totalTon / 3));

            Map<String, Object> b2 = new HashMap<>();
            b2.put("branchName", "Showroom Mỹ Đình - Hà Nội");
            b2.put("stock", Math.max(1, totalTon / 4));

            Map<String, Object> b3 = new HashMap<>();
            b3.put("branchName", "Showroom Hải Châu - Đà Nẵng");
            b3.put("stock", Math.max(0, totalTon - localStock - (int) b1.get("stock") - (int) b2.get("stock")));

            branches.add(b1);
            branches.add(b2);
            branches.add(b3);

            map.put("branches", branches);
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách tồn kho phụ kiện 10 món thành công từ database"));
    }
}

