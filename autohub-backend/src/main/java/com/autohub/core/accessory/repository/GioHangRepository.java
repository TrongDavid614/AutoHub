package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GioHangRepository extends JpaRepository<GioHang, Long> {
    Optional<GioHang> findByNguoiDungId(Long nguoiDungId);
}
