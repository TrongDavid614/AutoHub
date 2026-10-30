package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.DanhMucPhuKien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DanhMucPhuKienRepository extends JpaRepository<DanhMucPhuKien, Long> {
}
