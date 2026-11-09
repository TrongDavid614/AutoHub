package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.PhuKien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhuKienRepository extends JpaRepository<PhuKien, Long> {
    List<PhuKien> findByDanhMucPhuKienId(Long danhMucId);

    @Query("SELECT p FROM PhuKien p LEFT JOIN FETCH p.danhMucPhuKien")
    List<PhuKien> findAllWithDetails();
}
