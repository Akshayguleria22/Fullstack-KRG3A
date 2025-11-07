import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Send,
  Circle,
  Search,
  MarkChatRead,
  Person,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode } from '../context/ThemeContext';
import { chatAPI } from '../services/api';

const CounselorChat = () => {
  const { mode } = useThemeMode();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const mockSessions = [
    {
      id: 1,
      userName: 'John Doe',
      lastMessage: 'I need help with anxiety',
      timestamp: new Date(),
      unread: 3,
      status: 'active',
      avatar: 'J',
    },
    {
      id: 2,
      userName: 'Sarah Smith',
      lastMessage: 'Thank you for your support',
      timestamp: new Date(Date.now() - 3600000),
      unread: 0,
      status: 'waiting',
      avatar: 'S',
    },
    {
      id: 3,
      userName: 'Mike Johnson',
      lastMessage: 'Can we schedule a session?',
      timestamp: new Date(Date.now() - 7200000),
      unread: 1,
      status: 'active',
      avatar: 'M',
    },
  ];

  const mockMessages = {
    1: [
      {
        id: 1,
        content: 'Hello, I need help with my anxiety',
        sender: 'user',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: 2,
        content: 'Hi! I\'m here to help. Can you tell me more about what you\'re experiencing?',
        sender: 'counselor',
        timestamp: new Date(Date.now() - 3500000),
      },
      {
        id: 3,
        content: 'I feel overwhelmed at work and can\'t sleep well',
        sender: 'user',
        timestamp: new Date(Date.now() - 3400000),
      },
    ],
  };

  useEffect(() => {
    setSessions(mockSessions);
  }, []);

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setMessages(mockMessages[session.id] || []);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !selectedSession) return;

    const newMessage = {
      id: messages.length + 1,
      content: inputMessage,
      sender: 'counselor',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const filteredSessions = sessions.filter((session) =>
    session.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Counselor Dashboard 👨‍⚕️
      </Typography>

      <Grid container spacing={3} sx={{ height: '75vh' }}>
        {/* Sessions List */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              height: '100%',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Active Conversations
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ mt: 1 }}
              />
            </Box>

            <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
              {filteredSessions.map((session) => (
                <ListItem key={session.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelectSession(session)}
                    selected={selectedSession?.id === session.id}
                    sx={{
                      py: 2,
                      px: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      backgroundColor:
                        selectedSession?.id === session.id
                          ? mode === 'dark'
                            ? 'rgba(102, 126, 234, 0.1)'
                            : 'rgba(102, 126, 234, 0.05)'
                          : 'transparent',
                      '&:hover': {
                        backgroundColor:
                          mode === 'dark'
                            ? 'rgba(102, 126, 234, 0.15)'
                            : 'rgba(102, 126, 234, 0.08)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={session.unread}
                        color="error"
                        overlap="circular"
                      >
                        <Avatar
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 700,
                          }}
                        >
                          {session.avatar}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {session.userName}
                          </Typography>
                          <Circle
                            sx={{
                              fontSize: 8,
                              color: session.status === 'active' ? 'success.main' : 'warning.main',
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {session.lastMessage}
                        </Typography>
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                      {session.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          {selectedSession ? (
            <Paper
              sx={{
                height: '100%',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: mode === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                  : '0 8px 32px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 700,
                    }}
                  >
                    {selectedSession.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedSession.userName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Circle sx={{ fontSize: 8, color: 'success.light' }} />
                      <Typography variant="caption">Active now</Typography>
                    </Box>
                  </Box>
                </Box>
                <Chip
                  icon={<MarkChatRead />}
                  label="Mark as Resolved"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                />
              </Box>

              {/* Messages */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  p: 3,
                  backgroundColor: mode === 'dark' ? 'background.default' : '#f5f5f5',
                }}
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: message.sender === 'counselor' ? 'flex-end' : 'flex-start',
                          mb: 2,
                        }}
                      >
                        {message.sender === 'user' && (
                          <Avatar
                            sx={{
                              mr: 1.5,
                              bgcolor: 'secondary.main',
                              width: 36,
                              height: 36,
                            }}
                          >
                            {selectedSession.avatar}
                          </Avatar>
                        )}
                        <Box
                          sx={{
                            maxWidth: '70%',
                            p: 2,
                            borderRadius: 3,
                            background:
                              message.sender === 'counselor'
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'white',
                            color: message.sender === 'counselor' ? 'white' : 'text.primary',
                            boxShadow: mode === 'dark'
                              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                              : '0 2px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <Typography variant="body1">{message.content}</Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.7,
                              display: 'block',
                              mt: 0.5,
                            }}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>

              {/* Input Area */}
              <Box
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  backgroundColor: mode === 'dark' ? 'background.paper' : 'white',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Type your response..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={sendMessage}
                    disabled={!inputMessage.trim()}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      width: 56,
                      height: 56,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #64408a 100%)',
                      },
                      '&.Mui-disabled': {
                        opacity: 0.5,
                      },
                    }}
                  >
                    <Send />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{
                height: '100%',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: mode === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                  : '0 8px 32px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Person sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start chatting
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CounselorChat;
