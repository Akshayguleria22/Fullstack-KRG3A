package com.example.mentalhealth.ws;

import com.example.mentalhealth.security.JwtService;
import com.example.mentalhealth.service.ChatMatchService;
import com.example.mentalhealth.service.ChatMessageService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatSocketHandler extends TextWebSocketHandler {
    private final JwtService jwtService;
    private final ChatMessageService messageService;
    private final ChatMatchService matchService;
    private final ObjectMapper mapper = new ObjectMapper();

    // userId -> sessions
    private final Map<String, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();
    // session attribute keys
    private static final String ATTR_USER_ID = "userId";
    private static final String ATTR_ROLE = "role";
    private static final String ATTR_ACTIVE_SESSION_ID = "chatSessionId";

    public ChatSocketHandler(JwtService jwtService, ChatMessageService messageService, ChatMatchService matchService) {
        this.jwtService = jwtService;
        this.messageService = messageService;
        this.matchService = matchService;
    }

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
        String token = tokenFrom(session.getUri());
        if (token == null) { session.close(CloseStatus.NOT_ACCEPTABLE); return; }
        try {
            Claims claims = jwtService.parse(token);
            String userId = claims.getSubject();
            Object rolesClaim = claims.get("roles");
            String role;
            if (rolesClaim instanceof java.util.Collection<?> col) {
                role = col.stream().map(String::valueOf).anyMatch("COUNSELOR"::equals) ? "COUNSELOR" : "USER";
            } else {
                role = String.valueOf(claims.getOrDefault("role", "USER"));
            }
            session.getAttributes().put(ATTR_USER_ID, userId);
            session.getAttributes().put(ATTR_ROLE, role);
            userSessions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(session);
            matchService.setOnline(userId, role);
            // send ack
            ObjectNode payload = obj().put("type","connected").put("userId", userId);
            send(session, payload.toString());
        } catch (Exception e) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
        }
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
        String userId = (String) session.getAttributes().get(ATTR_USER_ID);
        if (userId == null) { session.close(CloseStatus.NOT_ACCEPTABLE); return; }
        JsonNode node = mapper.readTree(message.getPayload());
        String type = node.path("type").asText("");
        switch (type) {
            case "start_session" -> handleStartSession(session, userId, node);
            case "message" -> handleChatMessage(session, userId, node);
            case "typing" -> handleTyping(session, userId, node);
            case "delivered" -> handleDelivered(userId, node);
            case "seen" -> handleSeen(userId, node);
            default -> {
                if (node.has("cipher") && !node.has("type")) {
                    handleLegacyCipher(session, userId, node);
                } else {
                    ObjectNode payload = obj().put("type","error").put("message","Unknown type");
                    send(session, payload.toString());
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
        String userId = (String) session.getAttributes().get(ATTR_USER_ID);
        if (userId != null) {
            Set<WebSocketSession> set = userSessions.get(userId);
            if (set != null) { set.remove(session); if (set.isEmpty()) userSessions.remove(userId); }
            matchService.setOffline(userId);
        }
    }

    private void handleStartSession(WebSocketSession session, String userId, JsonNode node) throws Exception {
        String role = String.valueOf(session.getAttributes().get(ATTR_ROLE));
        String sessionId;
        String peerId;
        if ("USER".equals(role)) {
            Optional<String> counselor = matchService.findAvailableCounselor();
            if (counselor.isEmpty()) {
                ObjectNode payload = obj().put("type","session_wait").put("message","Waiting for counselor");
                send(session, payload.toString());
                return;
            }
            peerId = counselor.get();
            sessionId = matchService.createSession(userId, peerId);
        } else {
            // counselors can join an existing session if sessionId provided
            sessionId = node.path("sessionId").asText("");
            if (sessionId.isEmpty()) {
                ObjectNode payload = obj().put("type","error").put("message","sessionId required for counselor");
                send(session, payload.toString());
                return;
            }
            peerId = matchService.getPeer(sessionId, userId).orElse(null);
        }
        session.getAttributes().put(ATTR_ACTIVE_SESSION_ID, sessionId);
        // notify both parties
    ObjectNode startPayload = obj().put("type","session_started").put("sessionId", sessionId).put("peerId", peerId);
    send(session, startPayload.toString());
    ObjectNode startPayloadPeer = obj().put("type","session_started").put("sessionId", sessionId).put("peerId", userId);
    broadcastTo(peerId, startPayloadPeer.toString());
    }

    private void handleChatMessage(WebSocketSession session, String userId, JsonNode node) throws Exception {
        String sessionId = (String) session.getAttributes().get(ATTR_ACTIVE_SESSION_ID);
    if (sessionId == null) { ObjectNode payload = obj().put("type","error").put("message","No active session"); send(session, payload.toString()); return; }
        String text = node.path("text").asText("");
        String to = node.path("to").asText("");
    if (text.isEmpty() || to.isEmpty()) { ObjectNode payload = obj().put("type","error").put("message","Invalid payload"); send(session, payload.toString()); return; }
        var saved = messageService.save(sessionId, userId, to, text);
        // echo to sender with messageId
    ObjectNode ack = obj().put("type","message_ack").put("messageId", saved.getId()).put("ts", Instant.now().toString());
    send(session, ack.toString());
    // deliver to receiver
    ObjectNode deliver = obj().put("type","message").put("from", userId).put("sessionId", sessionId).put("messageId", saved.getId()).put("text", text);
    broadcastTo(to, deliver.toString());
    }

    private void handleTyping(WebSocketSession session, String userId, JsonNode node) throws Exception {
        String to = node.path("to").asText("");
        boolean typing = node.path("typing").asBoolean(false);
    ObjectNode payload = obj().put("type","typing").put("from", userId).put("typing", typing);
    broadcastTo(to, payload.toString());
    }

    // Backward-compatibility for clients sending only {cipher}
    private void handleLegacyCipher(WebSocketSession session, String userId, JsonNode node) throws Exception {
        String sessionId = (String) session.getAttributes().get(ATTR_ACTIVE_SESSION_ID);
        if (sessionId == null) {
            ObjectNode payload = obj().put("type","error").put("message","No active session");
            send(session, payload.toString());
            return;
        }
        String to = matchService.getPeer(sessionId, userId).orElse(null);
        if (to == null) {
            ObjectNode payload = obj().put("type","error").put("message","No peer available");
            send(session, payload.toString());
            return;
        }
        String cipher = node.path("cipher").asText("");
        if (cipher.isEmpty()) return;
        var saved = messageService.save(sessionId, userId, to, cipher);
        ObjectNode ack = obj().put("type","message_ack").put("messageId", saved.getId()).put("ts", Instant.now().toString());
        send(session, ack.toString());
        ObjectNode out = obj().put("from", userId).put("cipher", cipher);
        broadcastTo(to, out.toString());
    }

    private void handleDelivered(String userId, JsonNode node) {
        String messageId = node.path("messageId").asText("");
        if (!messageId.isEmpty()) messageService.markDelivered(messageId);
    }

    private void handleSeen(String userId, JsonNode node) {
        String messageId = node.path("messageId").asText("");
        if (!messageId.isEmpty()) messageService.markSeen(messageId);
    }

    private void broadcastTo(String userId, String payload) throws Exception {
        if (userId == null) return;
        Set<WebSocketSession> set = userSessions.get(userId);
        if (set == null) return;
        for (WebSocketSession s : set) {
            if (s.isOpen()) s.sendMessage(new TextMessage(payload));
        }
    }

    private void send(WebSocketSession session, String payload) throws Exception {
        if (session.isOpen()) session.sendMessage(new TextMessage(payload));
    }

    private String tokenFrom(URI uri) {
        if (uri == null || uri.getQuery() == null) return null;
        String[] parts = uri.getQuery().split("&");
        for (String p : parts) {
            if (p.startsWith("token=")) return p.substring(6);
        }
        return null;
    }

    private ObjectNode obj() { return mapper.createObjectNode(); }
}
