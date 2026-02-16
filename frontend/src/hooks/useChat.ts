'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from '../lib/socket';

/** Estructura de un mensaje en el chat */
export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
}

/** Estado de conexión del WebSocket */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string, conversationId?: string) => void;
  isTyping: boolean;
  streamingContent: string;
  connectionStatus: ConnectionStatus;
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  loadHistory: (convId: string) => void;
  clearMessages: () => void;
}

/**
 * Hook principal del chat — gestiona conexión WebSocket,
 * envío/recepción de mensajes y streaming de tokens.
 */
export function useChat(token: string | null): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamingRef = useRef('');

  useEffect(() => {
    if (!token) return;

    const socket = createSocket(token);
    socketRef.current = socket;
    setConnectionStatus('connecting');

    socket.on('connect', () => {
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('error');
    });

    socket.on('connected', () => {
      setConnectionStatus('connected');
    });

    socket.on('typing', (data: { isTyping: boolean }) => {
      setIsTyping(data.isTyping);
      if (data.isTyping) {
        streamingRef.current = '';
        setStreamingContent('');
      }
    });

    socket.on('stream_token', (data: { token: string }) => {
      streamingRef.current += data.token;
      setStreamingContent(streamingRef.current);
    });

    socket.on('message_response', (data: {
      conversationId: string;
      content: string;
      queryType: string;
    }) => {
      setConversationId(data.conversationId);
      setStreamingContent('');
      streamingRef.current = '';
      setIsTyping(false);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'ASSISTANT',
        content: data.content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    });

    socket.on('history', (data: { messages: ChatMessage[] }) => {
      if (data.messages) {
        setMessages(data.messages);
      }
    });

    socket.on('error', (data: { message: string }) => {
      console.error('WebSocket error:', data.message);
      setIsTyping(false);
      setStreamingContent('');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const sendMessage = useCallback(
    (content: string, convId?: string) => {
      if (!socketRef.current || !content.trim()) return;

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'USER',
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      socketRef.current.emit('send_message', {
        content: content.trim(),
        conversationId: convId || conversationId,
      });
    },
    [conversationId],
  );

  const loadHistory = useCallback((convId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('get_history', { conversationId: convId });
    setConversationId(convId);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setStreamingContent('');
    streamingRef.current = '';
  }, []);

  return {
    messages,
    sendMessage,
    isTyping,
    streamingContent,
    connectionStatus,
    conversationId,
    setConversationId,
    loadHistory,
    clearMessages,
  };
}
