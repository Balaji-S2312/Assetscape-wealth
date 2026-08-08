package com.assetscape.wealth.service;

import com.assetscape.wealth.domain.PasswordResetToken;
import com.assetscape.wealth.domain.Role;
import com.assetscape.wealth.domain.User;
import com.assetscape.wealth.dto.AuthDtos;
import com.assetscape.wealth.dto.UserResponse;
import com.assetscape.wealth.exception.ConflictException;
import com.assetscape.wealth.exception.UnauthorizedException;
import com.assetscape.wealth.repository.PasswordResetTokenRepository;
import com.assetscape.wealth.repository.UserRepository;
import com.assetscape.wealth.security.AuthenticatedUser;
import com.assetscape.wealth.security.JwtService;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Locale;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordResetTokenRepository resets;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwt;
    private final TokenService refreshTokens;
    private final DemoDataService demoData;
    private final SecureRandom random = new SecureRandom();
    private final boolean exposeResetToken;

    public AuthService(UserRepository users, PasswordResetTokenRepository resets, PasswordEncoder encoder,
                       AuthenticationManager authenticationManager, JwtService jwt, TokenService refreshTokens,
                       DemoDataService demoData,
                       @Value("${app.security.expose-reset-token:false}") boolean exposeResetToken) {
        this.users = users;
        this.resets = resets;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.jwt = jwt;
        this.refreshTokens = refreshTokens;
        this.demoData = demoData;
        this.exposeResetToken = exposeResetToken;
    }

    @Transactional
    public LoginResult register(AuthDtos.RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (users.existsByEmailIgnoreCase(email)) throw new ConflictException("An account already exists for this email");
        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(request.password()));
        user.setCurrency("INR");
        user.setCountry("India");
        user.setRoles(new java.util.HashSet<>(Set.of(Role.USER)));
        users.save(user);
        demoData.seed(user);
        return createLoginResult(user);
    }

    public LoginResult login(AuthDtos.LoginRequest request) {
        String email = normalizeEmail(request.email());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        User user = users.findByEmailIgnoreCase(email).orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        return createLoginResult(user);
    }

    @Transactional
    public LoginResult refresh(String rawToken) {
        User user = refreshTokens.consumeAndRotate(rawToken);
        if (!user.isEnabled()) throw new UnauthorizedException("Account is disabled");
        return createLoginResult(user);
    }

    public UserResponse me(AuthenticatedUser principal) {
        return UserResponse.from(principal.user());
    }

    @Transactional
    public AuthDtos.ForgotPasswordResponse forgotPassword(String email) {
        String raw = null;
        var found = users.findByEmailIgnoreCase(normalizeEmail(email));
        if (found.isPresent()) {
            byte[] bytes = new byte[32];
            random.nextBytes(bytes);
            raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            PasswordResetToken token = new PasswordResetToken();
            token.setUser(found.get());
            token.setTokenHash(TokenService.hash(raw));
            token.setExpiresAt(Instant.now().plusSeconds(1800));
            resets.save(token);
        }
        return new AuthDtos.ForgotPasswordResponse(
                "If the account exists, password-reset instructions have been created.",
                exposeResetToken ? raw : null
        );
    }

    @Transactional
    public void resetPassword(AuthDtos.ResetPasswordRequest request) {
        PasswordResetToken token = resets.findByTokenHashAndUsedAtIsNull(TokenService.hash(request.token()))
                .orElseThrow(() -> new UnauthorizedException("Reset token is invalid"));
        if (token.getExpiresAt().isBefore(Instant.now())) throw new UnauthorizedException("Reset token has expired");
        token.getUser().setPasswordHash(encoder.encode(request.newPassword()));
        token.setUsedAt(Instant.now());
        refreshTokens.revokeAll(token.getUser());
    }

    private LoginResult createLoginResult(User user) {
        AuthenticatedUser principal = new AuthenticatedUser(user);
        String access = jwt.createAccessToken(principal);
        String refresh = refreshTokens.create(user);
        AuthDtos.AuthResponse response = new AuthDtos.AuthResponse(access, "Bearer", jwt.getAccessTokenSeconds(), UserResponse.from(user));
        return new LoginResult(response, refresh);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    public record LoginResult(AuthDtos.AuthResponse response, String refreshToken) {}
}
