package com.example.mentalhealth.controller;

import com.example.mentalhealth.model.User;
import com.example.mentalhealth.repo.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepo userRepo;
    public UserController(UserRepo userRepo) { this.userRepo = userRepo; }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        String id = auth.getName();
    User u = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("name", u.getName());
        m.put("email", u.getEmail());
        return m;
    }

    @PutMapping("/me")
    public ResponseEntity<?> update(Authentication auth, @RequestBody Map<String, String> body) {
        String id = auth.getName();
    User u = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (body.containsKey("name")) u.setName(body.get("name"));
        userRepo.save(u);
        return ResponseEntity.ok().build();
    }
}
