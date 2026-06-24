import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number>(0);
  const pendingRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      pendingRef.current = window.scrollY;
      if (rafRef.current === 0) {
        rafRef.current = requestAnimationFrame(() => {
          const currentY = pendingRef.current;
          setScrollY(currentY);
          if (currentY > lastScrollY.current + 5) {
            setIsScrollingDown(true);
          } else if (currentY < lastScrollY.current - 5) {
            setIsScrollingDown(false);
          }
          lastScrollY.current = currentY;
          rafRef.current = 0;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { isScrollingDown, scrollY };
}
