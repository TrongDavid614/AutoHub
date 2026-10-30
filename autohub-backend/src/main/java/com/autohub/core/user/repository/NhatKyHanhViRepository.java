package com.autohub.core.user.repository;

import com.autohub.core.user.entity.NhatKyHanhVi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NhatKyHanhViRepository extends JpaRepository<NhatKyHanhVi, Long> {
    List<NhatKyHanhVi> findByMaPhien(String maPhien);
    List<NhatKyHanhVi> findByNguoiDungId(Long nguoiDungId);
}
