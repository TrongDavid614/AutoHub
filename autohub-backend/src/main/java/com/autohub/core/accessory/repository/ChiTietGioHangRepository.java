package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.ChiTietGioHang;
import com.autohub.core.accessory.entity.ChiTietGioHangId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietGioHangRepository extends JpaRepository<ChiTietGioHang, ChiTietGioHangId> {
    List<ChiTietGioHang> findByGioHangId(Long gioHangId);
}
