package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.XeDemo;
import com.autohub.core.enums.TrangThaiXeDemo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XeDemoRepository extends JpaRepository<XeDemo, Long> {
    List<XeDemo> findByShowroomIdAndTrangThai(Long showroomId, TrangThaiXeDemo trangThai);
}
