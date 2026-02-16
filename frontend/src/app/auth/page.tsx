'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../lib/socket';

/** Página de autenticación — login y registro */
export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? 'auth/login' : 'auth/register';
      const body = isLogin
        ? { email, password }
        : { email, name, password };

      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error de autenticación');
      }

      // Guardar token y datos del usuario
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            I
          </div>
          <h1 className="text-2xl font-bold text-white">IttiAcademy</h1>
          <p className="text-zinc-400 mt-1">Tu mentor AI de programación</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white text-center">
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white font-medium rounded-xl py-3 transition-colors text-sm"
          >
            {loading
              ? 'Cargando...'
              : isLogin
                ? 'Iniciar sesión'
                : 'Crear cuenta'}
          </button>

          <p className="text-center text-sm text-zinc-400">
            {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              {isLogin ? 'Registrate' : 'Iniciá sesión'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
