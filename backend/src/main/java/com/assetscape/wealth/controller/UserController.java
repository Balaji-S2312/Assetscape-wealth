package com.assetscape.wealth.controller;

import com.assetscape.wealth.dto.ProfileDtos;
import com.assetscape.wealth.dto.UserResponse;
import com.assetscape.wealth.security.AuthenticatedUser;
import com.assetscape.wealth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class UserController {
    private final UserService users;
    public UserController(UserService users) { this.users = users; }

    @GetMapping
    public UserResponse get(@AuthenticationPrincipal AuthenticatedUser principal) { return UserResponse.from(principal.user()); }

    @PutMapping
    public UserResponse update(@AuthenticationPrincipal AuthenticatedUser principal,
                               @Valid @RequestBody ProfileDtos.UpdateProfileRequest request) {
        return users.update(principal, request);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal AuthenticatedUser principal,
                                               @Valid @RequestBody ProfileDtos.ChangePasswordRequest request) {
        users.changePassword(principal, request);
        return ResponseEntity.noContent().build();
    }
}
