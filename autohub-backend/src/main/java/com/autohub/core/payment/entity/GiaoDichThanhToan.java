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
    private PhieuDatCoc phieuDatCoc; // Hoặc phiếu cọc

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_hang_id")
    private DonHangPhuKien donHangPhuKien; // Hoặc đơn hàng (DR35)

    @Column(name = "ma_tham_chieu", nullable = false, unique = true, length = 100)
    private String maThamChieu; // vnp_TxnRef hoặc sepay_reference_code

    @Column(name = "ma_giao_dich_vnpay", length = 100)
    private String maGiaoDichVnpay; // vnp_TransactionNo

    @Column(name = "ma_giao_dich_sepay", length = 100)
    private String maGiaoDichSepay; // Mã SePay trả về

    @Column(name = "loai_giao_dich", nullable = false, length = 30)
    @Builder.Default
    private String loaiGiaoDich = "DAT_COC_XE"; // DAT_COC_XE hoặc DON_HANG_PHU_KIEN

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

    @Column(name = "ma_ket_qua", length = 50)
    private String maKetQua; // Mã phản hồi kết quả giao dịch

    @Column(name = "du_lieu_webhook", columnDefinition = "NVARCHAR(MAX)")
    private String duLieuWebhook;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, length = 20)
    @Builder.Default
    private TrangThaiThanhToan trangThai = TrangThaiThanhToan.PENDING;

    public String getMaGiaoDichSePay() {
        return this.maGiaoDichSepay;
    }

    public void setMaGiaoDichSePay(String maGiaoDichSePay) {
        this.maGiaoDichSepay = maGiaoDichSePay;
    }
}
