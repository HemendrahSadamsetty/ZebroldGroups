import { useEffect, useRef } from 'react';
import './SideDrawer.css';

export default function SideDrawer({ company, onClose }) {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (company) {
      document.body.style.overflow = 'hidden';
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [company]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!company) return null;

  const flagMap = { 'Germany':'🇩🇪','UK':'🇬🇧','France':'🇫🇷','Netherlands':'🇳🇱','Norway':'🇳🇴','Sweden':'🇸🇪','Denmark':'🇩🇰','Finland':'🇫🇮','South Korea':'🇰🇷','Taiwan':'🇹🇼','Japan':'🇯🇵','USA':'🇺🇸','UAE':'🇦🇪','India':'🇮🇳','Australia':'🇦🇺','Ireland':'🇮🇪','Singapore':'🇸🇬','Austria':'🇦🇹','Switzerland':'🇨🇭','Poland':'🇵🇱','Czech Republic':'🇨🇿','Belgium':'🇧🇪' };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        className="drawer"
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${company.name} profile`}
      >
        <button className="drawer-close" onClick={onClose} aria-label="Close profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="drawer-content">
          {/* Header */}
          <div className="drawer-header">
            <span className="label" style={{ color: 'var(--color-gold)' }}>{company.sector}</span>
            <h2 className="drawer-title">{company.name}</h2>
            <p className="drawer-hq">{company.hq} · Est. {company.founded}</p>
          </div>

          <div className="divider" />

          {/* Description */}
          <p className="drawer-desc">{company.description}</p>

          {/* Key metrics */}
          <div className="drawer-metrics">
            <div className="drawer-metric">
              <span className="drawer-metric-label">Revenue FY25</span>
              <span className="drawer-metric-value">{company.revenue}</span>
            </div>
            <div className="drawer-metric">
              <span className="drawer-metric-label">Working Capital</span>
              <span className="drawer-metric-value">{company.wc}</span>
            </div>
            <div className="drawer-metric">
              <span className="drawer-metric-label">Employees</span>
              <span className="drawer-metric-value">{company.employees}</span>
            </div>
            <div className="drawer-metric">
              <span className="drawer-metric-label">Founded</span>
              <span className="drawer-metric-value">{company.founded}</span>
            </div>
          </div>

          <div className="divider" />

          {/* Leadership */}
          <div className="drawer-section">
            <p className="label drawer-section-label">Leadership</p>
            <div className="drawer-leaders">
              <div className="drawer-leader">
                <span className="drawer-leader-role">Chief Executive Officer</span>
                <span className="drawer-leader-name">{company.ceo}</span>
              </div>
              <div className="drawer-leader">
                <span className="drawer-leader-role">Managing Director</span>
                <span className="drawer-leader-name">{company.md}</span>
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Markets */}
          <div className="drawer-section">
            <p className="label drawer-section-label">Key Markets</p>
            <div className="drawer-markets">
              {company.markets.map(m => (
                <span key={m} className="drawer-market-pill">
                  {flagMap[m] || ''} {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
