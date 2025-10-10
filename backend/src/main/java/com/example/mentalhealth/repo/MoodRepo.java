package com.example.mentalhealth.repo;

import com.example.mentalhealth.model.MoodEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MoodRepo extends MongoRepository<MoodEntry, String> {
    List<MoodEntry> findByUserIdOrderByCreatedAtAsc(String userId);
}
