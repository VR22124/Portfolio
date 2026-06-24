import { useState, useEffect, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({
    x: 0, y: 0, normalizedX: 0, normalizedY: 0,
  });
  const rafRef = useRef<number>(0);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pendingRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      if (rafRef.current === 0) {
        rafRef.current = requestAnimationFrame(() => {
          if (pendingRef.current) {
            setPosition({
              x: pendingRef.current.x,
              y: pendingRef.current.y,
              normalizedX: (pendingRef.current.x / window.innerWidth) * 2 - 1,
              normalizedY: -(pendingRef.current.y / window.innerHeight) * 2 + 1,
            });
            pendingRef.current = null;
          }
          rafRef.current = 0;
        });
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return position;
}
