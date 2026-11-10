package com.autohub.core.deposit.repository;

import com.autohub.core.deposit.entity.PhieuDatCoc;
import com.autohub.core.enums.TrangThaiPhieuCoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhieuDatCocRepository extends JpaRepository<PhieuDatCoc, Long> {
    Optional<PhieuDatCoc> findByMaPhieuCoc(String maPhieuCoc);
    List<PhieuDatCoc> findByNguoiDungId(Long nguoiDungId);
    List<PhieuDatCoc> findByTrangThai(TrangThaiPhieuCoc trangThai);

    @Query("SELECT p FROM PhieuDatCoc p " +
           "LEFT JOIN FETCH p.nguoiDung u " +
           "LEFT JOIN FETCH p.tonKhoXe tk " +
           "LEFT JOIN FETCH tk.phienBanXe pb " +
           "LEFT JOIN FETCH pb.dongXe d " +
           "LEFT JOIN FETCH tk.mauSac ms " +
           "LEFT JOIN FETCH tk.showroom sr " +
           "LEFT JOIN FETCH p.xeDinhDanh xd " +
           "WHERE (:nguoiDungId IS NULL OR u.id = :nguoiDungId) " +
           "ORDER BY p.ngayDatCoc DESC")
    List<PhieuDatCoc> findAllWithDetails(@Param("nguoiDungId") Long nguoiDungId);
}
