package com.mentalhealth.repository;

import com.mentalhealth.model.MoodEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MoodEntryRepository extends MongoRepository<MoodEntry, String> {
    List<MoodEntry> findByUserIdOrderByDateDesc(String userId);
    
    List<MoodEntry> findByUserIdAndDateBetweenOrderByDateDesc(
        String userId, LocalDate startDate, LocalDate endDate
    );
    
    Optional<MoodEntry> findByUserIdAndDate(String userId, LocalDate date);
    
    Long countByUserId(String userId);
}
