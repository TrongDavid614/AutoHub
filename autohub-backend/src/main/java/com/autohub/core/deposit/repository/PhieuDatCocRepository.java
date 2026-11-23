package com.autohub.core.deposit.repository;

import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PhieuDatCocRepository extends JpaRepository<PhieuDatCoc, Long> {
    Optional<PhieuDatCoc> findByMaPhieuCoc(String maPhieuCoc);
    Optional<PhieuDatCoc> findTopByOrderByNgayDatCocDesc();
    Optional<PhieuDatCoc> findTopByNguoiDungIdOrderByNgayDatCocDesc(Long nguoiDungId);
    List<PhieuDatCoc> findByNguoiDungId(Long nguoiDungId);
    List<PhieuDatCoc> findByTrangThai(TrangThaiPhieuCoc trangThai);
    List<PhieuDatCoc> findByTrangThaiAndHanThanhToanBefore(TrangThaiPhieuCoc trangThai, LocalDateTime time);
    List<PhieuDatCoc> findByTrangThaiAndHanGiuXeBefore(TrangThaiPhieuCoc trangThai, LocalDateTime time);
    long countByTrangThai(TrangThaiPhieuCoc trangThai);
    long countByXeDinhDanhIsNullAndTrangThai(TrangThaiPhieuCoc trangThai);
}
