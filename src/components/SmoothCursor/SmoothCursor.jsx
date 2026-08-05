import { useEffect, useRef, useState } from 'react';
import './SmoothCursor.css';

/**
 * Ultra-smooth, agency-grade custom cursor and ambient background spotlight.
 * Built with 60/120fps requestAnimationFrame lerp interpolation for silky motion.
 */
export default function SmoothCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  const [cursorState, setCursorState] = useState({
    visible: false,
    hovered: false,
    clicked: false,
    textHovered: false,
    cardHovered: false,
  });

  // Position storage in refs for non-re-rendering 60/120fps loop
  const pos = useRef({
    targetX: -100,
    targetY: -100,
    dotX: -100,
    dotY: -100,
    ringX: -100,
    ringY: -100,
    glowX: -250,
    glowY: -250,
    isVisible: false,
  });

  useEffect(() => {
    // Only run on desktop devices with fine pointer (mouse)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let rafId = null;

    const handleMouseMove = (e) => {
      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;

      if (!pos.current.isVisible) {
        pos.current.isVisible = true;
        // Snap initial position to avoid fly-in from corner
        pos.current.dotX = e.clientX;
        pos.current.dotY = e.clientY;
        pos.current.ringX = e.clientX;
        pos.current.ringY = e.clientY;
        pos.current.glowX = e.clientX;
        pos.current.glowY = e.clientY;

        setCursorState((s) => ({ ...s, visible: true }));
      }
    };

    const handleMouseDown = () => {
      setCursorState((s) => ({ ...s, clicked: true }));
    };

    const handleMouseUp = () => {
      setCursorState((s) => ({ ...s, clicked: false }));
    };

    const handleMouseLeave = () => {
      pos.current.isVisible = false;
      setCursorState((s) => ({ ...s, visible: false }));
    };

    const handleMouseEnter = () => {
      pos.current.isVisible = true;
      setCursorState((s) => ({ ...s, visible: true }));
    };

    // Detect hover over interactive elements
    const handleElementHover = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = target.closest(
        'a, button, [role="button"], input, textarea, select, .pill, .arrodz-contact-btn, .hero-o-pill, .btn, .mobbin-sector-card, .sub-card, .news-editorial-card'
      );
      const isCard = target.closest('.mobbin-sector-card, .sub-card, .news-editorial-card, .about-board-card, .about-stat-card');
      const isTextInput = target.closest('input[type="text"], input[type="email"], textarea');

      setCursorState((s) => ({
        ...s,
        hovered: !!isInteractive,
        cardHovered: !!isCard,
        textHovered: !!isTextInput,
      }));
    };

    // 60/120fps Interpolation Loop
    const loop = () => {
      const p = pos.current;

      // Precision dot: Fast lerp (0.45)
      p.dotX += (p.targetX - p.dotX) * 0.45;
      p.dotY += (p.targetY - p.dotY) * 0.45;

      // Trailing ring: Smooth spring-like lerp (0.15)
      p.ringX += (p.targetX - p.ringX) * 0.15;
      p.ringY += (p.targetY - p.ringY) * 0.15;

      // Ambient spotlight glow: Deep relaxed lerp (0.07)
      p.glowX += (p.targetX - p.glowX) * 0.07;
      p.glowY += (p.targetY - p.glowY) * 0.07;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${p.dotX}px, ${p.dotY}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${p.ringX}px, ${p.ringY}px, 0)`;
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${p.glowX}px, ${p.glowY}px, 0)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleElementHover, { passive: true });

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementHover);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* 1. Ambient Background Spotlight Glow */}
      <div
        ref={glowRef}
        className={`ambient-mouse-glow ${cursorState.visible ? 'is-visible' : ''}`}
        aria-hidden="true"
      />

      {/* 2. Fluid Trailing Ring */}
      <div
        ref={ringRef}
        className={`smooth-cursor-ring ${cursorState.visible ? 'is-visible' : ''} ${
          cursorState.hovered ? 'is-hovered' : ''
        } ${cursorState.cardHovered ? 'is-card' : ''} ${
          cursorState.textHovered ? 'is-text' : ''
        } ${cursorState.clicked ? 'is-clicked' : ''}`}
        aria-hidden="true"
      />

      {/* 3. Precision Central Dot */}
      <div
        ref={dotRef}
        className={`smooth-cursor-dot ${cursorState.visible ? 'is-visible' : ''} ${
          cursorState.hovered ? 'is-hovered' : ''
        } ${cursorState.textHovered ? 'is-text' : ''}`}
        aria-hidden="true"
      />
    </>
  );
}
