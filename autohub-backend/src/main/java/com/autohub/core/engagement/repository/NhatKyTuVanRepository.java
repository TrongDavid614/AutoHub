package com.autohub.core.engagement.repository;

import com.autohub.core.engagement.entity.NhatKyTuVan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NhatKyTuVanRepository extends JpaRepository<NhatKyTuVan, Long> {
    List<NhatKyTuVan> findByYeuCauTuVanId(Long yeuCauTuVanId);
    List<NhatKyTuVan> findByNhanVienId(Long nhanVienId);

    @Query("SELECT COUNT(n) FROM NhatKyTuVan n WHERE n.thoiGianTuongTac >= :startOfDay")
    long countTodayConsultations(@Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT AVG(n.thoiGianPhanHoiMs) FROM NhatKyTuVan n WHERE n.thoiGianPhanHoiMs > 0")
    Double getAverageResponseTimeMs();
}
