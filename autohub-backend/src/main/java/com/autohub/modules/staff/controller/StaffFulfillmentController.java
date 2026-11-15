package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.modules.staff.dto.HandoverCourierRequest;
import com.autohub.modules.staff.dto.OrderItemDto;
import com.autohub.modules.staff.dto.StaffFulfillmentOrderDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/staff/fulfillment")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffFulfillmentController {

    private final DonHangPhuKienRepository orderRepository;
    private final ChiTietDonHangRepository orderItemRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffFulfillmentOrderDto>>> getFulfillmentOrders() {
        List<DonHangPhuKien> list = orderRepository.findAll();
        List<StaffFulfillmentOrderDto> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (DonHangPhuKien o : list) {
            String status = "NEED_PACK";
            if (o.getTrangThai() == TrangThaiDonHang.DELIVERED || o.getTrangThai() == TrangThaiDonHang.SHIPPING) {
                status = "SHIPPED";
            } else if (o.getTrangThai() == TrangThaiDonHang.PROCESSING) {
                status = "PACKING";
            }

            // Truy vấn trực tiếp các chi tiết đơn hàng của đơn này (tránh N+1 quét full bảng)
            List<ChiTietDonHang> ctdhList = orderItemRepository.findByDonHangId(o.getId());
            List<OrderItemDto> items = new ArrayList<>();
            for (ChiTietDonHang c : ctdhList) {
                OrderItemDto itemDto = OrderItemDto.builder()
                        .sku("ACC-SKU-" + (c.getPhuKien() != null ? c.getPhuKien().getId() : "101"))
                        .name(c.getPhuKien() != null ? c.getPhuKien().getTenPhuKien() : "Phụ kiện AutoHub")
                        .quantity(c.getSoLuong())
                        .price(c.getDonGia() != null ? c.getDonGia().doubleValue() : 0.0)
                        .shelfLocation("Kệ A1 - Ngăn 02")
                        .build();
                items.add(itemDto);
            }

            StaffFulfillmentOrderDto orderDto = StaffFulfillmentOrderDto.builder()
                    .id(String.valueOf(o.getId()))
                    .orderCode(o.getMaDonHang() != null ? o.getMaDonHang() : "#AH-ACC-" + o.getId())
                    .customerName(o.getHoTenNguoiNhan() != null ? o.getHoTenNguoiNhan() : "Khách hàng")
                    .customerPhone(o.getSoDienThoaiNhan() != null ? o.getSoDienThoaiNhan() : "")
                    .shippingAddress(o.getDiaChiGiaoHang() != null ? o.getDiaChiGiaoHang() : "-")
                    .orderDate(o.getNgayDat() != null ? o.getNgayDat().format(fmt) : "-")
                    .totalAmount(o.getTongTien() != null ? o.getTongTien().doubleValue() : 0.0)
                    .status(status)
                    .items(items)
                    .courier(o.getDonViVanChuyen())
                    .trackingNumber(o.getMaVanDon())
                    .build();

            result.add(orderDto);
        }

        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách đơn hàng đóng gói xuất kho từ database thành công"));
    }

    @PostMapping("/{orderId}/pack")
    @Transactional
    public ResponseEntity<ApiResponse<String>> startPacking(@PathVariable Long orderId) {
        DonHangPhuKien order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        order.setTrangThai(TrangThaiDonHang.PROCESSING);
        orderRepository.save(order);

        return ResponseEntity.ok(ApiResponse.ok(
                "PACKING",
                "Đã cập nhật trạng thái đơn hàng " + order.getMaDonHang() + " sang Đang đóng gói"
        ));
    }

    @PostMapping("/{orderId}/handover")
    @Transactional
    public ResponseEntity<ApiResponse<String>> handoverToCourier(
            @PathVariable Long orderId,
            @Valid @RequestBody HandoverCourierRequest payload
    ) {
        DonHangPhuKien order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        order.setTrangThai(TrangThaiDonHang.SHIPPING);
        order.setDonViVanChuyen(payload.getCourier());
        if (payload.getTrackingNumber() != null && !payload.getTrackingNumber().isBlank()) {
            order.setMaVanDon(payload.getTrackingNumber().trim());
        }
        order.setNgayGiaoHang(LocalDateTime.now());
        orderRepository.save(order);

        return ResponseEntity.ok(ApiResponse.ok(
                "SHIPPED",
                "Đã bàn giao đơn hàng " + order.getMaDonHang() + " cho bưu tá vận chuyển: " + payload.getCourier()
        ));
    }
}
