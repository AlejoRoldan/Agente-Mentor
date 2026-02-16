'use client';

import React from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChat, ConnectionStatus } from '../../hooks/useChat';

interface ChatContainerProps {
  token: string;
}

/** Indicador visual del estado de conexión */
function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const config = {
    connected: { color: 'bg-emerald-500', text: 'Conectado' },
    connecting: { color: 'bg-yellow-500 animate-pulse', text: 'Conectando...' },
    disconnected: { color: 'bg-red-500', text: 'Desconectado' },
    error: { color: 'bg-red-500', text: 'Error de conexión' },
  };

  const { color, text } = config[status];

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-zinc-400">{text}</span>
    </div>
  );
}

/** Contenedor principal del chat — integra todos los componentes */
export function ChatContainer({ token }: ChatContainerProps) {
  const {
    messages,
    sendMessage,
    isTyping,
    streamingContent,
    connectionStatus,
    clearMessages,
  } = useChat(token);

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            I
          </div>
          <div>
            <h1 className="text-white font-semibold">Itti Mentor</h1>
            <ConnectionBadge status={connectionStatus} />
          </div>
        </div>
        <button
          onClick={clearMessages}
          className="text-sm text-zinc-400 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg"
        >
          Nueva conversación
        </button>
      </header>

      {/* Messages */}
      <MessageList
        messages={messages}
        isTyping={isTyping}
        streamingContent={streamingContent}
      />

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={connectionStatus !== 'connected'}
        isTyping={isTyping}
      />
    </div>
  );
}
