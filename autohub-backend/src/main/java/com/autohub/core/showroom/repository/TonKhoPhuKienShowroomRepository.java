package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.TonKhoPhuKienShowroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TonKhoPhuKienShowroomRepository extends JpaRepository<TonKhoPhuKienShowroom, Long> {
    List<TonKhoPhuKienShowroom> findByPhuKienId(Long phuKienId);
    Optional<TonKhoPhuKienShowroom> findByPhuKienIdAndShowroomId(Long phuKienId, Long showroomId);
    Optional<TonKhoPhuKienShowroom> findByMaSkuAndShowroomId(String maSku, Long showroomId);
}
