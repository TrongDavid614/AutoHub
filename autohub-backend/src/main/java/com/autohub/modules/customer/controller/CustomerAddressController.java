package com.autohub.modules.customer.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.entity.SoDiaChi;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.core.user.repository.SoDiaChiRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer/addresses")
@RequiredArgsConstructor
public class CustomerAddressController {

    private final SoDiaChiRepository soDiaChiRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Getter
    @Setter
    public static class AddressRequestDto {
        private Long customerId;
        private String recipientName;
        private String phoneNumber;
        private String provinceCity;
        private String district;
        private String ward;
        private String detailedAddress;
        private Boolean isDefault;
        private String tag;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyAddresses(@RequestParam(required = false) Long customerId) {
        Long custId = customerId != null ? customerId : 5L;
        List<SoDiaChi> list = soDiaChiRepository.findByNguoiDungId(custId);
        if (list.isEmpty()) {
            list = soDiaChiRepository.findAll();
        }

        List<Map<String, Object>> result = list.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách sổ địa chỉ thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> addAddress(@RequestBody AddressRequestDto req) {
        Long custId = req.getCustomerId() != null ? req.getCustomerId() : 5L;
        NguoiDung user = nguoiDungRepository.findById(custId)
                .orElseGet(() -> nguoiDungRepository.findAll().stream().findFirst().orElse(null));

        boolean isDefault = Boolean.TRUE.equals(req.getIsDefault());
        if (isDefault) {
            unsetDefaultAddresses(custId);
        }

        SoDiaChi address = SoDiaChi.builder()
                .nguoiDung(user)
                .hoTenNguoiNhan(req.getRecipientName() != null ? req.getRecipientName() : "Khách hàng")
                .soDienThoai(req.getPhoneNumber() != null ? req.getPhoneNumber() : "0912345678")
                .tinhThanh(req.getProvinceCity() != null ? req.getProvinceCity() : "TP. Hồ Chí Minh")
                .quanHuyen(req.getDistrict() != null ? req.getDistrict() : "Quận 1")
                .phuongXa(req.getWard() != null ? req.getWard() : "Phường Bến Nghé")
                .diaChiChiTiet(req.getDetailedAddress() != null ? req.getDetailedAddress() : "")
                .macDinh(isDefault)
                .build();

        SoDiaChi saved = soDiaChiRepository.save(address);
        return ResponseEntity.ok(ApiResponse.ok(mapToDto(saved), "Thêm địa chỉ mới vào sổ địa chỉ thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateAddress(@PathVariable Long id, @RequestBody AddressRequestDto req) {
        SoDiaChi address = soDiaChiRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy địa chỉ ID: " + id));

        if (req.getRecipientName() != null) address.setHoTenNguoiNhan(req.getRecipientName());
        if (req.getPhoneNumber() != null) address.setSoDienThoai(req.getPhoneNumber());
        if (req.getProvinceCity() != null) address.setTinhThanh(req.getProvinceCity());
        if (req.getDistrict() != null) address.setQuanHuyen(req.getDistrict());
        if (req.getWard() != null) address.setPhuongXa(req.getWard());
        if (req.getDetailedAddress() != null) address.setDiaChiChiTiet(req.getDetailedAddress());

        if (Boolean.TRUE.equals(req.getIsDefault())) {
            unsetDefaultAddresses(address.getNguoiDung() != null ? address.getNguoiDung().getId() : 5L);
            address.setMacDinh(true);
        }

        SoDiaChi saved = soDiaChiRepository.save(address);
        return ResponseEntity.ok(ApiResponse.ok(mapToDto(saved), "Cập nhật địa chỉ giao hàng thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        soDiaChiRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Xóa địa chỉ thành công"));
    }

    @PostMapping("/{id}/default")
    public ResponseEntity<ApiResponse<Map<String, Object>>> setDefault(@PathVariable Long id) {
        SoDiaChi address = soDiaChiRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy địa chỉ ID: " + id));

        Long userId = address.getNguoiDung() != null ? address.getNguoiDung().getId() : 5L;
        unsetDefaultAddresses(userId);

        address.setMacDinh(true);
        SoDiaChi saved = soDiaChiRepository.save(address);
        return ResponseEntity.ok(ApiResponse.ok(mapToDto(saved), "Đã đặt làm địa chỉ mặc định"));
    }

    private void unsetDefaultAddresses(Long userId) {
        List<SoDiaChi> existing = soDiaChiRepository.findByNguoiDungId(userId);
        for (SoDiaChi addr : existing) {
            if (addr.isMacDinh()) {
                addr.setMacDinh(false);
                soDiaChiRepository.save(addr);
            }
        }
    }

    private Map<String, Object> mapToDto(SoDiaChi a) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", a.getId());
        map.put("userId", a.getNguoiDung() != null ? a.getNguoiDung().getId() : 5L);
        map.put("recipientName", a.getHoTenNguoiNhan());
        map.put("phoneNumber", a.getSoDienThoai());
        map.put("provinceCity", a.getTinhThanh());
        map.put("district", a.getQuanHuyen());
        map.put("ward", a.getPhuongXa());
        map.put("detailedAddress", a.getDiaChiChiTiet());
        map.put("isDefault", a.isMacDinh());
        map.put("tag", a.isMacDinh() ? "MẶC ĐỊNH" : "NHÀ RIÊNG");
        return map;
    }
}
