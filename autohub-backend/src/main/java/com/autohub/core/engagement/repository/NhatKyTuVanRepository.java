package com.autohub.core.engagement.repository;

import com.autohub.core.engagement.entity.NhatKyTuVan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NhatKyTuVanRepository extends JpaRepository<NhatKyTuVan, Long> {
    List<NhatKyTuVan> findByYeuCauTuVanId(Long yeuCauTuVanId);
}

