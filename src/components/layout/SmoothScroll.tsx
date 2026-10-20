'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePitch } from '@/context/PitchContext';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { isRfqOpen } = usePitch();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) return;

    try {
      const lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
      });
      lenisRef.current = lenis;
      document.documentElement.classList.add('lenis', 'lenis-smooth');

      let reqId: number;
      const raf = (time: number) => {
        lenis.raf(time);
        reqId = requestAnimationFrame(raf);
      };
      reqId = requestAnimationFrame(raf);

      // Handle anchor clicks for smooth scrolling
      const handleAnchorClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('[data-scroll]');
        if (target) {
          const href = target.getAttribute('href');
          if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetEl = document.querySelector(href);
            if (targetEl) {
              lenis.scrollTo(targetEl as HTMLElement, { offset: -20, duration: 1.4 });
            }
          }
        }
      };

      document.addEventListener('click', handleAnchorClick);

      return () => {
        cancelAnimationFrame(reqId);
        document.removeEventListener('click', handleAnchorClick);
        lenis.destroy();
        document.documentElement.classList.remove('lenis', 'lenis-smooth');
      };
    } catch (e) {
      console.warn('Lenis scroll initialization error', e);
    }
  }, []);

  // Coordinate drawer modal with smooth scroll stop/resume
  useEffect(() => {
    if (lenisRef.current) {
      if (isRfqOpen) {
        lenisRef.current.stop();
        document.documentElement.classList.add('lock');
      } else {
        lenisRef.current.start();
        document.documentElement.classList.remove('lock');
      }
    }
  }, [isRfqOpen]);

  return <>{children}</>;
}
