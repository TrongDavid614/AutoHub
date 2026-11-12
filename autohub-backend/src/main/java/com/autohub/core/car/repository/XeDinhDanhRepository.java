package com.autohub.core.car.repository;

import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.enums.TrangThaiXeVIN;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface XeDinhDanhRepository extends JpaRepository<XeDinhDanh, Long> {
    Optional<XeDinhDanh> findBySoKhungVIN(String soKhungVIN);
    List<XeDinhDanh> findByTrangThai(TrangThaiXeVIN trangThai);
}
