package com.assetscape.wealth.dto;

import com.assetscape.wealth.domain.Asset;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public final class AssetDtos {
    private AssetDtos() {}

    public record Request(
            @NotBlank @Size(max = 140) String name,
            @NotBlank @Size(max = 60) String category,
            @NotNull @PositiveOrZero BigDecimal purchaseValue,
            @NotNull @PositiveOrZero BigDecimal currentValue,
            LocalDate purchaseDate,
            @NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal ownership,
            @NotBlank @Size(max = 30) String status,
            @Size(max = 1500) String description,
            @Size(max = 500) String image
    ) {}

    public record Response(
            UUID id, String name, String category, BigDecimal purchaseValue, BigDecimal currentValue,
            LocalDate purchaseDate, BigDecimal ownership, String status, String description, String image,
            List<HistoryPoint> history, Instant createdAt, Instant updatedAt
    ) {
        public static Response from(Asset asset) {
            return new Response(asset.getId(), asset.getName(), asset.getCategory(), asset.getPurchaseValue(),
                    asset.getCurrentValue(), asset.getPurchaseDate(), asset.getOwnership(), asset.getStatus(),
                    asset.getDescription(), asset.getImageUrl(), List.of(), asset.getCreatedAt(), asset.getUpdatedAt());
        }
    }

    public record HistoryPoint(String label, BigDecimal value) {}
}
