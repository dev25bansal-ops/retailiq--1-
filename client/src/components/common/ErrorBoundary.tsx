import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Card, CardContent, Typography, Collapse, IconButton, Alert } from '@mui/material';
import { ErrorOutline, ExpandMore, Home, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps & { navigate: (path: string) => void }, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps & { navigate: (path: string) => void }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleGoHome = (): void => {
    this.handleReset();
    this.props.navigate('/consumer/dashboard');
  };

  toggleDetails = (): void => {
    this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDevelopment = import.meta.env.DEV;

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <ErrorOutline
                  sx={{
                    fontSize: 80,
                    color: 'error.main',
                  }}
                />
              </Box>

              <Typography variant="h4" gutterBottom fontWeight="bold">
                Something went wrong
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                We're sorry for the inconvenience. An unexpected error has occurred. Please try again or return to the home page.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleReset}
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={this.handleGoHome}
                >
                  Go Home
                </Button>
              </Box>

              {isDevelopment && this.state.error && (
                <Box sx={{ mt: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      mb: 1,
                    }}
                    onClick={this.toggleDetails}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Error Details
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        transform: this.state.showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                      }}
                    >
                      <ExpandMore fontSize="small" />
                    </IconButton>
                  </Box>

                  <Collapse in={this.state.showDetails}>
                    <Alert severity="error" sx={{ textAlign: 'left', mt: 2 }}>
                      <Typography variant="body2" component="pre" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {this.state.error.name}: {this.state.error.message}
                      </Typography>
                      {this.state.error.stack && (
                        <Typography
                          variant="caption"
                          component="pre"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            maxHeight: 200,
                            overflow: 'auto',
                            fontFamily: 'monospace',
                          }}
                        >
                          {this.state.error.stack}
                        </Typography>
                      )}
                      {this.state.errorInfo && (
                        <Typography
                          variant="caption"
                          component="pre"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            maxHeight: 200,
                            overflow: 'auto',
                            fontFamily: 'monospace',
                            mt: 1,
                          }}
                        >
                          {this.state.errorInfo.componentStack}
                        </Typography>
                      )}
                    </Alert>
                  </Collapse>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to use hooks with class component
const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  const navigate = useNavigate();
  return <ErrorBoundaryClass {...props} navigate={navigate} />;
};

export default ErrorBoundary;
