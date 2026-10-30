package com.autohub.core.pricing.repository;

import com.autohub.core.pricing.entity.ChuongTrinhKhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChuongTrinhKhuyenMaiRepository extends JpaRepository<ChuongTrinhKhuyenMai, Long> {
}
