package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.TonKhoXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TonKhoXeRepository extends JpaRepository<TonKhoXe, Long> {
    List<TonKhoXe> findByShowroomId(Long showroomId);
    List<TonKhoXe> findByShowroomIdOrderByIdAsc(Long showroomId);
    Optional<TonKhoXe> findByPhienBanXeIdAndMauSacIdAndShowroomId(Long phienBanXeId, Long mauSacId, Long showroomId);

    @Query("SELECT COALESCE(SUM(t.soLuongKhaDung + t.soLuongDangGiuCho), 0) FROM TonKhoXe t WHERE t.showroom.id = :showroomId")
    Integer sumTotalPhysicalByShowroomId(@Param("showroomId") Long showroomId);

    @Query("SELECT COALESCE(SUM(t.soLuongDangGiuCho), 0) FROM TonKhoXe t WHERE t.showroom.id = :showroomId")
    Integer sumReservedByShowroomId(@Param("showroomId") Long showroomId);

    @Query("SELECT COALESCE(SUM(t.soLuongKhaDung + t.soLuongDangGiuCho), 0) FROM TonKhoXe t")
    Integer sumTotalPhysicalAllShowrooms();

    @Query("SELECT COALESCE(SUM(t.soLuongDangGiuCho), 0) FROM TonKhoXe t")
    Integer sumTotalReservedAllShowrooms();

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE TonKhoXe t SET t.soLuongDangGiuCho = CASE WHEN t.soLuongDangGiuCho > 0 THEN t.soLuongDangGiuCho - 1 ELSE 0 END, t.soLuongKhaDung = t.soLuongKhaDung + 1 WHERE t.id = :id")
    int releaseStockHold(@Param("id") Long id);

    long countByShowroomId(Long showroomId);
}
