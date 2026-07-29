import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import zebroldLogoMark from '../../assets/zebrold_logo_mark.png';
import './Footer.css';

const BRAND_LETTERS = ['Z', 'E', 'B', 'R', 'O', 'L', 'D'];

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-main">
        <div className="padding-global footer-pad">
          <div className="container-large">
            <div className="footer-grid-layout">
              {/* Left Column: Big Bold Tagline & Logo Mark */}
              <div className="footer-col-left">
                <img src={zebroldLogoMark} alt="Zebrold Group Logo" className="footer-logo-mark-img" />
                <h2 className="footer-giant-tagline">
                  {lang === 'en' ? 'WE BUILD WHAT DEFINES YOU' : 'WIR BAUEN, WAS SIE AUSZEICHNET'}
                </h2>
              </div>

              {/* Right Column: Links, CTA, Socials, and Partners */}
              <div className="footer-col-right-container">
                {/* Top Row: Nav Links & CTA */}
                <div className="footer-top-row">
                  <div className="footer-nav-list">
                    <Link to="/sectors" className="footer-nav-item">{t('nav_business')}</Link>
                    <Link to="/subsidiaries" className="footer-nav-item">{t('nav_portfolio')}</Link>
                    <Link to="/about" className="footer-nav-item">{t('nav_about')}</Link>
                    <Link to="/news" className="footer-nav-item">{t('nav_news')}</Link>
                    <Link to="/careers" className="footer-nav-item">{t('nav_careers')}</Link>
                    <Link to="/admin" className="footer-nav-item" style={{ color: 'var(--color-gold, #d4af37)' }}>⚙ Admin Console</Link>
                  </div>

                  <div className="footer-cta-wrapper">
                    <p className="footer-cta-heading">{lang === 'en' ? 'Would you like to discuss your project?' : 'Möchten Sie Ihr Projekt besprechen?'}</p>
                    <Link to="/contact" className="footer-cta-button">
                      {lang === 'en' ? 'Request Project' : 'Projekt anfragen'}
                    </Link>

                    <div className="footer-address-block">
                      <div className="footer-address-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{t('footer_hq')}</span>
                      </div>
                      <address className="footer-address-text">
                        Bockenheimer Landstrasse 17-19<br />
                        60325 Frankfurt am Main, Germany
                      </address>
                    </div>
                  </div>
                </div>

                {/* Social Links Row */}
                <div className="footer-social-row">
                  <a href="https://www.linkedin.com/company/zebrold" target="_blank" rel="noopener noreferrer" className="footer-social-pill">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Giant Cream Letters ZEBROLD */}
      <div className="footer-giant-brand-banner">
        <div className="footer-giant-letters-wrap">
          {BRAND_LETTERS.map((letter, i) => (
            <span key={i} className="footer-giant-letter-item">{letter}</span>
          ))}
        </div>
      </div>

      {/* Cream Bottom Bar */}
      <div className="footer-cream-bar">
        <div className="padding-global">
          <div className="container-large footer-cream-inner">
            <div className="footer-cream-left">
              <span>© {new Date().getFullYear()} ZEBROLD INTERNATIONAL HOLDINGS LIMITED — {t('footer_rights')}</span>
              <Link to="/terms" className="footer-legal-link">{t('footer_imprint')}</Link>
              <Link to="/privacy" className="footer-legal-link">{t('footer_privacy')}</Link>
              <Link to="/admin" className="footer-legal-link">⚙ Admin Console</Link>
            </div>
            <div className="footer-cream-right">
              <span>{lang === 'en' ? 'An excellence initiative of' : 'Eine Exzellenz-Initiative der'} <strong>Zebrold International Holdings Limited</strong></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
