import './TopBar.css';

const stockData = [
  { label: 'EUR/INR', value: '₹90.32', change: '-0.15%', up: false },
  { label: 'FY25 Revenue', value: 'EUR 2.1B', change: '+4.2%', up: true },
];

const utilityLinks = [
  { label: 'Investor Portal', href: '#' },
  { label: 'Fraud Alert', href: '#' },
  { label: 'Contact Us', href: '/contact' },
];

export default function TopBar() {
  return (
    <div className="topbar" role="banner" aria-label="Utility information bar">
      <div className="topbar-inner">
        {/* Logo spacer — exact same width/offset as the navbar logo */}
        <div className="topbar-logo-spacer" />

        {/* Stock data starts immediately after spacer */}
        <div className="topbar-stocks">
          {stockData.map((stock, i) => (
            <span key={i} className="topbar-stock-item">
              <span className="topbar-stock-label">{stock.label}</span>
              <span className={`topbar-stock-arrow ${stock.up ? 'up' : 'down'}`}>
                {stock.up ? '▲' : '▼'}
              </span>
              <span className="topbar-stock-value">{stock.value}</span>
              <span className={`topbar-stock-change ${stock.up ? 'up' : 'down'}`}>
                ({stock.change})
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
