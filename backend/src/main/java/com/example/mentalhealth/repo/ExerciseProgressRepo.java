package com.example.mentalhealth.repo;

import com.example.mentalhealth.model.ExerciseProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExerciseProgressRepo extends MongoRepository<ExerciseProgress, String> {
}
