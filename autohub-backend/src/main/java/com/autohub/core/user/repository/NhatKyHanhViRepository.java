package com.autohub.core.user.repository;

import com.autohub.core.enums.LoaiHanhViTracking;
import com.autohub.core.user.entity.NhatKyHanhVi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NhatKyHanhViRepository extends JpaRepository<NhatKyHanhVi, Long> {
    List<NhatKyHanhVi> findByMaPhien(String maPhien);
    List<NhatKyHanhVi> findByNguoiDungId(Long nguoiDungId);
    long countByLoaiHanhVi(LoaiHanhViTracking loaiHanhVi);

    @Query("SELECT AVG(n.thoiGianDungXem) FROM NhatKyHanhVi n WHERE n.thoiGianDungXem > 0")
    Double findAverageDwellTime();

    @Query("SELECT n.maThucThe, COUNT(n) FROM NhatKyHanhVi n WHERE n.loaiThucThe = 'CAR' GROUP BY n.maThucThe ORDER BY COUNT(n) DESC")
    List<Object[]> findTopViewedCars();
}
