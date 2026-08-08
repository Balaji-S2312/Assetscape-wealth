package com.assetscape.wealth.controller;

import com.assetscape.wealth.dto.AuthDtos;
import com.assetscape.wealth.dto.UserResponse;
import com.assetscape.wealth.security.AuthenticatedUser;
import com.assetscape.wealth.service.AuthService;
import com.assetscape.wealth.service.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String REFRESH_COOKIE = "assetscape_refresh";
    private final AuthService auth;
    private final TokenService tokens;
    private final boolean secureCookie;

    public AuthController(AuthService auth, TokenService tokens,
                          @Value("${app.security.cookie-secure:false}") boolean secureCookie) {
        this.auth = auth; this.tokens = tokens; this.secureCookie = secureCookie;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDtos.AuthResponse> register(@Valid @RequestBody AuthDtos.RegisterRequest request,
                                                           HttpServletResponse response) {
        return loginResponse(auth.register(request), response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest request,
                                                        HttpServletResponse response) {
        return loginResponse(auth.login(request), response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthDtos.AuthResponse> refresh(HttpServletRequest request, HttpServletResponse response) {
        return loginResponse(auth.refresh(readRefreshCookie(request)), response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        tokens.revoke(readRefreshCookie(request));
        response.addHeader(HttpHeaders.SET_COOKIE, clearCookie().toString());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal AuthenticatedUser principal) { return auth.me(principal); }

    @PostMapping("/forgot-password")
    public AuthDtos.ForgotPasswordResponse forgot(@Valid @RequestBody AuthDtos.ForgotPasswordRequest request) {
        return auth.forgotPassword(request.email());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> reset(@Valid @RequestBody AuthDtos.ResetPasswordRequest request) {
        auth.resetPassword(request);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<AuthDtos.AuthResponse> loginResponse(AuthService.LoginResult result, HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie(result.refreshToken()).toString());
        return ResponseEntity.ok(result.response());
    }

    private String readRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) if (REFRESH_COOKIE.equals(cookie.getName())) return cookie.getValue();
        return null;
    }

    private ResponseCookie refreshCookie(String token) {
        return ResponseCookie.from(REFRESH_COOKIE, token).httpOnly(true).secure(secureCookie)
                .sameSite(secureCookie ? "None" : "Lax").path("/api/auth")
                .maxAge(Duration.ofSeconds(tokens.getRefreshTokenSeconds())).build();
    }

    private ResponseCookie clearCookie() {
        return ResponseCookie.from(REFRESH_COOKIE, "").httpOnly(true).secure(secureCookie)
                .sameSite(secureCookie ? "None" : "Lax").path("/api/auth").maxAge(Duration.ZERO).build();
    }
}
