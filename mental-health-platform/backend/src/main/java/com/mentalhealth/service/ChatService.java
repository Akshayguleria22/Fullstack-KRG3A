package com.mentalhealth.service;

import com.mentalhealth.model.ChatMessage;
import com.mentalhealth.model.ChatSession;
import com.mentalhealth.repository.ChatSessionRepository;
import com.mentalhealth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatSessionRepository chatSessionRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    public ChatSession createSession(String userId) {
        // Check if user already has an active session
        Optional<ChatSession> existingSession = chatSessionRepository
                .findByUserIdAndStatus(userId, ChatSession.SessionStatus.ACTIVE);
        
        if (existingSession.isPresent()) {
            return existingSession.get();
        }
        
        // Find available counselor (simplified - in production, use proper matching logic)
        String counselorId = findAvailableCounselor();
        
        ChatSession session = ChatSession.builder()
                .userId(userId)
                .counselorId(counselorId)
                .status(ChatSession.SessionStatus.ACTIVE)
                .build();
        
        return chatSessionRepository.save(session);
    }
    
    public ChatMessage sendMessage(String sessionId, String senderId, String content, String senderRole) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        ChatMessage message = ChatMessage.builder()
                .senderId(senderId)
                .senderRole(senderRole)
                .content(content)
                .type(ChatMessage.MessageType.TEXT)
                .build();
        
        session.getMessages().add(message);
        chatSessionRepository.save(session);
        
        // Send message via WebSocket
        String destination = "/topic/chat/" + sessionId;
        messagingTemplate.convertAndSend(destination, message);
        
        return message;
    }
    
    public ChatSession getSession(String sessionId) {
        return chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }
    
    public List<ChatSession> getUserSessions(String userId) {
        return chatSessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public ChatSession endSession(String sessionId, String userId, Integer rating, String feedback) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!session.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        session.setStatus(ChatSession.SessionStatus.ENDED);
        session.setEndedAt(LocalDateTime.now());
        session.setRating(rating);
        session.setFeedback(feedback);
        
        return chatSessionRepository.save(session);
    }
    
    private String findAvailableCounselor() {
        // Simplified counselor assignment
        // In production, implement proper matching algorithm
        List<com.mentalhealth.model.User> counselors = userRepository
                .findByRolesContaining(com.mentalhealth.model.User.Role.ROLE_COUNSELOR);
        
        if (counselors.isEmpty()) {
            // Return a default counselor ID or throw exception
            return "default-counselor";
        }
        
        return counselors.get(0).getId();
    }
}
