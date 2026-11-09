package com.autohub.core.payment.repository;

import com.autohub.core.payment.entity.GiaoDichThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GiaoDichThanhToanRepository extends JpaRepository<GiaoDichThanhToan, Long> {
    Optional<GiaoDichThanhToan> findByMaThamChieu(String maThamChieu);
    Optional<GiaoDichThanhToan> findByMaGiaoDichVnpay(String maGiaoDichVnpay);
    List<GiaoDichThanhToan> findByPhieuDatCocId(Long phieuDatCocId);
    List<GiaoDichThanhToan> findByDonHangPhuKienId(Long donHangId);
}
