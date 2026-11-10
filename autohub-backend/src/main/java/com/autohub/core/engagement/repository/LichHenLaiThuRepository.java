package com.autohub.core.engagement.repository;

import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.enums.TrangThaiLichHen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LichHenLaiThuRepository extends JpaRepository<LichHenLaiThu, Long> {

    List<LichHenLaiThu> findByNguoiDungId(Long nguoiDungId);

    List<LichHenLaiThu> findByTrangThai(TrangThaiLichHen trangThai);

    @Query("SELECT l FROM LichHenLaiThu l " +
           "LEFT JOIN FETCH l.phienBanXe pb " +
           "LEFT JOIN FETCH pb.dongXe dx " +
           "LEFT JOIN FETCH l.showroom sr " +
           "LEFT JOIN FETCH l.xeDemo xd " +
           "LEFT JOIN FETCH l.nguoiDung nd " +
           "WHERE l.nguoiDung.id = :nguoiDungId " +
           "ORDER BY l.thoiGianHen DESC")
    List<LichHenLaiThu> findAllWithDetails(@Param("nguoiDungId") Long nguoiDungId);

    @Query("SELECT l FROM LichHenLaiThu l " +
           "LEFT JOIN FETCH l.phienBanXe pb " +
           "LEFT JOIN FETCH pb.dongXe dx " +
           "LEFT JOIN FETCH l.showroom sr " +
           "LEFT JOIN FETCH l.xeDemo xd " +
           "LEFT JOIN FETCH l.nguoiDung nd " +
           "ORDER BY l.thoiGianHen DESC")
    List<LichHenLaiThu> findAllWithDetails();

    @Query("SELECT l FROM LichHenLaiThu l " +
           "LEFT JOIN FETCH l.phienBanXe pb " +
           "LEFT JOIN FETCH pb.dongXe dx " +
           "LEFT JOIN FETCH l.showroom sr " +
           "LEFT JOIN FETCH l.xeDemo xd " +
           "LEFT JOIN FETCH l.nguoiDung nd " +
           "WHERE l.id = :id")
    Optional<LichHenLaiThu> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT l FROM LichHenLaiThu l " +
           "WHERE l.nguoiDung.id = :nguoiDungId AND l.trangThai = :trangThai")
    List<LichHenLaiThu> findPendingByNguoiDungId(
            @Param("nguoiDungId") Long nguoiDungId,
            @Param("trangThai") TrangThaiLichHen trangThai
    );

    @Query("SELECT l FROM LichHenLaiThu l " +
           "WHERE l.trangThai NOT IN (:excludedStatuses) " +
           "AND l.thoiGianHen = :thoiGianHen " +
           "AND (:phienBanId IS NULL OR l.phienBanXe.id = :phienBanId)")
    List<LichHenLaiThu> findConflictingAppointments(
            @Param("thoiGianHen") LocalDateTime thoiGianHen,
            @Param("phienBanId") Long phienBanId,
            @Param("excludedStatuses") List<TrangThaiLichHen> excludedStatuses
    );

    @Query("SELECT l FROM LichHenLaiThu l " +
           "WHERE l.trangThai NOT IN (:excludedStatuses) " +
           "AND l.nguoiDung.id = :nguoiDungId " +
           "AND l.thoiGianHen = :thoiGianHen")
    List<LichHenLaiThu> findUserConflictingAppointments(
            @Param("nguoiDungId") Long nguoiDungId,
            @Param("thoiGianHen") LocalDateTime thoiGianHen,
            @Param("excludedStatuses") List<TrangThaiLichHen> excludedStatuses
    );

    @Query("SELECT l FROM LichHenLaiThu l " +
           "WHERE l.trangThai NOT IN (:excludedStatuses) " +
           "AND l.thoiGianHen >= :startOfDay AND l.thoiGianHen <= :endOfDay")
    List<LichHenLaiThu> findActiveAppointmentsOnDate(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay,
            @Param("excludedStatuses") List<TrangThaiLichHen> excludedStatuses
    );
}
