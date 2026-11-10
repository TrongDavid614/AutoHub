package com.autohub.core.car.repository;

import com.autohub.core.car.entity.PhienBanXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhienBanXeRepository extends JpaRepository<PhienBanXe, Long> {
    List<PhienBanXe> findByDongXeId(Long dongXeId);

    @Query("SELECT p FROM PhienBanXe p LEFT JOIN FETCH p.dongXe d LEFT JOIN FETCH d.hangXe")
    List<PhienBanXe> findAllWithDetails();

    @Query("SELECT p FROM PhienBanXe p LEFT JOIN FETCH p.dongXe d LEFT JOIN FETCH d.hangXe WHERE p.id = :id")
    Optional<PhienBanXe> findByIdWithDetails(@Param("id") Long id);
}
