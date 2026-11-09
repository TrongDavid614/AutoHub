package com.autohub.core.deposit.repository;

import com.autohub.core.deposit.entity.BienBanBanGiaoXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BienBanBanGiaoXeRepository extends JpaRepository<BienBanBanGiaoXe, Long> {
    Optional<BienBanBanGiaoXe> findByPhieuDatCocId(Long phieuDatCocId);
    Optional<BienBanBanGiaoXe> findByMaBienBan(String maBienBan);
}

