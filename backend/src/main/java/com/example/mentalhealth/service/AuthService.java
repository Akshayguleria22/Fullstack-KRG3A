package com.example.mentalhealth.service;

import com.example.mentalhealth.model.Role;
import com.example.mentalhealth.model.User;
import com.example.mentalhealth.repo.UserRepo;
import com.example.mentalhealth.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepo userRepo, JwtService jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }

    public Map<String, Object> register(String name, String email, String password) {
        String cleanEmail = email == null ? "" : email.trim().toLowerCase();
        String cleanName = name == null ? "" : name.trim();
        String cleanPassword = password == null ? "" : password.trim();

        if (cleanEmail.isEmpty()) throw new IllegalArgumentException("Email is required");
        if (!cleanEmail.contains("@")) throw new IllegalArgumentException("Email is invalid");
        if (cleanPassword.length() < 6) throw new IllegalArgumentException("Password must be at least 6 characters");
        if (userRepo.findByEmail(cleanEmail).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User u = new User();
        u.setName(cleanName.isEmpty() ? cleanEmail.split("@")[0] : cleanName);
        u.setEmail(cleanEmail);
        u.setPasswordHash(encoder.encode(cleanPassword));
        java.util.HashSet<Role> roles = new java.util.HashSet<>();
        roles.add(Role.USER);
        u.setRoles(roles);
        u = userRepo.save(u);

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", Collections.singletonList("USER"));
        String token = jwtService.generateToken(u.getId(), claims);
        Map<String, Object> out = new HashMap<>();
        out.put("token", token);
        java.util.Map<String, Object> userMap = new java.util.HashMap<>();
        userMap.put("id", u.getId());
        userMap.put("name", u.getName());
        userMap.put("email", u.getEmail());
        out.put("user", userMap);
        return out;
    }

    public Map<String, Object> login(String email, String password) {
        String cleanEmail = email == null ? "" : email.trim().toLowerCase();
        String cleanPassword = password == null ? "" : password.trim();
        if (cleanEmail.isEmpty() || cleanPassword.isEmpty()) throw new IllegalArgumentException("Email and password are required");
        User u = userRepo.findByEmail(cleanEmail).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!encoder.matches(cleanPassword, u.getPasswordHash())) throw new IllegalArgumentException("Invalid credentials");
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", Collections.singletonList("USER"));
        String token = jwtService.generateToken(u.getId(), claims);
        Map<String, Object> out = new HashMap<>();
        out.put("token", token);
        java.util.Map<String, Object> userMap2 = new java.util.HashMap<>();
        userMap2.put("id", u.getId());
        userMap2.put("name", u.getName());
        userMap2.put("email", u.getEmail());
        out.put("user", userMap2);
        return out;
    }
}
