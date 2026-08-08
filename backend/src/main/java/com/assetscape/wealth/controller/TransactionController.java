package com.assetscape.wealth.controller;

import com.assetscape.wealth.dto.TransactionDtos;
import com.assetscape.wealth.security.AuthenticatedUser;
import com.assetscape.wealth.service.TransactionService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactions;
    public TransactionController(TransactionService transactions) { this.transactions = transactions; }

    @GetMapping public List<TransactionDtos.Response> list(@AuthenticationPrincipal AuthenticatedUser p) { return transactions.list(p.user()); }
    @GetMapping("/{id}") public TransactionDtos.Response get(@AuthenticationPrincipal AuthenticatedUser p, @PathVariable UUID id) { return transactions.get(p.user(), id); }
    @PostMapping public ResponseEntity<TransactionDtos.Response> create(@AuthenticationPrincipal AuthenticatedUser p, @Valid @RequestBody TransactionDtos.Request r) {
        TransactionDtos.Response created = transactions.create(p.user(), r); return ResponseEntity.created(URI.create("/api/transactions/" + created.id())).body(created);
    }
    @PutMapping("/{id}") public TransactionDtos.Response update(@AuthenticationPrincipal AuthenticatedUser p, @PathVariable UUID id, @Valid @RequestBody TransactionDtos.Request r) { return transactions.update(p.user(), id, r); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@AuthenticationPrincipal AuthenticatedUser p, @PathVariable UUID id) { transactions.delete(p.user(), id); return ResponseEntity.noContent().build(); }
}
