package com.assetscape.wealth.dto;

import com.assetscape.wealth.domain.User;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        String phone,
        String occupation,
        String currency,
        String country,
        String bio,
        String avatar,
        Instant memberSince,
        Set<String> roles
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getOccupation(),
                user.getCurrency(), user.getCountry(), user.getBio(), user.getAvatarUrl(), user.getCreatedAt(),
                user.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );
    }
}
