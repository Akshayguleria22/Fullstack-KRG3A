package com.mentalhealth.service;

import com.mentalhealth.model.Exercise;
import com.mentalhealth.model.ExerciseProgress;
import com.mentalhealth.repository.ExerciseProgressRepository;
import com.mentalhealth.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final ExerciseProgressRepository progressRepository;
    
    public List<Exercise> getAllActiveExercises() {
        return exerciseRepository.findByActiveTrue();
    }
    
    public List<Exercise> getExercisesByType(Exercise.ExerciseType type) {
        return exerciseRepository.findByTypeAndActiveTrue(type);
    }
    
    public Exercise getExerciseById(String id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
    }
    
    public ExerciseProgress startExercise(String userId, String exerciseId) {
        Exercise exercise = getExerciseById(exerciseId);
        
        ExerciseProgress progress = ExerciseProgress.builder()
                .userId(userId)
                .exerciseId(exerciseId)
                .completed(false)
                .build();
        
        return progressRepository.save(progress);
    }
    
    public ExerciseProgress completeExercise(String progressId, String userId, Integer rating, String feedback) {
        ExerciseProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new RuntimeException("Progress not found"));
        
        if (!progress.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        progress.setRating(rating);
        progress.setFeedback(feedback);
        
        if (progress.getStartedAt() != null) {
            long minutes = java.time.Duration.between(progress.getStartedAt(), progress.getCompletedAt()).toMinutes();
            progress.setDurationMinutes((int) minutes);
        }
        
        return progressRepository.save(progress);
    }
    
    public List<ExerciseProgress> getUserProgress(String userId) {
        return progressRepository.findByUserIdOrderByStartedAtDesc(userId);
    }
    
    public Map<String, Object> getUserExerciseStats(String userId) {
        List<ExerciseProgress> allProgress = getUserProgress(userId);
        Long completedCount = progressRepository.countByUserIdAndCompletedTrue(userId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStarted", allProgress.size());
        stats.put("totalCompleted", completedCount);
        stats.put("recentProgress", allProgress.stream().limit(10).toList());
        
        return stats;
    }
    
    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }
}
