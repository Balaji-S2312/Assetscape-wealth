package com.assetscape.wealth.controller;

import com.assetscape.wealth.dto.AssetDtos;
import com.assetscape.wealth.security.AuthenticatedUser;
import com.assetscape.wealth.service.AssetService;
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
@RequestMapping("/api/assets")
public class AssetController {
    private final AssetService assets;
    public AssetController(AssetService assets) { this.assets = assets; }

    @GetMapping public List<AssetDtos.Response> list(@AuthenticationPrincipal AuthenticatedUser p) { return assets.list(p.user()); }
    @GetMapping("/{id}") public AssetDtos.Response get(@AuthenticationPrincipal AuthenticatedUser p, @PathVariable UUID id) { return assets.get(p.user(), id); }
    @PostMapping public ResponseEntity<AssetDtos.Response> create(@AuthenticationPrincipal AuthenticatedUser p, @Valid @RequestBody AssetDtos.Request r) {
        AssetDtos.Response created = assets.create(p.user(), r); return ResponseEntity.created(URI.create("/api/assets/" + created.id())).body(created);
    }
    @PutMapping("/{id}") public AssetDtos.Response update(@AuthenticationPrincipal AuthenticatedUser p, @PathVariable UUID id, @Valid @RequestBody AssetDtos.Request r) { return assets.update(p.user(), id, r); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@AuthenticationPrincipal AuthenticatedUser p, @PathVariable UUID id) { assets.delete(p.user(), id); return ResponseEntity.noContent().build(); }
}
