import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Send, SmartToy, Person, AutoAwesome } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/common';
import { chatApi } from '../api';
import type { ChatMessage, Product } from '../types';

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const response = await chatApi.createSession('New Chat');
      setSessionId(response.data.id);

      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: 'Hello! I\'m your RetailIQ AI assistant. I can help you find products, compare prices, and provide buying recommendations. How can I assist you today?',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        followUpQuestions: [
          'Show me trending products',
          'Find best deals on smartphones',
          'When should I buy a laptop?',
          'Compare prices for headphones',
        ],
      };
      setMessages([welcomeMessage]);
    } catch (err) {
      console.error('Failed to initialize chat:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(input, sessionId || undefined);
      const aiMessage = response.data.message;

      if (response.data.products) {
        aiMessage.products = response.data.products;
      }

      if (response.data.suggestions) {
        aiMessage.followUpQuestions = response.data.suggestions;
      }

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', py: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SmartToy color="primary" />
        {t('chat.title')}
      </Typography>

      {/* Chat Messages */}
      <Paper
        elevation={2}
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3,
          mb: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%', gap: 1 }}>
              {message.sender === 'ai' && (
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <SmartToy fontSize="small" />
                </Avatar>
              )}

              <Box>
                <Card
                  sx={{
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </Typography>

                    {/* Product Cards */}
                    {message.products && message.products.length > 0 && (
                      <Box sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                        {message.products.slice(0, 4).map((product: Product) => (
                          <Box key={product.id} onClick={() => navigate(`/consumer/history?product=${product.id}`)}>
                            <ProductCard product={product} />
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Prediction/Recommendation */}
                    {message.recommendation && (
                      <Card sx={{ mt: 2, bgcolor: 'info.light' }}>
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Recommendation
                          </Typography>
                          <Typography variant="body2">{message.recommendation.reasoning}</Typography>
                          <Chip
                            label={message.recommendation.action.replace('_', ' ').toUpperCase()}
                            size="small"
                            color="primary"
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    )}

                    {/* Follow-up Questions */}
                    {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                        {message.followUpQuestions.map((q, idx) => (
                          <Chip
                            key={idx}
                            label={q}
                            size="small"
                            onClick={() => handleQuickReply(q)}
                            icon={<AutoAwesome />}
                            sx={{ cursor: 'pointer' }}
                          />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, px: 1 }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>

              {message.sender === 'user' && (
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <Person fontSize="small" />
                </Avatar>
              )}
            </Box>
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <SmartToy fontSize="small" />
            </Avatar>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">AI is thinking...</Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Paper>

      {/* Input Area */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about products, prices, or deals..."
            disabled={loading}
            variant="outlined"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            sx={{ alignSelf: 'flex-end' }}
          >
            <Send />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatPage;
