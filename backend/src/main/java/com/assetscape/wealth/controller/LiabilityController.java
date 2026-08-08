package com.assetscape.wealth.controller;

import com.assetscape.wealth.dto.LiabilityDtos;
import com.assetscape.wealth.security.AuthenticatedUser;
import com.assetscape.wealth.service.LiabilityService;
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
@RequestMapping("/api/liabilities")
public class LiabilityController {
    private final LiabilityService liabilities;
    public LiabilityController(LiabilityService liabilities) { this.liabilities = liabilities; }

    @GetMapping public List<LiabilityDtos.Response> list(@AuthenticationPrincipal AuthenticatedUser p) { return liabilities.list(p.user()); }
    @GetMapping("/{id}") public LiabilityDtos.Response get(@AuthenticationPrincipal AuthenticatedUser p, @PathVariable UUID id) { return liabilities.get(p.user(), id); }
    @PostMapping public ResponseEntity<LiabilityDtos.Response> create(@AuthenticationPrincipal AuthenticatedUser p, @Valid @RequestBody LiabilityDtos.Request r) {
        LiabilityDtos.Response created = liabilities.create(p.user(), r); return ResponseEntity.created(URI.create("/api/liabilities/" + created.id())).body(created);
    }
    @PutMapping("/{id}") public LiabilityDtos.Response update(@AuthenticationPrincipal AuthenticatedUser p, @PathVariable UUID id, @Valid @RequestBody LiabilityDtos.Request r) { return liabilities.update(p.user(), id, r); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@AuthenticationPrincipal AuthenticatedUser p, @PathVariable UUID id) { liabilities.delete(p.user(), id); return ResponseEntity.noContent().build(); }
}
