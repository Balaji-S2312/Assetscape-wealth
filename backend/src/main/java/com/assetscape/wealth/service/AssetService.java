package com.assetscape.wealth.service;

import com.assetscape.wealth.domain.Asset;
import com.assetscape.wealth.domain.User;
import com.assetscape.wealth.dto.AssetDtos;
import com.assetscape.wealth.exception.NotFoundException;
import com.assetscape.wealth.repository.AssetRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssetService {
    private final AssetRepository assets;

    public AssetService(AssetRepository assets) { this.assets = assets; }

    @Transactional(readOnly = true)
    public List<AssetDtos.Response> list(User user) {
        return assets.findAllByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(AssetDtos.Response::from).toList();
    }

    @Transactional(readOnly = true)
    public AssetDtos.Response get(User user, UUID id) { return AssetDtos.Response.from(find(user, id)); }

    @Transactional
    public AssetDtos.Response create(User user, AssetDtos.Request request) {
        Asset item = new Asset();
        item.setUser(user);
        apply(item, request);
        return AssetDtos.Response.from(assets.save(item));
    }

    @Transactional
    public AssetDtos.Response update(User user, UUID id, AssetDtos.Request request) {
        Asset item = find(user, id);
        apply(item, request);
        return AssetDtos.Response.from(item);
    }

    @Transactional
    public void delete(User user, UUID id) { assets.delete(find(user, id)); }

    private Asset find(User user, UUID id) {
        return assets.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new NotFoundException("Asset not found"));
    }

    private void apply(Asset item, AssetDtos.Request request) {
        item.setName(request.name().trim()); item.setCategory(request.category().trim());
        item.setPurchaseValue(request.purchaseValue()); item.setCurrentValue(request.currentValue());
        item.setPurchaseDate(request.purchaseDate()); item.setOwnership(request.ownership());
        item.setStatus(request.status().trim()); item.setDescription(request.description()); item.setImageUrl(request.image());
    }
}
