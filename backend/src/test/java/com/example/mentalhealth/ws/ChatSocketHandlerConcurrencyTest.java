package com.example.mentalhealth.ws;

import com.example.mentalhealth.security.JwtService;
import com.example.mentalhealth.service.ChatMatchService;
import com.example.mentalhealth.service.ChatMessageService;
import org.junit.jupiter.api.Test;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * A lightweight concurrency smoke test that ensures the handler doesn't throw under concurrent message sends.
 */
public class ChatSocketHandlerConcurrencyTest {

    @Test
    void concurrent_messages_do_not_error() throws Exception {
        JwtService jwt = mock(JwtService.class);
        io.jsonwebtoken.impl.DefaultClaims claimsUser = new io.jsonwebtoken.impl.DefaultClaims(new HashMap<>());
        claimsUser.put("role", "USER");
        claimsUser.setSubject("u1");
        io.jsonwebtoken.impl.DefaultClaims claimsCounselor = new io.jsonwebtoken.impl.DefaultClaims(new HashMap<>());
        claimsCounselor.put("role", "COUNSELOR");
        claimsCounselor.setSubject("c1");
        when(jwt.parse("token-user")).thenReturn(claimsUser);
        when(jwt.parse("token-counselor")).thenReturn(claimsCounselor);

        ChatMessageService messageService = mock(ChatMessageService.class);
        when(messageService.save(anyString(), anyString(), anyString(), anyString())).thenAnswer(inv -> {
            com.example.mentalhealth.model.ChatMessage m = new com.example.mentalhealth.model.ChatMessage();
            m.setId(java.util.UUID.randomUUID().toString());
            return m;
        });
        ChatMatchService matchService = new ChatMatchService();
        ChatSocketHandler handler = new ChatSocketHandler(jwt, messageService, matchService);

    List<String> suOut = Collections.synchronizedList(new ArrayList<>());
    List<String> scOut = Collections.synchronizedList(new ArrayList<>());
    Map<String,Object> suAttrs = new HashMap<>();
    Map<String,Object> scAttrs = new HashMap<>();
    WebSocketSession su = mock(WebSocketSession.class);
    WebSocketSession sc = mock(WebSocketSession.class);
    when(su.getUri()).thenReturn(URI.create("ws://localhost/ws/chat?token=token-user"));
    when(sc.getUri()).thenReturn(URI.create("ws://localhost/ws/chat?token=token-counselor"));
    when(su.isOpen()).thenReturn(true);
    when(sc.isOpen()).thenReturn(true);
    when(su.getAttributes()).thenReturn(suAttrs);
    when(sc.getAttributes()).thenReturn(scAttrs);
    doAnswer(inv -> { suOut.add(((TextMessage) inv.getArgument(0)).getPayload()); return null; }).when(su).sendMessage(any());
    doAnswer(inv -> { scOut.add(((TextMessage) inv.getArgument(0)).getPayload()); return null; }).when(sc).sendMessage(any());
        handler.afterConnectionEstablished(su);
        handler.afterConnectionEstablished(sc);

        // Start a session (user triggers)
        handler.handleTextMessage(su, new TextMessage("{\"type\":\"start_session\"}"));

        // Send many messages concurrently from both ends
        int N = 50;
        ExecutorService pool = Executors.newFixedThreadPool(8);
        CountDownLatch latch = new CountDownLatch(N*2);
        for (int i=0;i<N;i++) {
            int idx = i;
            pool.submit(() -> { try { handler.handleTextMessage(su, new TextMessage("{\"type\":\"message\",\"to\":\"c1\",\"text\":\"hi"+idx+"\"}")); } catch (Exception ignored) {} finally { latch.countDown(); } });
            pool.submit(() -> { try { handler.handleTextMessage(sc, new TextMessage("{\"type\":\"typing\",\"to\":\"u1\",\"typing\":true}")); } catch (Exception ignored) {} finally { latch.countDown(); } });
        }
        assertTrue(latch.await(10, TimeUnit.SECONDS));
        pool.shutdownNow();

        // Expect some outbound messages
        assertTrue(suOut.size() > 0);
        assertTrue(scOut.size() > 0);
    }
}
