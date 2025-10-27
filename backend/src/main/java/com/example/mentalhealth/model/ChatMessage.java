package com.example.mentalhealth.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document("chat_messages")
public class ChatMessage {
    @Id
    private String id;

    @Indexed
    private String sessionId; // chat session identifier linking a user and counselor

    private String senderId;
    private String receiverId;

    // Encrypted payload
    private String ivB64;
    private String cipherTextB64;

    private Instant createdAt = Instant.now();
    private Instant deliveredAt; // set when delivered ack received
    private Instant seenAt;      // set when seen/read ack received
}
