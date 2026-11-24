package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.LichSuBaoDuongXeDemo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LichSuBaoDuongXeDemoRepository extends JpaRepository<LichSuBaoDuongXeDemo, Long> {
    List<LichSuBaoDuongXeDemo> findByXeDemoIdOrderByNgayTaoDesc(Long xeDemoId);
    List<LichSuBaoDuongXeDemo> findAllByOrderByNgayTaoDesc();
    Optional<LichSuBaoDuongXeDemo> findFirstByXeDemoIdAndTrangThaiOrderByNgayTaoDesc(Long xeDemoId, String trangThai);
}
