package com.example.mentalhealth.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document("moods")
public class MoodEntry {
    @Id
    private String id;
    private String userId;
    private int score; // 1..10
    private String note;
    @CreatedDate
    private Instant createdAt;
}
