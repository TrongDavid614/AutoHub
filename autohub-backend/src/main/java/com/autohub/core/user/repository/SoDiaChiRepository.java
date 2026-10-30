package com.autohub.core.user.repository;

import com.autohub.core.user.entity.SoDiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoDiaChiRepository extends JpaRepository<SoDiaChi, Long> {
    List<SoDiaChi> findByNguoiDungId(Long nguoiDungId);
}
