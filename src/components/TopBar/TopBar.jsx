import { useLanguage } from '../../context/LanguageContext';
import './TopBar.css';

const stockData = [
  { label: 'EUR/INR', value: '₹90.32', change: '-0.15%', up: false },
  { label: 'FY25 Revenue', value: 'EUR 2.1B', change: '+4.2%', up: true },
];

export default function TopBar() {
  const { t } = useLanguage();

  const utilityLinks = [
    { label: t('investor_portal'), href: '#' },
    { label: t('fraud_alert'), href: '#' },
    { label: t('contact_us'), href: '/contact' },
  ];

  return (
    <div className="topbar" role="banner" aria-label="Utility information bar">
      <div className="topbar-inner">
        {/* Stock data with live pulse indicators */}
        <div className="topbar-stocks" aria-live="polite">
          {stockData.map((stock, i) => (
            <span key={i} className="topbar-stock-item">
              <span className={`topbar-pulse-dot ${stock.up ? 'up' : 'down'}`} aria-hidden="true" />
              <span className="topbar-stock-label">{stock.label}</span>
              <span className="topbar-stock-value">{stock.value}</span>
              <span className={`topbar-stock-change ${stock.up ? 'up' : 'down'}`}>
                {stock.change}
              </span>
            </span>
          ))}
        </div>

        {/* Right: utility links */}
        <div className="topbar-right">
          {utilityLinks.map((link, i) => (
            <a key={i} href={link.href} className="topbar-util-link">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
