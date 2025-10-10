package com.example.mentalhealth.controller;

import com.example.mentalhealth.model.MoodEntry;
import com.example.mentalhealth.repo.MoodRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moods")
public class MoodController {
    private final MoodRepo moodRepo;

    public MoodController(MoodRepo moodRepo) { this.moodRepo = moodRepo; }

    @GetMapping
    public List<MoodEntry> list(Authentication auth) {
        String userId = auth.getName();
        return moodRepo.findByUserIdOrderByCreatedAtAsc(userId);
    }

    @PostMapping
    public ResponseEntity<?> create(Authentication auth, @RequestBody Map<String, Object> body) {
        String userId = auth.getName();
        int score = ((Number) body.getOrDefault("score", 5)).intValue();
        String note = (String) body.getOrDefault("note", "");
        MoodEntry m = new MoodEntry();
        m.setUserId(userId);
        m.setScore(score);
        m.setNote(note);
        m.setCreatedAt(Instant.now());
        return ResponseEntity.ok(moodRepo.save(m));
    }
}
