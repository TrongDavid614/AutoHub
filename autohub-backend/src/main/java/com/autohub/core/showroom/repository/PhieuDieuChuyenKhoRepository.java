package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.PhieuDieuChuyenKho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhieuDieuChuyenKhoRepository extends JpaRepository<PhieuDieuChuyenKho, Long> {
    Optional<PhieuDieuChuyenKho> findByMaPhieuChuyen(String maPhieuChuyen);
    List<PhieuDieuChuyenKho> findByShowroomXuatId(Long showroomXuatId);
    List<PhieuDieuChuyenKho> findByShowroomNhapId(Long showroomNhapId);
}
