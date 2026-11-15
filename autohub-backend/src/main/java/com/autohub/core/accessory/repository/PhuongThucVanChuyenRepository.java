package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.PhuongThucVanChuyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhuongThucVanChuyenRepository extends JpaRepository<PhuongThucVanChuyen, Long> {

    List<PhuongThucVanChuyen> findByDangHoatDongTrueAndIsDeletedFalseOrderByThuTuAsc();

    Optional<PhuongThucVanChuyen> findByMaPhuongThucIgnoreCase(String maPhuongThuc);
}
