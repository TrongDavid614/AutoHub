package com.autohub.core.showroom.repository;

import com.autohub.core.showroom.entity.Showroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowroomRepository extends JpaRepository<Showroom, Long> {
    List<Showroom> findAllByOrderByIdAsc();
    boolean existsByTenShowroomIgnoreCase(String tenShowroom);
    boolean existsByTenShowroomIgnoreCaseAndIdNot(String tenShowroom, Long id);
}
