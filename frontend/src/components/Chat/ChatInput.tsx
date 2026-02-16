'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isTyping?: boolean;
}

/** Input de chat con envío por Enter y auto-resize del textarea */
export function ChatInput({ onSend, disabled, isTyping }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (!message.trim() || disabled || isTyping) return;
    onSend(message);
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isTyping
              ? 'Itti está respondiendo...'
              : 'Escribí tu pregunta...'
          }
          disabled={disabled || isTyping}
          rows={1}
          className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-zinc-700 disabled:opacity-50 text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled || isTyping}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-xl px-5 py-3 font-medium transition-colors text-sm shrink-0"
        >
          Enviar
        </button>
      </div>
      <p className="text-xs text-zinc-600 text-center mt-2">
        Itti Mentor puede cometer errores. Verificá la información importante.
      </p>
    </div>
  );
}
