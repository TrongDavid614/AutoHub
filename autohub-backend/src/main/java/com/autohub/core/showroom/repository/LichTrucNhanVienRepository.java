package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.LichTrucNhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LichTrucNhanVienRepository extends JpaRepository<LichTrucNhanVien, Long> {
    List<LichTrucNhanVien> findByNhanVienId(Long nhanVienId);
    List<LichTrucNhanVien> findByShowroomIdAndNgayTruc(Long showroomId, LocalDate ngayTruc);
}
