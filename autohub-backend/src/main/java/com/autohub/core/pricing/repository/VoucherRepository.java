package com.autohub.core.pricing.repository;

import com.autohub.core.pricing.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findByMaVoucher(String maVoucher);
}
