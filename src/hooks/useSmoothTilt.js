import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * High-performance, silky-smooth 3D card tilt with dynamic specular glare tracking.
 * Uses requestAnimationFrame and damped lerp interpolation to eliminate jitter.
 *
 * @param {Object} options
 * @param {number} options.maxTilt - Maximum tilt angle in degrees (default: 6)
 * @param {number} options.scale - Card hover scale factor (default: 1.018)
 * @param {number} options.perspective - 3D perspective depth in px (default: 1000)
 * @param {number} options.damping - Interpolation damping factor [0.05 - 0.2] (default: 0.12)
 * @param {boolean} options.glare - Enable specular glare sheen tracking (default: true)
 */
export function useSmoothTilt({
  maxTilt = 6,
  scale = 1.018,
  perspective = 1000,
  damping = 0.12,
  glare = true,
} = {}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  // Animation state stored in refs to avoid re-render cycles during RAF
  const state = useRef({
    targetRotateX: 0,
    targetRotateY: 0,
    targetScale: 1,
    currentRotateX: 0,
    currentRotateY: 0,
    currentScale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    targetGlareOpacity: 0,
    currentGlareOpacity: 0,
    isHovered: false,
    rafId: null,
  });

  const update = useCallback(() => {
    const s = state.current;

    // Linear interpolation (lerp) for smooth easing
    s.currentRotateX += (s.targetRotateX - s.currentRotateX) * damping;
    s.currentRotateY += (s.targetRotateY - s.currentRotateY) * damping;
    s.currentScale += (s.targetScale - s.currentScale) * damping;
    s.currentGlareOpacity += (s.targetGlareOpacity - s.currentGlareOpacity) * damping;

    // Build the 3D transform
    const transform = `perspective(${perspective}px) rotateX(${s.currentRotateX.toFixed(3)}deg) rotateY(${s.currentRotateY.toFixed(3)}deg) scale3d(${s.currentScale.toFixed(4)}, ${s.currentScale.toFixed(4)}, ${s.currentScale.toFixed(4)})`;

    setStyle({
      transform,
      transformStyle: 'preserve-3d',
      willChange: s.isHovered ? 'transform' : 'auto',
    });

    if (glare) {
      setGlareStyle({
        opacity: s.currentGlareOpacity.toFixed(3),
        background: `radial-gradient(circle 280px at ${s.glareX}% ${s.glareY}%, rgba(255, 255, 255, 0.14), transparent 70%)`,
      });
    }

    // Continue animation until values settle
    const delta =
      Math.abs(s.targetRotateX - s.currentRotateX) +
      Math.abs(s.targetRotateY - s.currentRotateY) +
      Math.abs(s.targetScale - s.currentScale) +
      Math.abs(s.targetGlareOpacity - s.currentGlareOpacity);

    if (delta > 0.001 || s.isHovered) {
      s.rafId = requestAnimationFrame(update);
    } else {
      s.rafId = null;
    }
  }, [damping, maxTilt, perspective, scale, glare]);

  const startAnimation = useCallback(() => {
    if (!state.current.rafId) {
      state.current.rafId = requestAnimationFrame(update);
    }
  }, [update]);

  const handleMouseMove = useCallback(
    (e) => {
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = x / rect.width; // 0 to 1
      const py = y / rect.height; // 0 to 1

      // Calculate tilt angles (inverting Y for natural physical feel)
      state.current.targetRotateX = (py - 0.5) * -maxTilt * 2;
      state.current.targetRotateY = (px - 0.5) * maxTilt * 2;
      state.current.targetScale = scale;
      state.current.glareX = Math.round(px * 100);
      state.current.glareY = Math.round(py * 100);
      state.current.targetGlareOpacity = 1;
      state.current.isHovered = true;

      startAnimation();
    },
    [maxTilt, scale, startAnimation]
  );

  const handleMouseEnter = useCallback(() => {
    state.current.isHovered = true;
    state.current.targetScale = scale;
    state.current.targetGlareOpacity = 1;
    startAnimation();
  }, [scale, startAnimation]);

  const handleMouseLeave = useCallback(() => {
    state.current.isHovered = false;
    state.current.targetRotateX = 0;
    state.current.targetRotateY = 0;
    state.current.targetScale = 1;
    state.current.targetGlareOpacity = 0;
    startAnimation();
  }, [startAnimation]);

  useEffect(() => {
    return () => {
      if (state.current.rafId) {
        cancelAnimationFrame(state.current.rafId);
      }
    };
  }, []);

  return {
    ref: cardRef,
    style,
    glareStyle,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
}
