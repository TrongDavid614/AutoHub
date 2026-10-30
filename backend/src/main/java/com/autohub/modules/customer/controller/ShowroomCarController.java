package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.car.entity.PhienBanXe;
import com.autohub.core.car.repository.PhienBanXeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer/cars")
@RequiredArgsConstructor
public class ShowroomCarController {

    private final PhienBanXeRepository phienBanXeRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PhienBanXe>>> getShowroomCars() {
        List<PhienBanXe> cars = phienBanXeRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(cars, "Lấy danh mục xe showroom thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PhienBanXe>> getCarDetail(@PathVariable Long id) {
        return phienBanXeRepository.findById(id)
                .map(car -> ResponseEntity.ok(ApiResponse.ok(car, "Lấy chi tiết phiên bản xe thành công")))
                .orElse(ResponseEntity.notFound().build());
    }
}
