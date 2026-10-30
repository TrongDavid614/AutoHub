package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.PhuKien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhuKienRepository extends JpaRepository<PhuKien, Long> {
    List<PhuKien> findByDanhMucPhuKienId(Long danhMucId);
}
