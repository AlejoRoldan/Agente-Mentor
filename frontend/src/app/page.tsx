'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatContainer } from '../components/Chat/ChatContainer';

/** Página principal — redirige a auth si no hay token */
export default function HomePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/auth');
      return;
    }
    setToken(storedToken);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl animate-pulse">
            I
          </div>
          <p className="text-zinc-400 text-sm">Cargando Itti Mentor...</p>
        </div>
      </div>
    );
  }

  if (!token) return null;

  return <ChatContainer token={token} />;
}
