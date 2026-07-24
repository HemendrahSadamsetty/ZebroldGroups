import { useEffect, useRef } from 'react';

/**
 * Adds `.visible` class to all `.reveal` elements inside the ref'd container
 * when they enter the viewport. Supports stagger via data-delay attributes.
 */
export function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current || document;
    const elements = container.querySelectorAll('.reveal');

    if (!elements.length) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * A standalone helper to observe a single element and trigger a callback.
 * Useful for triggering countUp or other one-shot animations.
 */
export function useIntersection(callback, options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(el);
        }
      },
      { threshold: 0.3, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [callback]);

  return ref;
}
