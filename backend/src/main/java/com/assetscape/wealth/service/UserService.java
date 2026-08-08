package com.assetscape.wealth.service;

import com.assetscape.wealth.domain.User;
import com.assetscape.wealth.dto.ProfileDtos;
import com.assetscape.wealth.dto.UserResponse;
import com.assetscape.wealth.exception.NotFoundException;
import com.assetscape.wealth.exception.UnauthorizedException;
import com.assetscape.wealth.repository.UserRepository;
import com.assetscape.wealth.security.AuthenticatedUser;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final TokenService tokens;

    public UserService(UserRepository users, PasswordEncoder encoder, TokenService tokens) {
        this.users = users;
        this.encoder = encoder;
        this.tokens = tokens;
    }

    @Transactional
    public UserResponse update(AuthenticatedUser principal, ProfileDtos.UpdateProfileRequest request) {
        User user = managed(principal);
        user.setFullName(request.fullName().trim());
        user.setPhone(blankToNull(request.phone()));
        user.setOccupation(blankToNull(request.occupation()));
        user.setCurrency(request.currency() == null ? user.getCurrency() : request.currency().toUpperCase(Locale.ROOT));
        user.setCountry(blankToNull(request.country()));
        user.setBio(blankToNull(request.bio()));
        user.setAvatarUrl(blankToNull(request.avatar()));
        return UserResponse.from(user);
    }

    @Transactional
    public void changePassword(AuthenticatedUser principal, ProfileDtos.ChangePasswordRequest request) {
        User user = managed(principal);
        if (!encoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        user.setPasswordHash(encoder.encode(request.newPassword()));
        tokens.revokeAll(user);
    }

    private User managed(AuthenticatedUser principal) {
        return users.findById(principal.id()).orElseThrow(() -> new NotFoundException("User not found"));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
