import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Send, Close, SupportAgent, Brightness1 } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAPI } from '../services/api';
import websocketService from '../services/websocket';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const Chat = () => {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { mode } = useThemeMode();

  useEffect(() => {
    return () => {
      if (session) {
        websocketService.disconnect();
      }
    };
  }, [session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startSession = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.createSession();
      const newSession = response.data;
      setSession(newSession);
      setMessages(newSession.messages || []);

      websocketService.connect(newSession.id, (message) => {
        setMessages((prev) => [...prev, message]);
      });
    } catch (error) {
      console.error('Error starting session:', error);
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    try {
      await chatAPI.endSession(session.id);
      websocketService.disconnect();
      setSession(null);
      setMessages([]);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !session) return;

    websocketService.sendMessage(
      session.id,
      user.id,
      inputMessage,
      'USER'
    );

    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              boxShadow: mode === 'dark'
                ? '0 12px 48px rgba(0, 0, 0, 0.5)'
                : '0 12px 48px rgba(0, 0, 0, 0.08)',
              background: mode === 'dark'
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)',
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <SupportAgent
                sx={{
                  fontSize: 100,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              />
            </motion.div>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              💬 Chat with a Counselor
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 2 }}>
              Connect with a professional counselor for confidential support
            </Typography>
            <Box
              sx={{
                my: 4,
                p: 4,
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                color: mode === 'dark' ? 'text.primary' : 'white',
                position: 'relative',
                overflow: 'hidden',
                border: mode === 'dark' ? '1px solid rgba(102, 126, 234, 0.3)' : 'none',
              }}
            >
              {/* Floating circles */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: mode === 'dark'
                    ? 'rgba(102, 126, 234, 0.1)'
                    : 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: mode === 'dark'
                    ? 'rgba(118, 75, 162, 0.1)'
                    : 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Typography variant="h6" gutterBottom sx={{ position: 'relative', fontWeight: 600 }}>
                🔒 Your Privacy Matters
              </Typography>
              <Typography variant="body2" sx={{ position: 'relative' }}>
                All conversations are encrypted and confidential. Our counselors are
                here to support you in a safe, non-judgmental environment.
              </Typography>
            </Box>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                onClick={startSession}
                disabled={loading}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #64408a 100%)',
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={24} color="inherit" />
                    Connecting...
                  </Box>
                ) : (
                  'Start Chat Session'
                )}
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            height: '75vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: mode === 'dark'
              ? '0 12px 48px rgba(0, 0, 0, 0.5)'
              : '0 12px 48px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                }}
              >
                <SupportAgent />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Professional Counselor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Brightness1 sx={{ fontSize: 10, color: 'success.light' }} />
                  <Typography variant="caption">Online • Ready to help</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="Active Session"
                size="small"
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <IconButton
                color="inherit"
                onClick={endSession}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Container */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 3,
              backgroundColor: mode === 'dark' ? 'background.default' : '#f5f5f5',
              backgroundImage: mode === 'dark'
                ? 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)'
                : 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%)',
            }}
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent:
                        message.senderRole === 'USER' ? 'flex-end' : 'flex-start',
                      mb: 2.5,
                    }}
                  >
                    {message.senderRole === 'COUNSELOR' && (
                      <Avatar
                        sx={{
                          mr: 1.5,
                          bgcolor: 'primary.main',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          width: 36,
                          height: 36,
                        }}
                      >
                        C
                      </Avatar>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      style={{ maxWidth: '70%' }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background:
                            message.senderRole === 'USER'
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'white',
                          color: message.senderRole === 'USER' ? 'white' : 'text.primary',
                          boxShadow:
                            message.senderRole === 'USER'
                              ? '0 4px 16px rgba(102, 126, 234, 0.3)'
                              : mode === 'dark'
                              ? '0 4px 16px rgba(0, 0, 0, 0.3)'
                              : '0 4px 16px rgba(0, 0, 0, 0.08)',
                          border:
                            message.senderRole === 'COUNSELOR' && mode === 'dark'
                              ? '1px solid rgba(255, 255, 255, 0.1)'
                              : 'none',
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            display: 'block',
                            mt: 0.5,
                            fontSize: '0.7rem',
                          }}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </motion.div>
                    {message.senderRole === 'USER' && (
                      <Avatar
                        sx={{
                          ml: 1.5,
                          bgcolor: 'secondary.main',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          width: 36,
                          height: 36,
                          fontWeight: 700,
                        }}
                      >
                        {user.username[0].toUpperCase()}
                      </Avatar>
                    )}
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      mr: 1.5,
                      bgcolor: 'primary.main',
                      width: 36,
                      height: 36,
                    }}
                  >
                    C
                  </Avatar>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                      display: 'flex',
                      gap: 0.5,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'text.secondary',
                            opacity: 0.6,
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: mode === 'dark' ? 'background.paper' : 'white',
              borderTop: 1,
              borderColor: 'divider',
              boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5',
                    '&:hover': {
                      backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#eeeeee',
                    },
                  },
                }}
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    width: 56,
                    height: 56,
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #64408a 100%)',
                      boxShadow: '0 6px 24px rgba(102, 126, 234, 0.4)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)',
                    },
                  }}
                >
                  <Send />
                </IconButton>
              </motion.div>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Chat;
