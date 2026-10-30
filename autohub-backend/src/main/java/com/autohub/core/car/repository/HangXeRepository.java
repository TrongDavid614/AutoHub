package com.autohub.core.car.repository;

import com.autohub.core.car.entity.HangXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HangXeRepository extends JpaRepository<HangXe, Long> {
}
