package com.example.mentalhealth.controller;

import com.example.mentalhealth.model.ExerciseProgress;
import com.example.mentalhealth.repo.ExerciseProgressRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {
    private final ExerciseProgressRepo progressRepo;

    public ExerciseController(ExerciseProgressRepo progressRepo) { this.progressRepo = progressRepo; }

    @GetMapping("/progress")
    public Map<String, Integer> progress(Authentication auth) {
        String userId = auth.getName();
        ExerciseProgress p = progressRepo.findById(userId).orElseGet(() -> {
            ExerciseProgress np = new ExerciseProgress();
            np.setId(userId);
            return progressRepo.save(np);
        });
        return p.getProgress();
    }

    @PostMapping("/complete")
    public ResponseEntity<?> complete(Authentication auth, @RequestBody Map<String, String> body) {
        String userId = auth.getName();
        String key = body.getOrDefault("key", "");
        ExerciseProgress p = progressRepo.findById(userId).orElseGet(() -> {
            ExerciseProgress np = new ExerciseProgress();
            np.setId(userId);
            return np;
        });
        p.getProgress().put(key, p.getProgress().getOrDefault(key, 0) + 1);
        progressRepo.save(p);
        return ResponseEntity.ok().build();
    }
}
