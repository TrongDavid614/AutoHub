package com.autohub.modules.staff.controller;

import com.autohub.common.dto.ApiResponse;
import com.autohub.core.accessory.entity.ChiTietDonHang;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.accessory.entity.PhuKien;
import com.autohub.core.accessory.repository.ChiTietDonHangRepository;
import com.autohub.core.accessory.repository.DonHangPhuKienRepository;
import com.autohub.core.enums.TrangThaiDonHang;
import com.autohub.core.showroom.entity.TonKhoPhuKienShowroom;
import com.autohub.core.showroom.repository.TonKhoPhuKienShowroomRepository;
import com.autohub.core.user.entity.NguoiDung;
import com.autohub.core.user.repository.NguoiDungRepository;
import com.autohub.modules.staff.dto.HandoverCourierRequest;
import com.autohub.modules.staff.dto.OrderItemDto;
import com.autohub.modules.staff.dto.StaffFulfillmentOrderDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/staff/fulfillment")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@RequiredArgsConstructor
public class StaffFulfillmentController {

    private final DonHangPhuKienRepository orderRepository;
    private final ChiTietDonHangRepository orderItemRepository;
    private final TonKhoPhuKienShowroomRepository tonKhoPhuKienShowroomRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<StaffFulfillmentOrderDto>>> getFulfillmentOrders(Authentication authentication) {
        Long staffShowroomId = resolveStaffShowroomId(authentication);

        List<DonHangPhuKien> list = new ArrayList<>(orderRepository.findAll());
        list.sort(Comparator.comparing(
                DonHangPhuKien::getNgayDat,
                Comparator.nullsLast(Comparator.reverseOrder())
        ).thenComparing(DonHangPhuKien::getId, Comparator.reverseOrder()));

        List<StaffFulfillmentOrderDto> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (DonHangPhuKien o : list) {
            if (o.getTrangThai() == TrangThaiDonHang.PENDING_PAYMENT
                    || o.getTrangThai() == TrangThaiDonHang.CANCELLED
                    || o.getTrangThai() == TrangThaiDonHang.REFUND_REQUIRED
                    || o.getTrangThai() == TrangThaiDonHang.RETURNED) {
                continue;
            }

            String status = "NEED_PACK";
            if (o.getTrangThai() == TrangThaiDonHang.DELIVERED || o.getTrangThai() == TrangThaiDonHang.SHIPPING) {
                status = "SHIPPED";
            } else if (o.getTrangThai() == TrangThaiDonHang.PROCESSING) {
                status = "PACKING";
            }

            List<ChiTietDonHang> ctdhList = orderItemRepository.findByDonHangId(o.getId());
            List<OrderItemDto> items = new ArrayList<>();
            for (ChiTietDonHang c : ctdhList) {
                PhuKien pk = c.getPhuKien();
                String sku = pk != null ? formatDefaultSku(pk.getId()) : "ACC-UNKNOWN";
                String shelfLocation = (pk != null && pk.getQuyCachLapDat() != null && !pk.getQuyCachLapDat().isBlank())
                        ? pk.getQuyCachLapDat()
                        : "Kho phụ kiện trung tâm";

                if (pk != null) {
                    try {
                        Optional<TonKhoPhuKienShowroom> srStock = staffShowroomId != null
                                ? tonKhoPhuKienShowroomRepository.findByPhuKienIdAndShowroomId(pk.getId(), staffShowroomId)
                                : tonKhoPhuKienShowroomRepository.findByPhuKienId(pk.getId()).stream().findFirst();
                        if (srStock.isPresent()) {
                            if (srStock.get().getMaSku() != null && !srStock.get().getMaSku().isBlank()) {
                                sku = srStock.get().getMaSku();
                            }
                            if (srStock.get().getViTriKe() != null && !srStock.get().getViTriKe().isBlank()) {
                                shelfLocation = srStock.get().getViTriKe();
                            }
                        }
                    } catch (Exception ignored) {
                        // Graceful fallback if ton_kho_phu_kien_showroom table is not yet migrated
                    }
                }

                OrderItemDto itemDto = OrderItemDto.builder()
                        .sku(sku)
                        .name(pk != null ? pk.getTenPhuKien() : "Phụ kiện AutoHub")
                        .quantity(c.getSoLuong())
                        .price(c.getDonGia() != null ? c.getDonGia().doubleValue() : 0.0)
                        .shelfLocation(shelfLocation)
                        .build();
                items.add(itemDto);
            }

            StaffFulfillmentOrderDto orderDto = StaffFulfillmentOrderDto.builder()
                    .id(String.valueOf(o.getId()))
                    .orderCode(o.getMaDonHang() != null ? o.getMaDonHang() : "#AH-ACC-" + o.getId())
                    .customerName(o.getHoTenNguoiNhan() != null ? o.getHoTenNguoiNhan() : "Khách hàng")
                    .customerPhone(o.getSoDienThoaiNhan() != null ? o.getSoDienThoaiNhan() : "")
                    .shippingAddress(o.getDiaChiGiaoHang() != null ? o.getDiaChiGiaoHang() : "-")
                    .paymentMethod(o.getPhuongThucThanhToan() != null ? o.getPhuongThucThanhToan().name() : null)
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

        if (order.getTrangThai() == TrangThaiDonHang.PENDING_PAYMENT) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng chưa hoàn tất thanh toán, chưa thể đóng gói"));
        }
        if (order.getTrangThai() == TrangThaiDonHang.CANCELLED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể đóng gói đơn hàng đã bị hủy"));
        }
        if (order.getTrangThai() == TrangThaiDonHang.PROCESSING) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng này đang ở trạng thái Đang đóng gói"));
        }
        if (order.getTrangThai() == TrangThaiDonHang.SHIPPING || order.getTrangThai() == TrangThaiDonHang.DELIVERED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng này đã được bàn giao xuất kho vận chuyển"));
        }

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

