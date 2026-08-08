package com.assetscape.wealth.dto;

import com.assetscape.wealth.domain.Liability;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public final class LiabilityDtos {
    private LiabilityDtos() {}

    public record Request(
            @NotBlank @Size(max = 140) String name,
            @NotBlank @Size(max = 60) String category,
            @NotNull @PositiveOrZero BigDecimal originalAmount,
            @NotNull @PositiveOrZero BigDecimal outstanding,
            @NotNull @PositiveOrZero BigDecimal interestRate,
            @NotNull @PositiveOrZero BigDecimal monthlyPayment,
            LocalDate startDate,
            LocalDate dueDate,
            @NotBlank @Size(max = 30) String status,
            @Size(max = 1500) String description
    ) {}

    public record Response(
            UUID id, String name, String category, BigDecimal originalAmount, BigDecimal outstanding,
            BigDecimal interestRate, BigDecimal monthlyPayment, LocalDate startDate, LocalDate dueDate,
            String status, String description, Instant createdAt, Instant updatedAt
    ) {
        public static Response from(Liability item) {
            return new Response(item.getId(), item.getName(), item.getCategory(), item.getOriginalAmount(),
                    item.getOutstanding(), item.getInterestRate(), item.getMonthlyPayment(), item.getStartDate(),
                    item.getDueDate(), item.getStatus(), item.getDescription(), item.getCreatedAt(), item.getUpdatedAt());
        }
    }
}
