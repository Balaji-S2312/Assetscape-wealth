package com.assetscape.wealth.dto;

import com.assetscape.wealth.domain.FinancialTransaction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public final class TransactionDtos {
    private TransactionDtos() {}

    public record Request(
            @NotNull LocalDate date,
            @NotBlank @Size(max = 160) String title,
            @NotBlank @Size(max = 50) String type,
            @NotBlank @Size(max = 60) String category,
            @NotNull BigDecimal amount,
            @Size(max = 120) String account,
            @Size(max = 1500) String note
    ) {}

    public record Response(
            UUID id, LocalDate date, String title, String type, String category, BigDecimal amount,
            String account, String note, Instant createdAt, Instant updatedAt
    ) {
        public static Response from(FinancialTransaction item) {
            return new Response(item.getId(), item.getDate(), item.getTitle(), item.getType(), item.getCategory(),
                    item.getAmount(), item.getAccount(), item.getNote(), item.getCreatedAt(), item.getUpdatedAt());
        }
    }
}
