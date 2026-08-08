package com.assetscape.wealth.repository;

import com.assetscape.wealth.domain.Liability;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiabilityRepository extends JpaRepository<Liability, UUID> {
    List<Liability> findAllByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<Liability> findByIdAndUserId(UUID id, UUID userId);
    long deleteAllByUserId(UUID userId);
}
