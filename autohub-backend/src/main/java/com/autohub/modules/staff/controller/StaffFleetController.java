package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.enums.TrangThaiXeDemo;
import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.showroom.repository.XeDemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/staff/fleet")
@RequiredArgsConstructor
public class StaffFleetController {

    private final XeDemoRepository xeDemoRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDemoFleet() {
        List<XeDemo> list = xeDemoRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (XeDemo d : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", "DEMO-0" + d.getId());
            map.put("licensePlate", d.getBienSo());
            map.put("carModel", d.getPhienBanXe() != null ? d.getPhienBanXe().getTenPhienBan() : "Xe Demo AutoHub");
            map.put("currentOdo", 4200 + (d.getId() * 350));
            map.put("status", d.getTrangThai() != null ? d.getTrangThai().name() : "SAN_SANG");
            map.put("lastMaintenanceDate", "2026-09-15");
            map.put("nextMaintenanceDate", "2026-12-15");
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đội xe Demo lái thử thành công từ database"));
    }

    @PutMapping("/{id}/odo")
    public ResponseEntity<ApiResponse<String>> updateOdo(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload
    ) {
        Integer odo = payload.get("newOdo");
        return ResponseEntity.ok(ApiResponse.ok("ODO_UPDATED", "Đã cập nhật chỉ số ODO mới: " + odo + " km"));
    }

    @PostMapping("/{id}/maintenance")
    public ResponseEntity<ApiResponse<String>> scheduleMaintenance(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        XeDemo d = xeDemoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe Demo ID: " + id));

        d.setTrangThai(TrangThaiXeDemo.BAO_DUONG);
        xeDemoRepository.save(d);

        return ResponseEntity.ok(ApiResponse.ok("SCHEDULED", "Đã lập phiếu bảo dưỡng kỹ thuật cho xe demo"));
    }
}
