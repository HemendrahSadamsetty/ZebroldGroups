import { useSmoothTilt } from '../../hooks/useSmoothTilt';
import './SubsidiaryCard.css';
import { sectorColors } from '../../data/sectors';

const flagMap = {
  'Germany': '🇩🇪', 'UK': '🇬🇧', 'France': '🇫🇷', 'Netherlands': '🇳🇱',
  'Norway': '🇳🇴', 'Sweden': '🇸🇪', 'Denmark': '🇩🇰', 'Finland': '🇫🇮',
  'South Korea': '🇰🇷', 'Taiwan': '🇹🇼', 'Japan': '🇯🇵', 'USA': '🇺🇸',
  'UAE': '🇦🇪', 'India': '🇮🇳', 'Australia': '🇦🇺', 'Ireland': '🇮🇪',
  'Singapore': '🇸🇬', 'Austria': '🇦🇹', 'Switzerland': '🇨🇭',
  'Poland': '🇵🇱', 'Czech Republic': '🇨🇿', 'Belgium': '🇧🇪',
};

export default function SubsidiaryCard({ company, onClick, delay = 0 }) {
  const { ref, style, glareStyle, onMouseMove, onMouseEnter, onMouseLeave } = useSmoothTilt({
    maxTilt: 5,
    scale: 1.018,
  });

  const pillColor = sectorColors[company.sector] || 'var(--color-gold)';

  return (
    <article
      ref={ref}
      className="sub-card reveal"
      data-delay={delay}
      onClick={() => onClick && onClick(company)}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`${company.name} — ${company.sector}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(company)}
    >
      {/* Dynamic Specular Glare */}
      <div className="card-glare-sheen" style={glareStyle} aria-hidden="true" />

      <div className="sub-card-glass-core">
        <div className="sub-card-shimmer" />
        
        <div className="sub-card-header">
          <span
            className="pill sub-card-sector"
            style={{ backgroundColor: `${pillColor}20`, color: pillColor, border: `1px solid ${pillColor}40` }}
          >
            {company.sector}
          </span>
        </div>

        <h3 className="sub-card-name">{company.name}</h3>
        <p className="sub-card-desc">{company.description}</p>

        {/* Progressive Expansion details */}
        <div className="sub-card-details">
          <div className="sub-card-meta">
            <div className="sub-card-meta-item">
              <span className="sub-card-meta-label">Revenue FY25</span>
              <span className="sub-card-meta-value">{company.revenue}</span>
            </div>
            <div className="sub-card-meta-item">
              <span className="sub-card-meta-label">Working Capital</span>
              <span className="sub-card-meta-value">{company.wc}</span>
            </div>
          </div>
        </div>

        <div className="sub-card-footer">
          <span className="sub-card-markets">
            {company.markets.map(m => flagMap[m] || '').join(' ')} {company.markets.join(', ')}
          </span>
          <span className="sub-card-cta">View profile →</span>
        </div>
      </div>
    </article>
  );
}
