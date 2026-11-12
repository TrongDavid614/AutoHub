package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.HinhAnhXe;
import com.autohub.core.car.entity.MauSac;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.HinhAnhXeRepository;
import com.autohub.core.car.repository.MauSacRepository;
import com.autohub.core.car.repository.PhienBanXeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer/cars")
@RequiredArgsConstructor
public class ShowroomCarController {

    private final PhienBanXeRepository phienBanXeRepository;
    private final HinhAnhXeRepository hinhAnhXeRepository;
    private final MauSacRepository mauSacRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getShowroomCars() {
        List<PhienBanXe> cars = phienBanXeRepository.findAll();
        List<Map<String, Object>> result = cars.stream().map(this::mapCarToDto).toList();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh mục xe showroom thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCarDetail(@PathVariable Long id) {
        return phienBanXeRepository.findById(id)
                .map(car -> ResponseEntity.ok(ApiResponse.ok(mapCarToDto(car), "Lấy chi tiết phiên bản xe thành công")))
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> mapCarToDto(PhienBanXe car) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", car.getId());
        dto.put("tenPhienBan", car.getTenPhienBan());
        dto.put("giaNiemYet", car.getGiaNiemYet());
        dto.put("mucTienCoc", car.getMucTienCoc());
        dto.put("namSanXuat", car.getNamSanXuat());
        dto.put("hopSo", car.getHopSo());
        dto.put("loaiNhienLieu", car.getLoaiNhienLieu());
        dto.put("soChoNgoi", car.getSoChoNgoi());
        dto.put("thongSoKyThuat", car.getThongSoKyThuat());
        dto.put("tamHoatDongKm", car.getTamHoatDongKm());
        dto.put("dungLuongPinKwh", car.getDungLuongPinKwh());
        dto.put("dangHoatDong", car.isDangHoatDong());
        dto.put("isDeleted", car.isDeleted());

        if (car.getDongXe() != null) {
            Map<String, Object> dongXeMap = new HashMap<>();
            dongXeMap.put("id", car.getDongXe().getId());
            dongXeMap.put("tenDongXe", car.getDongXe().getTenDongXe());
            dongXeMap.put("phanKhuc", car.getDongXe().getPhanKhuc());
            dongXeMap.put("xuatXu", car.getDongXe().getXuatXu());
            dongXeMap.put("moTa", car.getDongXe().getMoTa());
            if (car.getDongXe().getHangXe() != null) {
                Map<String, Object> hangXeMap = new HashMap<>();
                hangXeMap.put("id", car.getDongXe().getHangXe().getId());
                hangXeMap.put("tenHangXe", car.getDongXe().getHangXe().getTenHangXe());
                dongXeMap.put("hangXe", hangXeMap);
            }
            dto.put("dongXe", dongXeMap);
        }

        // Lấy danh sách hình ảnh từ database
        List<HinhAnhXe> images = hinhAnhXeRepository.findByPhienBanXeIdOrderByThuTuHienThiAsc(car.getId());
        List<String> imageUrls = images.stream().map(HinhAnhXe::getDuongDan).toList();
        dto.put("images", imageUrls);
        dto.put("image", !imageUrls.isEmpty() ? imageUrls.get(0) : "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200");

        // Lấy danh sách màu sắc từ database
        List<MauSac> colors = mauSacRepository.findAll();
        dto.put("colors", colors);

        return dto;
    }
}
