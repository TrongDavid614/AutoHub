package com.autohub.core.engagement.repository;

import com.autohub.core.engagement.entity.YeuCauTuVan;
import com.autohub.core.enums.TrangThaiYeuCauTuVan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YeuCauTuVanRepository extends JpaRepository<YeuCauTuVan, Long> {
    List<YeuCauTuVan> findByTrangThai(TrangThaiYeuCauTuVan trangThai);
}
