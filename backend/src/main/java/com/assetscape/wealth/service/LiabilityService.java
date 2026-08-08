package com.assetscape.wealth.service;

import com.assetscape.wealth.domain.Liability;
import com.assetscape.wealth.domain.User;
import com.assetscape.wealth.dto.LiabilityDtos;
import com.assetscape.wealth.exception.NotFoundException;
import com.assetscape.wealth.repository.LiabilityRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LiabilityService {
    private final LiabilityRepository liabilities;

    public LiabilityService(LiabilityRepository liabilities) { this.liabilities = liabilities; }

    @Transactional(readOnly = true)
    public List<LiabilityDtos.Response> list(User user) {
        return liabilities.findAllByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(LiabilityDtos.Response::from).toList();
    }

    @Transactional(readOnly = true)
    public LiabilityDtos.Response get(User user, UUID id) { return LiabilityDtos.Response.from(find(user, id)); }

    @Transactional
    public LiabilityDtos.Response create(User user, LiabilityDtos.Request request) {
        Liability item = new Liability(); item.setUser(user); apply(item, request);
        return LiabilityDtos.Response.from(liabilities.save(item));
    }

    @Transactional
    public LiabilityDtos.Response update(User user, UUID id, LiabilityDtos.Request request) {
        Liability item = find(user, id); apply(item, request); return LiabilityDtos.Response.from(item);
    }

    @Transactional
    public void delete(User user, UUID id) { liabilities.delete(find(user, id)); }

    private Liability find(User user, UUID id) {
        return liabilities.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new NotFoundException("Liability not found"));
    }

    private void apply(Liability item, LiabilityDtos.Request request) {
        item.setName(request.name().trim()); item.setCategory(request.category().trim());
        item.setOriginalAmount(request.originalAmount()); item.setOutstanding(request.outstanding());
        item.setInterestRate(request.interestRate()); item.setMonthlyPayment(request.monthlyPayment());
        item.setStartDate(request.startDate()); item.setDueDate(request.dueDate()); item.setStatus(request.status().trim());
        item.setDescription(request.description());
    }
}
