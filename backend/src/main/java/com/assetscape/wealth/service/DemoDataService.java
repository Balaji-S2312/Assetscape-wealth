package com.assetscape.wealth.service;

import com.assetscape.wealth.domain.Asset;
import com.assetscape.wealth.domain.FinancialTransaction;
import com.assetscape.wealth.domain.Liability;
import com.assetscape.wealth.domain.User;
import com.assetscape.wealth.repository.AssetRepository;
import com.assetscape.wealth.repository.FinancialTransactionRepository;
import com.assetscape.wealth.repository.LiabilityRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DemoDataService {
    private final AssetRepository assets;
    private final LiabilityRepository liabilities;
    private final FinancialTransactionRepository transactions;
    private final boolean enabled;

    public DemoDataService(AssetRepository assets, LiabilityRepository liabilities,
                           FinancialTransactionRepository transactions,
                           @Value("${app.seed-demo-data:true}") boolean enabled) {
        this.assets = assets;
        this.liabilities = liabilities;
        this.transactions = transactions;
        this.enabled = enabled;
    }

    @Transactional
    public void seed(User user) {
        if (!enabled) return;
        asset(user, "Primary Savings", "Savings", "150000", "160500", LocalDate.now().minusYears(1), "Active");
        asset(user, "Index Fund", "Investment", "100000", "118400", LocalDate.now().minusMonths(18), "Active");
        asset(user, "Emergency Cash", "Cash", "50000", "50000", LocalDate.now().minusMonths(8), "Active");

        liability(user, "Education Loan", "Education loan", "180000", "112000", "8.50", "6200");
        liability(user, "Credit Card", "Credit card", "25000", "8000", "24.00", "2500");

        transaction(user, LocalDate.now().minusDays(2), "Monthly salary", "Income", "Salary", "50000", "Salary account");
        transaction(user, LocalDate.now().minusDays(5), "Index fund contribution", "Investment", "Portfolio", "-5000", "Investment account");
        transaction(user, LocalDate.now().minusDays(7), "Groceries", "Expense", "Groceries", "-3200", "Savings account");
        transaction(user, LocalDate.now().minusDays(10), "Education loan payment", "Liability payment", "Loan", "-6200", "Savings account");
    }

    private void asset(User user, String name, String category, String purchase, String current,
                       LocalDate date, String status) {
        Asset item = new Asset();
        item.setUser(user); item.setName(name); item.setCategory(category);
        item.setPurchaseValue(new BigDecimal(purchase)); item.setCurrentValue(new BigDecimal(current));
        item.setPurchaseDate(date); item.setOwnership(BigDecimal.valueOf(100)); item.setStatus(status);
        assets.save(item);
    }

    private void liability(User user, String name, String category, String original, String outstanding,
                           String interest, String monthly) {
        Liability item = new Liability();
        item.setUser(user); item.setName(name); item.setCategory(category);
        item.setOriginalAmount(new BigDecimal(original)); item.setOutstanding(new BigDecimal(outstanding));
        item.setInterestRate(new BigDecimal(interest)); item.setMonthlyPayment(new BigDecimal(monthly));
        item.setStartDate(LocalDate.now().minusYears(1)); item.setDueDate(LocalDate.now().plusYears(2));
        item.setStatus("Active");
        liabilities.save(item);
    }

    private void transaction(User user, LocalDate date, String title, String type, String category,
                             String amount, String account) {
        FinancialTransaction item = new FinancialTransaction();
        item.setUser(user); item.setDate(date); item.setTitle(title); item.setType(type); item.setCategory(category);
        item.setAmount(new BigDecimal(amount)); item.setAccount(account);
        transactions.save(item);
    }
}
