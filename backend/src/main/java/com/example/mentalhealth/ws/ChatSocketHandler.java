package com.example.mentalhealth.ws;

import com.example.mentalhealth.security.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatSocketHandler extends TextWebSocketHandler {
    private final JwtService jwtService;
    private final Set<WebSocketSession> sessions = Collections.newSetFromMap(new ConcurrentHashMap<>());

    public ChatSocketHandler(JwtService jwtService) { this.jwtService = jwtService; }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = tokenFrom(session.getUri());
        if (token == null) { session.close(CloseStatus.NOT_ACCEPTABLE); return; }
        try {
            Claims claims = jwtService.parse(token);
            session.getAttributes().put("userId", claims.getSubject());
            sessions.add(session);
        } catch (Exception e) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Object userId = session.getAttributes().get("userId");
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage("{\"from\":\"" + userId + "\",\"cipher\":" + message.getPayload() + "}"));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }

    private String tokenFrom(URI uri) {
        if (uri == null || uri.getQuery() == null) return null;
        String[] parts = uri.getQuery().split("&");
        for (String p : parts) {
            if (p.startsWith("token=")) return p.substring(6);
        }
        return null;
    }
}
