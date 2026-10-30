package com.autohub.core.car.repository;

import com.autohub.core.car.entity.DongXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DongXeRepository extends JpaRepository<DongXe, Long> {
    List<DongXe> findByHangXeId(Long hangXeId);
}
