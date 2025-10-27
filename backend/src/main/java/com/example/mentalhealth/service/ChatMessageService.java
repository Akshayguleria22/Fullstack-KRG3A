package com.example.mentalhealth.service;

import com.example.mentalhealth.model.ChatMessage;
import com.example.mentalhealth.repo.ChatMessageRepo;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ChatMessageService {
    private final ChatMessageRepo repo;
    private final CryptoService crypto;

    public ChatMessageService(ChatMessageRepo repo, CryptoService crypto) {
        this.repo = repo;
        this.crypto = crypto;
    }

    public ChatMessage save(String sessionId, String senderId, String receiverId, String plaintext) {
        var enc = crypto.encrypt(plaintext);
        ChatMessage msg = new ChatMessage();
        msg.setSessionId(sessionId);
        msg.setSenderId(senderId);
        msg.setReceiverId(receiverId);
        msg.setIvB64(enc.ivB64());
        msg.setCipherTextB64(enc.cipherTextB64());
        return repo.save(msg);
    }

    public void markDelivered(String messageId) {
        repo.findById(messageId).ifPresent(m -> { m.setDeliveredAt(Instant.now()); repo.save(m); });
    }

    public void markSeen(String messageId) {
        repo.findById(messageId).ifPresent(m -> { m.setSeenAt(Instant.now()); repo.save(m); });
    }
}
