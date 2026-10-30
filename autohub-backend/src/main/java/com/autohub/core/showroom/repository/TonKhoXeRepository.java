package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.TonKhoXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TonKhoXeRepository extends JpaRepository<TonKhoXe, Long> {
    List<TonKhoXe> findByShowroomId(Long showroomId);
    Optional<TonKhoXe> findByPhienBanXeIdAndMauSacIdAndShowroomId(Long phienBanXeId, Long mauSacId, Long showroomId);
}
