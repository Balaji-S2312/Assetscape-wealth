package com.assetscape.wealth.controller;

import com.assetscape.wealth.dto.DashboardResponse;
import com.assetscape.wealth.security.AuthenticatedUser;
import com.assetscape.wealth.service.DashboardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboard;
    public DashboardController(DashboardService dashboard) { this.dashboard = dashboard; }

    @GetMapping("/summary")
    public DashboardResponse summary(@AuthenticationPrincipal AuthenticatedUser principal) {
        return dashboard.summary(principal.user());
    }
}
