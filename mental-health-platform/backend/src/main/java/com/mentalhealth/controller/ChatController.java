package com.mentalhealth.controller;

import com.mentalhealth.model.ChatMessage;
import com.mentalhealth.model.ChatSession;
import com.mentalhealth.security.UserPrincipal;
import com.mentalhealth.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    
    @PostMapping("/api/chat/session")
    @ResponseBody
    public ResponseEntity<ChatSession> createSession(@AuthenticationPrincipal UserPrincipal currentUser) {
        ChatSession session = chatService.createSession(currentUser.getId());
        return ResponseEntity.ok(session);
    }
    
    @GetMapping("/api/chat/session/{sessionId}")
    @ResponseBody
    public ResponseEntity<ChatSession> getSession(@PathVariable String sessionId) {
        ChatSession session = chatService.getSession(sessionId);
        return ResponseEntity.ok(session);
    }
    
    @GetMapping("/api/chat/sessions")
    @ResponseBody
    public ResponseEntity<List<ChatSession>> getUserSessions(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<ChatSession> sessions = chatService.getUserSessions(currentUser.getId());
        return ResponseEntity.ok(sessions);
    }
    
    @PostMapping("/api/chat/session/{sessionId}/end")
    @ResponseBody
    public ResponseEntity<ChatSession> endSession(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String sessionId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String feedback) {
        ChatSession session = chatService.endSession(sessionId, currentUser.getId(), rating, feedback);
        return ResponseEntity.ok(session);
    }
    
    @MessageMapping("/chat/{sessionId}/send")
    public void sendMessage(
            @DestinationVariable String sessionId,
            @Payload Map<String, String> message) {
        chatService.sendMessage(
                sessionId,
                message.get("senderId"),
                message.get("content"),
                message.get("senderRole")
        );
    }
}
