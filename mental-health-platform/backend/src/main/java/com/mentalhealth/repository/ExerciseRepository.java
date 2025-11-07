package com.mentalhealth.repository;

import com.mentalhealth.model.Exercise;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends MongoRepository<Exercise, String> {
    List<Exercise> findByActiveTrue();
    
    List<Exercise> findByType(Exercise.ExerciseType type);
    
    List<Exercise> findByDifficulty(Exercise.DifficultyLevel difficulty);
    
    List<Exercise> findByTypeAndActiveTrue(Exercise.ExerciseType type);
}
