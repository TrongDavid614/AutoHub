package com.autohub.core.car.repository;

import com.autohub.core.car.entity.XeDinhDanh;
import com.autohub.core.enums.TrangThaiXeVIN;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XeDinhDanhRepository extends JpaRepository<XeDinhDanh, String> {
    List<XeDinhDanh> findByTrangThai(TrangThaiXeVIN trangThai);
}
