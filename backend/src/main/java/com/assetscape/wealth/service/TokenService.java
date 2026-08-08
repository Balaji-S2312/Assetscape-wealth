package com.assetscape.wealth.service;

import com.assetscape.wealth.domain.RefreshToken;
import com.assetscape.wealth.domain.User;
import com.assetscape.wealth.exception.UnauthorizedException;
import com.assetscape.wealth.repository.RefreshTokenRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TokenService {
    private final RefreshTokenRepository tokens;
    private final SecureRandom secureRandom = new SecureRandom();
    private final long refreshTokenSeconds;

    public TokenService(RefreshTokenRepository tokens,
                        @Value("${app.security.refresh-token-seconds:604800}") long refreshTokenSeconds) {
        this.tokens = tokens;
        this.refreshTokenSeconds = refreshTokenSeconds;
    }

    @Transactional
    public String create(User user) {
        byte[] random = new byte[48];
        secureRandom.nextBytes(random);
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(random);
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(hash(raw));
        token.setExpiresAt(Instant.now().plusSeconds(refreshTokenSeconds));
        token.setRevoked(false);
        tokens.save(token);
        return raw;
    }

    @Transactional
    public User consumeAndRotate(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) throw new UnauthorizedException("Refresh token is missing");
        RefreshToken token = tokens.findByTokenHashAndRevokedFalse(hash(rawToken))
                .orElseThrow(() -> new UnauthorizedException("Refresh token is invalid"));
        if (token.getExpiresAt().isBefore(Instant.now())) {
            token.setRevoked(true);
            throw new UnauthorizedException("Refresh token has expired");
        }
        token.setRevoked(true);
        return token.getUser();
    }

    @Transactional
    public void revoke(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) return;
        tokens.findByTokenHashAndRevokedFalse(hash(rawToken)).ifPresent(token -> token.setRevoked(true));
    }

    @Transactional
    public void revokeAll(User user) {
        tokens.revokeAllForUser(user.getId());
    }

    public long getRefreshTokenSeconds() { return refreshTokenSeconds; }

    public static String hash(String raw) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is unavailable", e);
        }
    }
}
