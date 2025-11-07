package com.mentalhealth.repository;

import com.mentalhealth.model.ChatSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends MongoRepository<ChatSession, String> {
    List<ChatSession> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<ChatSession> findByCounselorIdOrderByCreatedAtDesc(String counselorId);
    
    List<ChatSession> findByStatus(ChatSession.SessionStatus status);
    
    Optional<ChatSession> findByUserIdAndStatus(String userId, ChatSession.SessionStatus status);
}
