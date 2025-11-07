package com.mentalhealth.service;

import com.mentalhealth.model.MoodEntry;
import com.mentalhealth.repository.MoodEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoodService {
    private final MoodEntryRepository moodEntryRepository;
    
    public MoodEntry createMoodEntry(String userId, MoodEntry entry) {
        entry.setUserId(userId);
        entry.setUpdatedAt(LocalDateTime.now());
        
        Optional<MoodEntry> existing = moodEntryRepository.findByUserIdAndDate(userId, entry.getDate());
        if (existing.isPresent()) {
            MoodEntry existingEntry = existing.get();
            existingEntry.setMoodScore(entry.getMoodScore());
            existingEntry.setMoodLabel(entry.getMoodLabel());
            existingEntry.setNotes(entry.getNotes());
            existingEntry.setJournalEntry(entry.getJournalEntry());
            existingEntry.setActivities(entry.getActivities());
            existingEntry.setSleepHours(entry.getSleepHours());
            existingEntry.setExerciseMinutes(entry.getExerciseMinutes());
            existingEntry.setUpdatedAt(LocalDateTime.now());
            return moodEntryRepository.save(existingEntry);
        }
        
        return moodEntryRepository.save(entry);
    }
    
    public List<MoodEntry> getUserMoodEntries(String userId) {
        return moodEntryRepository.findByUserIdOrderByDateDesc(userId);
    }
    
    public List<MoodEntry> getMoodEntriesByDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        return moodEntryRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
    }
    
    public Map<String, Object> getMoodAnalytics(String userId, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        List<MoodEntry> entries = getMoodEntriesByDateRange(userId, startDate, endDate);
        
        Map<String, Object> analytics = new HashMap<>();
        
        if (entries.isEmpty()) {
            analytics.put("averageMood", 0);
            analytics.put("totalEntries", 0);
            analytics.put("moodTrend", "neutral");
            analytics.put("entries", Collections.emptyList());
            return analytics;
        }
        
        double averageMood = entries.stream()
                .mapToInt(MoodEntry::getMoodScore)
                .average()
                .orElse(0);
        
        Map<String, Long> moodDistribution = entries.stream()
                .collect(Collectors.groupingBy(MoodEntry::getMoodLabel, Collectors.counting()));
        
        String trend = calculateTrend(entries);
        
        analytics.put("averageMood", Math.round(averageMood * 100.0) / 100.0);
        analytics.put("totalEntries", entries.size());
        analytics.put("moodTrend", trend);
        analytics.put("moodDistribution", moodDistribution);
        analytics.put("entries", entries);
        
        return analytics;
    }
    
    private String calculateTrend(List<MoodEntry> entries) {
        if (entries.size() < 2) return "neutral";
        
        List<MoodEntry> sortedEntries = entries.stream()
                .sorted(Comparator.comparing(MoodEntry::getDate))
                .collect(Collectors.toList());
        
        int halfSize = sortedEntries.size() / 2;
        double firstHalfAvg = sortedEntries.subList(0, halfSize).stream()
                .mapToInt(MoodEntry::getMoodScore)
                .average()
                .orElse(0);
        
        double secondHalfAvg = sortedEntries.subList(halfSize, sortedEntries.size()).stream()
                .mapToInt(MoodEntry::getMoodScore)
                .average()
                .orElse(0);
        
        if (secondHalfAvg > firstHalfAvg + 0.5) return "improving";
        if (secondHalfAvg < firstHalfAvg - 0.5) return "declining";
        return "stable";
    }
    
    public void deleteMoodEntry(String id, String userId) {
        MoodEntry entry = moodEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mood entry not found"));
        
        if (!entry.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        moodEntryRepository.delete(entry);
    }
}
