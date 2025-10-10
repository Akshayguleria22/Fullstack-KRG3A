package com.example.mentalhealth.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Data
@Document("exercise_progress")
public class ExerciseProgress {
    @Id
    private String id; // userId
    private Map<String, Integer> progress = new HashMap<>();
}
