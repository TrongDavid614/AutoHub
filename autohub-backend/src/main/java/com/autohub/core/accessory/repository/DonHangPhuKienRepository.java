package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.enums.TrangThaiDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonHangPhuKienRepository extends JpaRepository<DonHangPhuKien, Long> {
    Optional<DonHangPhuKien> findByMaDonHang(String maDonHang);
    List<DonHangPhuKien> findByNguoiDungId(Long nguoiDungId);
    List<DonHangPhuKien> findByTrangThai(TrangThaiDonHang trangThai);

    @Query("SELECT d FROM DonHangPhuKien d " +
           "LEFT JOIN FETCH d.nguoiDung u " +
           "LEFT JOIN FETCH d.voucher v " +
           "WHERE (:nguoiDungId IS NULL OR u.id = :nguoiDungId) " +
           "ORDER BY d.ngayDat DESC")
    List<DonHangPhuKien> findAllWithDetails(@Param("nguoiDungId") Long nguoiDungId);
}
