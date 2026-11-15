package com.autohub.core.pricing.repository;

import com.autohub.core.pricing.entity.GoiVayNganHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoiVayNganHangRepository extends JpaRepository<GoiVayNganHang, Long> {
    List<GoiVayNganHang> findAllByOrderByIdAsc();
    List<GoiVayNganHang> findByDangHoatDongTrueOrderByIdAsc();
    boolean existsByTenNganHangIgnoreCase(String tenNganHang);
    boolean existsByTenNganHangIgnoreCaseAndIdNot(String tenNganHang, Long id);
}
