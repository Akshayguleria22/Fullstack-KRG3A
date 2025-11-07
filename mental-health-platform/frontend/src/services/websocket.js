import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  connect(sessionId, onMessageReceived) {
    const socket = new SockJS('http://localhost:8081/ws');
    
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        this.isConnected = true;
        
        // Subscribe to the session's topic
        this.client.subscribe(`/topic/chat/${sessionId}`, (message) => {
          const chatMessage = JSON.parse(message.body);
          onMessageReceived(chatMessage);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    this.client.activate();
  }

  sendMessage(sessionId, senderId, content, senderRole) {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/chat/${sessionId}/send`,
        body: JSON.stringify({
          senderId,
          content,
          senderRole,
        }),
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.isConnected = false;
    }
  }
}

export default new WebSocketService();
