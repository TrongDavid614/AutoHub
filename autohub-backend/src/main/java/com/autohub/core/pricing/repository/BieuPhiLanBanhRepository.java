package com.autohub.core.pricing.repository;

import com.autohub.core.pricing.entity.BieuPhiLanBanh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BieuPhiLanBanhRepository extends JpaRepository<BieuPhiLanBanh, Long> {
    Optional<BieuPhiLanBanh> findByTinhThanhId(Long tinhThanhId);
    List<BieuPhiLanBanh> findAllByOrderByIdAsc();
    boolean existsByTinhThanhId(Long tinhThanhId);
    boolean existsByTinhThanhIdAndIdNot(Long tinhThanhId, Long id);
}
