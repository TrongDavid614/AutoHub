package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.ChiTietDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Long> {
    List<ChiTietDonHang> findByDonHangId(Long donHangId);

    @Query("SELECT c FROM ChiTietDonHang c " +
           "LEFT JOIN FETCH c.phuKien pk " +
           "LEFT JOIN FETCH pk.danhMucPhuKien dm " +
           "WHERE c.donHang.id = :donHangId")
    List<ChiTietDonHang> findByDonHangIdWithDetails(@Param("donHangId") Long donHangId);

    @Query("SELECT c FROM ChiTietDonHang c " +
           "LEFT JOIN FETCH c.phuKien pk " +
           "LEFT JOIN FETCH pk.danhMucPhuKien dm " +
           "WHERE c.donHang.id IN :donHangIds")
    List<ChiTietDonHang> findByDonHangIdInWithDetails(@Param("donHangIds") List<Long> donHangIds);
}
