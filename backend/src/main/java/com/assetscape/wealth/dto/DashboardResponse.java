package com.assetscape.wealth.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        BigDecimal totalAssets,
        BigDecimal totalLiabilities,
        BigDecimal netWorth,
        BigDecimal availableCash,
        BigDecimal monthlyIncome,
        BigDecimal monthlyExpenses,
        int financialHealthScore,
        List<AllocationItem> allocation
) {
    public record AllocationItem(String name, BigDecimal value) {}
}
