package com.mentalhealth.controller;

import com.mentalhealth.model.Exercise;
import com.mentalhealth.model.ExerciseProgress;
import com.mentalhealth.security.UserPrincipal;
import com.mentalhealth.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {
    private final ExerciseService exerciseService;
    
    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises() {
        List<Exercise> exercises = exerciseService.getAllActiveExercises();
        return ResponseEntity.ok(exercises);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Exercise>> getExercisesByType(@PathVariable Exercise.ExerciseType type) {
        List<Exercise> exercises = exerciseService.getExercisesByType(type);
        return ResponseEntity.ok(exercises);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExercise(@PathVariable String id) {
        Exercise exercise = exerciseService.getExerciseById(id);
        return ResponseEntity.ok(exercise);
    }
    
    @PostMapping("/{exerciseId}/start")
    public ResponseEntity<ExerciseProgress> startExercise(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String exerciseId) {
        ExerciseProgress progress = exerciseService.startExercise(currentUser.getId(), exerciseId);
        return ResponseEntity.ok(progress);
    }
    
    @PostMapping("/progress/{progressId}/complete")
    public ResponseEntity<ExerciseProgress> completeExercise(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String progressId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String feedback) {
        ExerciseProgress progress = exerciseService.completeExercise(
                progressId, currentUser.getId(), rating, feedback);
        return ResponseEntity.ok(progress);
    }
    
    @GetMapping("/progress")
    public ResponseEntity<List<ExerciseProgress>> getUserProgress(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ExerciseProgress> progress = exerciseService.getUserProgress(currentUser.getId());
        return ResponseEntity.ok(progress);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Map<String, Object> stats = exerciseService.getUserExerciseStats(currentUser.getId());
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        Exercise created = exerciseService.createExercise(exercise);
        return ResponseEntity.ok(created);
    }
}
