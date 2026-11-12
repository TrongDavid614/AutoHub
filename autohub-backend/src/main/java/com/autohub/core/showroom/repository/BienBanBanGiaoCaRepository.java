package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.BienBanBanGiaoCa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BienBanBanGiaoCaRepository extends JpaRepository<BienBanBanGiaoCa, Long> {
    Optional<BienBanBanGiaoCa> findByMaBanGiao(String maBanGiao);
    List<BienBanBanGiaoCa> findByShowroomId(Long showroomId);
}
