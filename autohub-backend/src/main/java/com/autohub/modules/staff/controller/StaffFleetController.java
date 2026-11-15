package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.enums.TrangThaiXeDemo;
import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.showroom.repository.XeDemoRepository;
import com.autohub.modules.staff.dto.DemoFleetCarDto;
import com.autohub.modules.staff.dto.ScheduleDemoMaintenanceRequest;
import com.autohub.modules.staff.dto.UpdateDemoOdoRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/staff/fleet")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffFleetController {

    private final XeDemoRepository xeDemoRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<DemoFleetCarDto>>> getDemoFleet() {
        List<XeDemo> list = xeDemoRepository.findAll();
        List<DemoFleetCarDto> result = new ArrayList<>();

        for (XeDemo d : list) {
            DemoFleetCarDto dto = DemoFleetCarDto.builder()
                    .id(String.valueOf(d.getId()))
                    .licensePlate(d.getBienSo())
                    .carModel(d.getPhienBanXe() != null ? d.getPhienBanXe().getTenPhienBan() : "Xe Demo AutoHub")
                    .currentOdo(d.getSoOdoHienTai() != null ? d.getSoOdoHienTai() : 0)
                    .status(d.getTrangThai() != null ? d.getTrangThai().name() : "SAN_SANG")
                    .lastMaintenanceDate(d.getNgayBaoDuongGanNhat() != null ? d.getNgayBaoDuongGanNhat().toString() : "-")
                    .nextMaintenanceDate(d.getNgayBaoDuongTiepTheo() != null ? d.getNgayBaoDuongTiepTheo().toString() : "-")
                    .build();
            result.add(dto);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đội xe Demo lái thử thành công từ database"));
    }

    @PutMapping("/{id}/odo")
    @Transactional
    public ResponseEntity<ApiResponse<String>> updateOdo(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDemoOdoRequest payload
    ) {
        Integer odo = payload.getNewOdo();
        XeDemo d = xeDemoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe Demo ID: " + id));

        d.setSoOdoHienTai(odo);
        xeDemoRepository.save(d);

        return ResponseEntity.ok(ApiResponse.ok("ODO_UPDATED", "Đã cập nhật chỉ số ODO mới: " + odo + " km"));
    }

    @PostMapping("/{id}/maintenance")
    @Transactional
    public ResponseEntity<ApiResponse<String>> scheduleMaintenance(
            @PathVariable Long id,
            @RequestBody(required = false) ScheduleDemoMaintenanceRequest payload
    ) {
        XeDemo d = xeDemoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe Demo ID: " + id));

        d.setTrangThai(TrangThaiXeDemo.BAO_DUONG);
        xeDemoRepository.save(d);

        return ResponseEntity.ok(ApiResponse.ok("SCHEDULED", "Đã lập phiếu bảo dưỡng kỹ thuật cho xe demo"));
    }
}
