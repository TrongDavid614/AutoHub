package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.DanhGia;
import com.autohub.core.enums.TrangThaiDanhGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Long> {
    List<DanhGia> findByPhuKienIdAndTrangThaiDuyet(Long phuKienId, TrangThaiDanhGia trangThaiDuyet);
    List<DanhGia> findByTrangThaiDuyet(TrangThaiDanhGia trangThaiDuyet);
    List<DanhGia> findAllByOrderByNgayDanhGiaDesc();
    long countByTrangThaiDuyet(TrangThaiDanhGia trangThaiDuyet);
    Optional<DanhGia> findByChiTietDonHangId(Long chiTietDonHangId);
    boolean existsByChiTietDonHangId(Long chiTietDonHangId);
}
