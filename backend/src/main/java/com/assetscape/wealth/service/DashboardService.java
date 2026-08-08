package com.assetscape.wealth.service;

import com.assetscape.wealth.domain.Asset;
import com.assetscape.wealth.domain.FinancialTransaction;
import com.assetscape.wealth.domain.Liability;
import com.assetscape.wealth.domain.User;
import com.assetscape.wealth.dto.DashboardResponse;
import com.assetscape.wealth.repository.AssetRepository;
import com.assetscape.wealth.repository.FinancialTransactionRepository;
import com.assetscape.wealth.repository.LiabilityRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {
    private final AssetRepository assets;
    private final LiabilityRepository liabilities;
    private final FinancialTransactionRepository transactions;

    public DashboardService(AssetRepository assets, LiabilityRepository liabilities,
                            FinancialTransactionRepository transactions) {
        this.assets = assets; this.liabilities = liabilities; this.transactions = transactions;
    }

    @Transactional(readOnly = true)
    public DashboardResponse summary(User user) {
        List<Asset> userAssets = assets.findAllByUserIdOrderByCreatedAtDesc(user.getId());
        List<Liability> userLiabilities = liabilities.findAllByUserIdOrderByCreatedAtDesc(user.getId());
        List<FinancialTransaction> userTransactions = transactions.findAllByUserIdOrderByDateDescCreatedAtDesc(user.getId());

        BigDecimal totalAssets = userAssets.stream().filter(a -> !"Sold".equalsIgnoreCase(a.getStatus()))
                .map(Asset::getCurrentValue).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalLiabilities = userLiabilities.stream().filter(l -> !"Closed".equalsIgnoreCase(l.getStatus()))
                .map(Liability::getOutstanding).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal availableCash = userAssets.stream()
                .filter(a -> "Cash".equalsIgnoreCase(a.getCategory()) || "Savings".equalsIgnoreCase(a.getCategory()))
                .map(Asset::getCurrentValue).reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        BigDecimal income = userTransactions.stream().filter(t -> !t.getDate().isBefore(monthStart) && t.getAmount().signum() > 0)
                .map(FinancialTransaction::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal expenses = userTransactions.stream().filter(t -> !t.getDate().isBefore(monthStart) && t.getAmount().signum() < 0)
                .map(FinancialTransaction::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add).abs();

        Map<String, BigDecimal> allocation = new LinkedHashMap<>();
        userAssets.stream().filter(a -> !"Sold".equalsIgnoreCase(a.getStatus()))
                .forEach(a -> allocation.merge(a.getCategory(), a.getCurrentValue(), BigDecimal::add));

        int health = healthScore(totalAssets, totalLiabilities, income, expenses, allocation.size());
        return new DashboardResponse(totalAssets, totalLiabilities, totalAssets.subtract(totalLiabilities), availableCash,
                income, expenses, health,
                allocation.entrySet().stream().map(e -> new DashboardResponse.AllocationItem(e.getKey(), e.getValue())).toList());
    }

    private int healthScore(BigDecimal assets, BigDecimal liabilities, BigDecimal income, BigDecimal expenses, int categories) {
        double debtRatio = assets.signum() == 0 ? 1 : liabilities.divide(assets, 6, RoundingMode.HALF_UP).doubleValue();
        double debtScore = Math.max(0, 100 - debtRatio * 140);
        double savingsRate = income.signum() == 0 ? 0 : income.subtract(expenses).max(BigDecimal.ZERO)
                .divide(income, 6, RoundingMode.HALF_UP).doubleValue();
        double savingsScore = Math.min(100, savingsRate * 200);
        double diversityScore = Math.min(100, categories * 18.0);
        return (int) Math.round(debtScore * .5 + savingsScore * .3 + diversityScore * .2);
    }
}
