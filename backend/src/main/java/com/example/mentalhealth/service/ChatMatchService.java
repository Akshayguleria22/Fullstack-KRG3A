package com.example.mentalhealth.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatMatchService {
    // Online userId -> role
    private final Map<String, String> onlineRoles = new ConcurrentHashMap<>();

    // sessionId -> pair "userId:counselorId"
    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    public void setOnline(String userId, String role) {
        onlineRoles.put(userId, role);
    }

    public void setOffline(String userId) {
        onlineRoles.remove(userId);
        // Optional: clean up sessions where this user participates
        sessions.entrySet().removeIf(e -> e.getValue().contains(userId));
    }

    public Optional<String> findAvailableCounselor() {
        return onlineRoles.entrySet().stream()
                .filter(e -> "COUNSELOR".equals(e.getValue()))
                .map(Map.Entry::getKey)
                .findAny();
    }

    public String createSession(String userId, String counselorId) {
        String sessionId = UUID.randomUUID().toString();
        sessions.put(sessionId, userId + ":" + counselorId);
        return sessionId;
    }

    public Optional<String> getPeer(String sessionId, String requesterId) {
        String pair = sessions.get(sessionId);
        if (pair == null) return Optional.empty();
        String[] parts = pair.split(":");
        if (parts.length != 2) return Optional.empty();
        return Optional.of(parts[0].equals(requesterId) ? parts[1] : parts[0]);
    }

    public Set<String> getActiveSessionIds() { return sessions.keySet(); }
}
