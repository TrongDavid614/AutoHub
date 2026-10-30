package com.autohub.core.engagement.repository;

import com.autohub.core.engagement.entity.LichHenLaiThu;
import com.autohub.core.enums.TrangThaiLichHen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichHenLaiThuRepository extends JpaRepository<LichHenLaiThu, Long> {
    List<LichHenLaiThu> findByNguoiDungId(Long nguoiDungId);
    List<LichHenLaiThu> findByTrangThai(TrangThaiLichHen trangThai);
}
