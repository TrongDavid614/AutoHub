package com.autohub.core.payment.entity;

import com.autohub.common.entity.BaseEntity;
import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.enums.PhuongThucThanhToan;
import com.autohub.core.enums.TrangThaiThanhToan;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "giao_dich_thanh_toan")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GiaoDichThanhToan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phieu_dat_coc_id")
    private PhieuDatCoc phieuDatCoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_hang_id")
    private DonHangPhuKien donHangPhuKien;

    @Column(name = "ma_tham_chieu", nullable = false, unique = true, length = 64)
    private String maThamChieu; // vnp_TxnRef

    @Column(name = "ma_giao_dich_vnpay", length = 64)
    private String maGiaoDichVnpay; // vnp_TransactionNo

    @Column(name = "loai_giao_dich", nullable = false, length = 20)
    @Builder.Default
    private String loaiGiaoDich = "THANH_TOAN"; // THANH_TOAN hoặc HOAN_TIEN

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc", nullable = false, length = 10)
    @Builder.Default
    private PhuongThucThanhToan phuongThuc = PhuongThucThanhToan.VNPAY;

    @Column(name = "so_tien", nullable = false, precision = 18, scale = 0)
    private BigDecimal soTien;

    @Column(name = "thoi_gian_khoi_tao", nullable = false)
    @Builder.Default
    private LocalDateTime thoiGianKhoiTao = LocalDateTime.now();

    @Column(name = "thoi_gian_thanh_toan")
    private LocalDateTime thoiGianThanhToan;

    @Column(name = "ma_ket_qua", length = 10)
    private String maKetQua; // vnp_ResponseCode (00 là thành công)

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiThanhToan trangThai = TrangThaiThanhToan.PENDING;
}
