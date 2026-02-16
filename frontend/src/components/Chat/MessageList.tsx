'use client';

import React from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import type { ChatMessage } from '../../hooks/useChat';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  streamingContent: string;
}

/** Lista de mensajes con auto-scroll y streaming visual */
export function MessageList({ messages, isTyping, streamingContent }: MessageListProps) {
  const scrollRef = useAutoScroll<HTMLDivElement>([messages, streamingContent, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto py-4 space-y-1"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-xl font-bold text-white mb-2">
            ¡Hola! Soy Itti Mentor
          </h2>
          <p className="text-zinc-400 max-w-md">
            Tu tutor AI de IttiAcademy. Preguntame sobre programación,
            pedime que revise tu código, o que te guíe en un ejercicio.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
            {[
              '¿Qué es una API REST?',
              '¿Podés revisar mi código?',
              'Ayudame con un ejercicio de React',
              '¿Cómo funciona async/await?',
            ].map((suggestion) => (
              <button
                key={suggestion}
                className="text-left text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl px-4 py-3 transition-colors border border-zinc-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          role={msg.role}
          content={msg.content}
        />
      ))}

      {/* Streaming content — muestra la respuesta parcial mientras se genera */}
      {streamingContent && (
        <MessageBubble
          role="ASSISTANT"
          content={streamingContent}
          isStreaming
        />
      )}

      {/* Typing indicator cuando el agente está procesando pero aún no hay tokens */}
      {isTyping && !streamingContent && <TypingIndicator />}
    </div>
  );
}
