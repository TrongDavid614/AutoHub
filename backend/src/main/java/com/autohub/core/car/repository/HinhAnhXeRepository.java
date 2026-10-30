package com.autohub.core.car.repository;

import com.autohub.core.car.entity.HinhAnhXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HinhAnhXeRepository extends JpaRepository<HinhAnhXe, Long> {
    List<HinhAnhXe> findByPhienBanXeIdOrderByThuTuHienThiAsc(Long phienBanXeId);
}
