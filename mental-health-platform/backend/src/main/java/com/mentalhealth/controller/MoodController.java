package com.mentalhealth.controller;

import com.mentalhealth.model.MoodEntry;
import com.mentalhealth.security.UserPrincipal;
import com.mentalhealth.service.MoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mood")
@RequiredArgsConstructor
public class MoodController {
    private final MoodService moodService;
    
    @PostMapping
    public ResponseEntity<MoodEntry> createMoodEntry(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody MoodEntry entry) {
        MoodEntry created = moodService.createMoodEntry(currentUser.getId(), entry);
        return ResponseEntity.ok(created);
    }
    
    @GetMapping
    public ResponseEntity<List<MoodEntry>> getUserMoodEntries(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<MoodEntry> entries = moodService.getUserMoodEntries(currentUser.getId());
        return ResponseEntity.ok(entries);
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<MoodEntry>> getMoodEntriesByDateRange(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<MoodEntry> entries = moodService.getMoodEntriesByDateRange(
                currentUser.getId(), startDate, endDate);
        return ResponseEntity.ok(entries);
    }
    
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getMoodAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "30") int days) {
        Map<String, Object> analytics = moodService.getMoodAnalytics(currentUser.getId(), days);
        return ResponseEntity.ok(analytics);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMoodEntry(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String id) {
        moodService.deleteMoodEntry(id, currentUser.getId());
        return ResponseEntity.ok().build();
    }
}
