package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "exercise_progress")
public class ExerciseProgress {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    @Indexed
    private String exerciseId;
    
    private Boolean completed;
    
    @CreatedDate
    private LocalDateTime startedAt;
    
    private LocalDateTime completedAt;
    
    private Integer rating; // 1-5
    
    private String feedback;
    
    private Integer durationMinutes;
}
