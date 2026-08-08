package com.assetscape.wealth.repository;

import com.assetscape.wealth.domain.FinancialTransaction;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, UUID> {
    List<FinancialTransaction> findAllByUserIdOrderByDateDescCreatedAtDesc(UUID userId);
    Optional<FinancialTransaction> findByIdAndUserId(UUID id, UUID userId);
    long deleteAllByUserId(UUID userId);
}
