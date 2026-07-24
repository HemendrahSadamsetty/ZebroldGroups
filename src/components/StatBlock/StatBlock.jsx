import { useCountUp } from '../../hooks/useCountUp';
import './StatBlock.css';

/**
 * @param {number} value - Numeric end value for countUp
 * @param {string} prefix - e.g. "EUR "
 * @param {string} suffix - e.g. "B" or "+"
 * @param {string} label - description below
 * @param {boolean} dark - dark background variant
 */
export default function StatBlock({ value, prefix = '', suffix = '', label, dark = false }) {
  const [ref, count] = useCountUp(value, 1800);

  return (
    <div ref={ref} className={`stat-block ${dark ? 'stat-block--dark' : ''}`}>
      <div className="stat-block-number">
        {prefix}
        <span className="stat-block-count">{count.toLocaleString()}</span>
        {suffix}
      </div>
      <p className="stat-block-label">{label}</p>
    </div>
  );
}
