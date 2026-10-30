package com.autohub.core.accessory.repository;

import com.autohub.core.accessory.entity.YeuCauDoiTra;
import com.autohub.core.enums.TrangThaiDoiTra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface YeuCauDoiTraRepository extends JpaRepository<YeuCauDoiTra, Long> {
    Optional<YeuCauDoiTra> findByDonHangId(Long donHangId);
    List<YeuCauDoiTra> findByTrangThai(TrangThaiDoiTra trangThai);
}