        if (order.getTrangThai() == TrangThaiDonHang.PENDING_PAYMENT) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể bàn giao đơn hàng chưa thanh toán"));
        }
        if (order.getTrangThai() == TrangThaiDonHang.CANCELLED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể bàn giao đơn hàng đã bị hủy"));
        }
        if (order.getTrangThai() == TrangThaiDonHang.DELIVERED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng này đã giao thành công trước đó"));
        }
        if (order.getTrangThai() == TrangThaiDonHang.SHIPPING) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Đơn hàng này đã được bàn giao vận chuyển trước đó"));
        }
        if (payload.getTrackingNumber() == null || payload.getTrackingNumber().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng nhập mã vận đơn trước khi bàn giao vận chuyển"));
        }

        order.setTrangThai(TrangThaiDonHang.SHIPPING);
        order.setDonViVanChuyen(payload.getCourier().trim());
        order.setMaVanDon(payload.getTrackingNumber().trim());
        order.setNgayGiaoHang(LocalDateTime.now());
        orderRepository.save(order);

        return ResponseEntity.ok(ApiResponse.ok(
                "SHIPPED",
                "Đã bàn giao đơn hàng " + order.getMaDonHang() + " cho bưu tá vận chuyển: " + payload.getCourier()
        ));
    }

    private Long resolveStaffShowroomId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return nguoiDungRepository.findByEmail(authentication.getName())
                .map(NguoiDung::getShowroom)
                .map(s -> s.getId())
                .orElse(null);
    }

    private String formatDefaultSku(Long id) {
        if (id == null) return "ACC-000";
        if (id == 1L) return "ACC-CHARGER-01";
        if (id == 2L) return "ACC-CAM-4K";
        if (id == 3L) return "ACC-CARPET-5D";
        if (id == 4L) return "ACC-FILM-NANO";
        if (id == 5L) return "ACC-BOOSTER-35";
        return "ACC-" + String.format("%03d", id);
    }
}
