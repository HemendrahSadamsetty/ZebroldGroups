import { useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * Spring-based magnetic wrapper for CTA buttons and pills.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} props.strength - Pull multiplier (default: 0.28)
 * @param {string} props.className - Optional additional classes
 * @param {Object} props.style - Optional additional inline styles
 */
export default function Magnetic({
  children,
  strength = 0.28,
  className = '',
  style = {},
  ...props
}) {
  const ref = useRef(null);

  // Motion values for smooth spring physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`magnetic-wrapper ${className}`}
      style={{
        x: smoothX,
        y: smoothY,
        display: 'inline-block',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}
