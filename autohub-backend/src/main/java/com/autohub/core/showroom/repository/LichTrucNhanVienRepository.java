package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.LichTrucNhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LichTrucNhanVienRepository extends JpaRepository<LichTrucNhanVien, Long> {
    List<LichTrucNhanVien> findByNhanVienId(Long nhanVienId);
    List<LichTrucNhanVien> findByShowroomIdAndNgayTruc(Long showroomId, LocalDate ngayTruc);
    List<LichTrucNhanVien> findByNgayTrucBetweenOrderByNgayTrucAsc(LocalDate start, LocalDate end);
    List<LichTrucNhanVien> findByShowroomIdAndNgayTrucBetweenOrderByNgayTrucAsc(Long showroomId, LocalDate start, LocalDate end);
    List<LichTrucNhanVien> findByNhanVienIdAndNgayTrucBetweenOrderByNgayTrucAsc(Long nhanVienId, LocalDate start, LocalDate end);

    boolean existsByNhanVienIdAndNgayTrucAndCaTruc(Long nhanVienId, LocalDate ngayTruc, String caTruc);
    boolean existsByNhanVienIdAndNgayTrucAndCaTrucAndIdNot(Long nhanVienId, LocalDate ngayTruc, String caTruc, Long id);

    Optional<LichTrucNhanVien> findByNhanVienIdAndNgayTrucAndCaTruc(Long nhanVienId, LocalDate ngayTruc, String caTruc);

    long countByNgayTrucBetween(LocalDate start, LocalDate end);
    long countByShowroomIdAndNgayTrucBetween(Long showroomId, LocalDate start, LocalDate end);

    @Modifying
    @Query("DELETE FROM LichTrucNhanVien l WHERE l.showroom.id = :showroomId AND l.ngayTruc BETWEEN :start AND :end")
    void deleteByShowroomIdAndNgayTrucBetween(@Param("showroomId") Long showroomId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Modifying
    @Query("DELETE FROM LichTrucNhanVien l WHERE l.ngayTruc BETWEEN :start AND :end")
    void deleteByNgayTrucBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
