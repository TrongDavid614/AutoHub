package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.PhieuDieuChuyenPhuKien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuDieuChuyenPhuKienRepository extends JpaRepository<PhieuDieuChuyenPhuKien, Long> {
    List<PhieuDieuChuyenPhuKien> findAllByOrderByNgayTaoDesc();
}
