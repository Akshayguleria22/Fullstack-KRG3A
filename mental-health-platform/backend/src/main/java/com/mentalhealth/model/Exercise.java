package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "exercises")
public class Exercise {
    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    private ExerciseType type;
    
    private Integer durationMinutes;
    
    private DifficultyLevel difficulty;
    
    private String instructions;
    
    private String[] steps;
    
    private String videoUrl;
    
    private String audioUrl;
    
    private String imageUrl;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @Builder.Default
    private Boolean active = true;
    
    public enum ExerciseType {
        MEDITATION,
        BREATHING,
        CBT,
        MINDFULNESS,
        JOURNALING,
        PHYSICAL
    }
    
    public enum DifficultyLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }
}
