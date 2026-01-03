"use client";

import { useEffect, useRef, useState } from 'react';

export interface UseParallaxOptions {
  speed?: number; // Multiplier for parallax effect (0.5 = half speed, 2 = double speed)
  direction?: 'up' | 'down';
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up' } = options;
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;

      // Calculate parallax offset
      const parallaxOffset = (scrolled - elementTop) * speed;
      const finalOffset = direction === 'down' ? parallaxOffset : -parallaxOffset;

      setOffset(finalOffset);
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, direction]);

  return { ref, offset };
}
