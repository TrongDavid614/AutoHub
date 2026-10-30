package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.DanhGia;
import com.autohub.core.enums.TrangThaiDanhGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Long> {
    List<DanhGia> findByPhuKienIdAndTrangThaiDuyet(Long phuKienId, TrangThaiDanhGia trangThaiDuyet);
}
