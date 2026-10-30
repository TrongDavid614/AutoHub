package com.autohub.core.deposit.repository;

import com.autohub.core.deposit.entity.YeuCauHoanCoc;
import com.autohub.core.enums.TrangThaiHoanCoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface YeuCauHoanCocRepository extends JpaRepository<YeuCauHoanCoc, Long> {
    Optional<YeuCauHoanCoc> findByPhieuDatCocId(Long phieuDatCocId);
    List<YeuCauHoanCoc> findByTrangThai(TrangThaiHoanCoc trangThai);
}
