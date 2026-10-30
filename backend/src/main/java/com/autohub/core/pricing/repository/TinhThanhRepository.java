package com.autohub.core.pricing.repository;

import com.autohub.core.pricing.entity.TinhThanh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TinhThanhRepository extends JpaRepository<TinhThanh, Long> {
}
