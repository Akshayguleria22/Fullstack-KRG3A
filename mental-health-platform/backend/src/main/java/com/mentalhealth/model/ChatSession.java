package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_sessions")
public class ChatSession {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    @Indexed
    private String counselorId;
    
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();
    
    private SessionStatus status;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime endedAt;
    
    private Integer rating; // 1-5 rating after session
    
    private String feedback;
    
    public enum SessionStatus {
        ACTIVE,
        ENDED,
        PENDING
    }
}
