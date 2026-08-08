package com.assetscape.wealth.service;

import com.assetscape.wealth.domain.FinancialTransaction;
import com.assetscape.wealth.domain.User;
import com.assetscape.wealth.dto.TransactionDtos;
import com.assetscape.wealth.exception.NotFoundException;
import com.assetscape.wealth.repository.FinancialTransactionRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {
    private final FinancialTransactionRepository transactions;

    public TransactionService(FinancialTransactionRepository transactions) { this.transactions = transactions; }

    @Transactional(readOnly = true)
    public List<TransactionDtos.Response> list(User user) {
        return transactions.findAllByUserIdOrderByDateDescCreatedAtDesc(user.getId()).stream()
                .map(TransactionDtos.Response::from).toList();
    }

    @Transactional(readOnly = true)
    public TransactionDtos.Response get(User user, UUID id) { return TransactionDtos.Response.from(find(user, id)); }

    @Transactional
    public TransactionDtos.Response create(User user, TransactionDtos.Request request) {
        FinancialTransaction item = new FinancialTransaction(); item.setUser(user); apply(item, request);
        return TransactionDtos.Response.from(transactions.save(item));
    }

    @Transactional
    public TransactionDtos.Response update(User user, UUID id, TransactionDtos.Request request) {
        FinancialTransaction item = find(user, id); apply(item, request); return TransactionDtos.Response.from(item);
    }

    @Transactional
    public void delete(User user, UUID id) { transactions.delete(find(user, id)); }

    private FinancialTransaction find(User user, UUID id) {
        return transactions.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
    }

    private void apply(FinancialTransaction item, TransactionDtos.Request request) {
        item.setDate(request.date()); item.setTitle(request.title().trim()); item.setType(request.type().trim());
        item.setCategory(request.category().trim()); item.setAmount(request.amount());
        item.setAccount(request.account()); item.setNote(request.note());
    }
}
