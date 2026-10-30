package com.autohub.core.user.repository;

import com.autohub.core.user.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {
    Optional<NguoiDung> findByEmail(String email);
    Optional<NguoiDung> findBySoDienThoai(String soDienThoai);
    Optional<NguoiDung> findBySoCCCD(String soCCCD);
    boolean existsByEmail(String email);
}
