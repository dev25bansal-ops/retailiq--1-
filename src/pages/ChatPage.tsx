import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Avatar,
  Chip,
  Card,
  CardContent,
  Stack,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Send as SendIcon,
  Star as StarIcon,
  AutoAwesome,
} from '@mui/icons-material';
import type { ChatMessage, Product } from '../types';
import { formatINR, getPlatformColor, getPlatformName } from '../utils/formatters';
import { generateAIResponse } from '../utils/chatResponses';
import { sampleProducts } from '../data/sampleData';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your RetailIQ AI Shopping Assistant. I can help you find the best deals, compare prices across Amazon and Flipkart, and recommend products based on your budget. What are you looking for today?",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(query, sampleProducts);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.text,
        timestamp: new Date().toISOString(),
        products: aiResponse.products,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      inputRef.current?.focus();
    }, 1200 + Math.random() * 800);
  };

  const getProductTag = (product: Product): { label: string; color: string } => {
    const discount = ((product.original_price - product.current_price) / product.original_price) * 100;
    if (discount > 20) return { label: 'BEST VALUE', color: '#10b981' };
    if (product.rating >= 4.5) return { label: 'TOP RATED', color: '#3b82f6' };
    if (product.current_price < 30000) return { label: 'BUDGET PICK', color: '#f59e0b' };
    return { label: 'POPULAR', color: '#8b5cf6' };
  };

  const quickActions = [
    'Best phone under 30k',
    'Compare earbuds',
    'Festival deals',
    'Price drop alerts',
    'Laptop recommendations',
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', mx: -3, my: -3 }}>
      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: { xs: 2, sm: 3 },
          py: 3,
        }}
      >
        <Container maxWidth="md" disableGutters>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2.5,
                animation: 'fadeInUp 0.3s ease',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(8px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {message.role === 'assistant' && (
                <Avatar
                  sx={{
                    bgcolor: '#1a237e',
                    mr: 1.5,
                    mt: 0.5,
                    width: 36,
                    height: 36,
                    boxShadow: '0 2px 8px rgba(26,35,126,0.2)',
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 18 }} />
                </Avatar>
              )}

              <Box sx={{ maxWidth: message.role === 'user' ? '75%' : '82%', minWidth: 0 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: message.role === 'user' ? '#1a237e' : '#fff',
                    color: message.role === 'user' ? '#fff' : 'text.primary',
                    borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    border: message.role === 'user' ? 'none' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: message.role === 'user'
                      ? '0 2px 12px rgba(26,35,126,0.2)'
                      : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.65 }}
                  >
                    {message.content}
                  </Typography>

                  {message.products && message.products.length > 0 && (
                    <Stack spacing={1.5} mt={2}>
                      {message.products.map((product) => {
                        const tag = getProductTag(product);
                        const discount = Math.round(
                          ((product.original_price - product.current_price) / product.original_price) * 100
                        );

                        return (
                          <Card
                            key={product.product_id}
                            sx={{
                              border: '1px solid rgba(0,0,0,0.06)',
                              borderRadius: 2.5,
                              transition: 'all 0.2s ease',
                              '&:hover': { borderColor: 'primary.light', transform: 'translateY(-1px)' },
                            }}
                          >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Stack direction="row" spacing={1} mb={1} flexWrap="wrap" gap={0.5}>
                                <Chip
                                  label={tag.label}
                                  size="small"
                                  sx={{ bgcolor: tag.color, color: '#fff', fontWeight: 700, fontSize: '0.625rem', height: 22 }}
                                />
                                <Chip
                                  label={getPlatformName(product.platform)}
                                  size="small"
                                  sx={{ bgcolor: getPlatformColor(product.platform), color: '#fff', fontSize: '0.625rem', height: 22 }}
                                />
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                                  <Typography variant="caption" fontWeight={700}>{product.rating}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ({product.review_count.toLocaleString()})
                                  </Typography>
                                </Stack>
                              </Stack>

                              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                {product.product_name}
                              </Typography>

                              <Stack direction="row" alignItems="baseline" spacing={1}>
                                <Typography variant="h6" fontWeight={800} color="success.main">
                                  {formatINR(product.current_price)}
                                </Typography>
                                {product.original_price > product.current_price && (
                                  <>
                                    <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                                      {formatINR(product.original_price)}
                                    </Typography>
                                    <Chip
                                      label={`${discount}% OFF`}
                                      size="small"
                                      color="error"
                                      sx={{ height: 20, fontSize: '0.625rem', fontWeight: 700 }}
                                    />
                                  </>
                                )}
                              </Stack>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Stack>
                  )}
                </Paper>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ ml: 1, mt: 0.5, display: 'block', fontSize: '0.625rem' }}
                >
                  {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>

              {message.role === 'user' && (
                <Avatar
                  sx={{
                    bgcolor: 'secondary.main',
                    ml: 1.5,
                    mt: 0.5,
                    width: 36,
                    height: 36,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  U
                </Avatar>
              )}
            </Box>
          ))}

          {isTyping && (
            <Box sx={{ display: 'flex', mb: 3, animation: 'fadeInUp 0.3s ease',
              '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
            }}>
              <Avatar sx={{ bgcolor: '#1a237e', mr: 1.5, mt: 0.5, width: 36, height: 36 }}>
                <AutoAwesome sx={{ fontSize: 18 }} />
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  bgcolor: '#fff',
                  borderRadius: '16px 16px 16px 4px',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <Stack direction="row" spacing={0.75} alignItems="center">
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: '#1a237e',
                        opacity: 0.5,
                        animation: `bounce 1.2s infinite ${i * 0.15}s`,
                        '@keyframes bounce': {
                          '0%, 60%, 100%': { transform: 'translateY(0)' },
                          '30%': { transform: 'translateY(-8px)' },
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Container>
      </Box>

      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          bgcolor: '#fff',
        }}
      >
        <Container maxWidth="md" disableGutters>
          <Stack direction="row" spacing={1} mb={1.5} sx={{ overflowX: 'auto', pb: 0.5 }}>
            {quickActions.map((action) => (
              <Chip
                key={action}
                label={action}
                size="small"
                onClick={() => setInputValue(action)}
                sx={{
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                  '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) },
                  cursor: 'pointer',
                }}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              fullWidth
              placeholder="Ask about products, prices, deals..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              inputRef={inputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              variant="outlined"
              multiline
              maxRows={3}
              disabled={isTyping}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8f9fb' } }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '12px',
                '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': { bgcolor: 'rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.26)' },
                transition: 'all 0.2s ease',
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
        </Container>
      </Paper>
    </Box>
  );
}
