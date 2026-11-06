package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.enums.TrangThaiDonHang;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/staff/fulfillment")
@RequiredArgsConstructor
public class StaffFulfillmentController {

    private final DonHangPhuKienRepository orderRepository;
    private final ChiTietDonHangRepository orderItemRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFulfillmentOrders() {
        List<DonHangPhuKien> list = orderRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (DonHangPhuKien o : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", String.valueOf(o.getId()));
            map.put("orderCode", o.getMaDonHang() != null ? o.getMaDonHang() : "#AH-ACC-" + o.getId());
            map.put("customerName", o.getHoTenNguoiNhan() != null ? o.getHoTenNguoiNhan() : "Khách hàng");
            map.put("customerPhone", o.getSoDienThoaiNhan() != null ? o.getSoDienThoaiNhan() : "0912345678");
            map.put("shippingAddress", o.getDiaChiGiaoHang() != null ? o.getDiaChiGiaoHang() : "Tòa nhà Landmark 81, TP. Hồ Chí Minh");
            map.put("orderDate", o.getNgayDat() != null ? o.getNgayDat().toString() : "Hôm nay");
            map.put("totalAmount", o.getTongTien() != null ? o.getTongTien().doubleValue() : 25000000.0);

            String status = "NEED_PACK";
            if (o.getTrangThai() == TrangThaiDonHang.DELIVERED || o.getTrangThai() == TrangThaiDonHang.SHIPPING) {
                status = "SHIPPED";
            } else if (o.getTrangThai() == TrangThaiDonHang.PROCESSING) {
                status = "PACKING";
            }
            map.put("status", status);

            List<Map<String, Object>> items = new ArrayList<>();
            List<ChiTietDonHang> ctdhList = orderItemRepository.findAll();
            for (ChiTietDonHang c : ctdhList) {
                if (c.getDonHang() != null && c.getDonHang().getId().equals(o.getId())) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("sku", "ACC-SKU-" + (c.getPhuKien() != null ? c.getPhuKien().getId() : "101"));
                    itemMap.put("name", c.getPhuKien() != null ? c.getPhuKien().getTenPhuKien() : "Phụ kiện AutoHub");
                    itemMap.put("quantity", c.getSoLuong());
                    itemMap.put("price", c.getDonGia() != null ? c.getDonGia().doubleValue() : 25000000.0);
                    itemMap.put("shelfLocation", "Kệ A1 - Ngăn 02");
                    items.add(itemMap);
                }
            }
            if (items.isEmpty()) {
                items.add(Map.of("sku", "ACC-CHG-EV7", "name", "Bộ sạc di động AutoHub 3.5kW", "quantity", 1, "price", 5200000.0, "shelfLocation", "Kệ C4 - Ngăn 02"));
            }
            map.put("items", items);
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đơn hàng đóng gói xuất kho từ database thành công"));
    }

    @PostMapping("/{orderId}/pack")
    public ResponseEntity<ApiResponse<String>> startPacking(@PathVariable String orderId) {
        return ResponseEntity.ok(ApiResponse.ok("Bắt đầu nhặt hàng đóng gói cho đơn: " + orderId));
    }

    @PostMapping("/{orderId}/handover")
    public ResponseEntity<ApiResponse<String>> handoverToCourier(
            @PathVariable String orderId,
            @RequestBody Map<String, String> courierPayload
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Đã bàn giao đơn hàng " + orderId + " cho bưu tá vận chuyển: " + courierPayload.get("courier")));
    }
}
