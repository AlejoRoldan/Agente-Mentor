'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';

interface MessageBubbleProps {
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  isStreaming?: boolean;
}

/** Burbuja individual de mensaje (usuario o asistente) */
export function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  const isUser = role === 'USER';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 py-1.5`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-emerald-600 text-white rounded-br-sm'
            : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
        }`}
      >
        {!isUser && (
          <div className="text-xs text-emerald-400 font-semibold mb-1">
            Itti Mentor
          </div>
        )}
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');

                if (match) {
                  return (
                    <CodeBlock language={match[1]}>
                      {codeString}
                    </CodeBlock>
                  );
                }

                return (
                  <code
                    className="bg-zinc-700 px-1.5 py-0.5 rounded text-sm text-emerald-300"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
              },
              ul({ children }) {
                return <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>;
              },
              strong({ children }) {
                return <strong className="text-emerald-300 font-semibold">{children}</strong>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}
