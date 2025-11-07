package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String senderId;
    
    private String senderRole; // USER or COUNSELOR
    
    private String content;
    
    private String encryptedContent; // Encrypted message
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    
    @Builder.Default
    private Boolean isRead = false;
    
    private MessageType type;
    
    public enum MessageType {
        TEXT,
        SYSTEM,
        NOTIFICATION
    }
}
