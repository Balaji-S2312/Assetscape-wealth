package com.assetscape.wealth.repository;

import com.assetscape.wealth.domain.Asset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, UUID> {
    List<Asset> findAllByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<Asset> findByIdAndUserId(UUID id, UUID userId);
    long deleteAllByUserId(UUID userId);
}
