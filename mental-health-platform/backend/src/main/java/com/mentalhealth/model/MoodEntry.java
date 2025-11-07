package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "mood_entries")
public class MoodEntry {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    @Indexed
    private LocalDate date;
    
    private Integer moodScore; // 1-10
    
    private String moodLabel; // e.g., "Happy", "Sad", "Anxious", "Calm"
    
    private String notes;
    
    private String journalEntry;
    
    private String[] activities; // Activities done that day
    
    private Integer sleepHours;
    
    private Integer exerciseMinutes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
