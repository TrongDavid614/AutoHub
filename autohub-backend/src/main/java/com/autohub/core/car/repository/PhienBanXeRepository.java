package com.autohub.core.car.repository;

import com.autohub.core.car.entity.PhienBanXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhienBanXeRepository extends JpaRepository<PhienBanXe, Long> {
    List<PhienBanXe> findByDongXeId(Long dongXeId);
}
