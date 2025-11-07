package com.mentalhealth.repository;

import com.mentalhealth.model.ExerciseProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseProgressRepository extends MongoRepository<ExerciseProgress, String> {
    List<ExerciseProgress> findByUserIdOrderByStartedAtDesc(String userId);
    
    List<ExerciseProgress> findByUserIdAndExerciseId(String userId, String exerciseId);
    
    Long countByUserIdAndCompletedTrue(String userId);
    
    List<ExerciseProgress> findByUserIdAndCompletedTrue(String userId);
}
