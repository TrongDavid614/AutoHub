package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.DonHangPhuKien;
import com.autohub.core.enums.TrangThaiDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonHangPhuKienRepository extends JpaRepository<DonHangPhuKien, Long> {
    Optional<DonHangPhuKien> findByMaDonHang(String maDonHang);
    List<DonHangPhuKien> findByNguoiDungId(Long nguoiDungId);
    List<DonHangPhuKien> findByTrangThai(TrangThaiDonHang trangThai);
}
