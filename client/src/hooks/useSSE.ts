import { useState, useEffect, useRef, useCallback } from 'react';

export interface SSEMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface UseSSEOptions {
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: SSEMessage) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface UseSSEReturn {
  lastEvent: SSEMessage | null;
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
  close: () => void;
}

const DEFAULT_OPTIONS: UseSSEOptions = {
  reconnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
};

export const useSSE = (url: string, options: UseSSEOptions = {}): UseSSEReturn => {
  const [lastEvent, setLastEvent] = useState<SSEMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyClosedRef = useRef(false);

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // Get auth token for authenticated SSE
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('retailiq-auth-token');
  }, []);

  // Build URL with auth token
  const buildUrl = useCallback(() => {
    const token = getAuthToken();
    if (token) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}token=${encodeURIComponent(token)}`;
    }
    return url;
  }, [url, getAuthToken]);

  // Close connection
  const close = useCallback(() => {
    isManuallyClosedRef.current = true;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    mergedOptions.onClose?.();
  }, [mergedOptions]);

  // Connect to SSE
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const eventSource = new EventSource(buildUrl());
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        mergedOptions.onOpen?.();
      };

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const message: SSEMessage = {
            type: data.type || 'message',
            data: data.data || data,
            timestamp: data.timestamp || new Date().toISOString(),
          };

          setLastEvent(message);
          mergedOptions.onMessage?.(message);
        } catch (parseError) {
          console.error('Failed to parse SSE message:', parseError);
        }
      };

      eventSource.onerror = (event: Event) => {
        setIsConnected(false);

        const errorMessage = 'SSE connection error';
        setError(errorMessage);
        mergedOptions.onError?.(event);

        // Attempt reconnection
        if (
          !isManuallyClosedRef.current &&
          mergedOptions.reconnect &&
          reconnectAttemptsRef.current < (mergedOptions.maxReconnectAttempts || 5)
        ) {
          reconnectAttemptsRef.current += 1;

          // Exponential backoff
          const backoffTime =
            (mergedOptions.reconnectInterval || 3000) *
            Math.pow(1.5, reconnectAttemptsRef.current - 1);

          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isManuallyClosedRef.current) {
              connect();
            }
          }, Math.min(backoffTime, 30000)); // Cap at 30 seconds
        } else {
          eventSource.close();
        }
      };

      // Listen for custom event types
      eventSource.addEventListener('price_update', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const message: SSEMessage = {
            type: 'price_update',
            data,
            timestamp: new Date().toISOString(),
          };
          setLastEvent(message);
          mergedOptions.onMessage?.(message);
        } catch (err) {
          console.error('Failed to parse price_update event:', err);
        }
      });

      eventSource.addEventListener('alert', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const message: SSEMessage = {
            type: 'alert',
            data,
            timestamp: new Date().toISOString(),
          };
          setLastEvent(message);
          mergedOptions.onMessage?.(message);
        } catch (err) {
          console.error('Failed to parse alert event:', err);
        }
      });

      eventSource.addEventListener('notification', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const message: SSEMessage = {
            type: 'notification',
            data,
            timestamp: new Date().toISOString(),
          };
          setLastEvent(message);
          mergedOptions.onMessage?.(message);
        } catch (err) {
          console.error('Failed to parse notification event:', err);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to SSE');
      console.error('SSE connection error:', err);
    }
  }, [buildUrl, mergedOptions]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    isManuallyClosedRef.current = false;
    connect();
  }, [connect]);

  // Initialize connection
  useEffect(() => {
    if (!url) return;

    isManuallyClosedRef.current = false;
    connect();

    // Cleanup on unmount
    return () => {
      close();
    };
  }, [url, connect, close]);

  return {
    lastEvent,
    isConnected,
    error,
    reconnect,
    close,
  };
};

export default useSSE;
