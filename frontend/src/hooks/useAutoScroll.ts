'use client';

import { useEffect, useRef } from 'react';

/** Hook para auto-scroll al último mensaje del chat */
export function useAutoScroll<T extends HTMLElement>(
  dependency: unknown,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dependency]);

  return ref;
}
