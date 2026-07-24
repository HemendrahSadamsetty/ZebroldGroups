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
                    <Link to="/#about" className="footer-nav-item">{t('nav_about')}</Link>
                    <Link to="/news" className="footer-nav-item">{t('nav_news')}</Link>
                    <Link to="/careers" className="footer-nav-item">{t('nav_careers')}</Link>
                  </div>

                  <div className="footer-cta-wrapper">
                    <p className="footer-cta-heading">{lang === 'en' ? 'Would you like to discuss your project?' : 'Möchten Sie Ihr Projekt besprechen?'}</p>
                    <Link to="/contact" className="footer-cta-button">
                      {lang === 'en' ? 'Request Project' : 'Projekt anfragen'}
                    </Link>
                  </div>
                </div>

                {/* Social Links Row */}
                <div className="footer-social-row">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-pill">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-pill">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
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
              <span>© {new Date().getFullYear()} Zebrold Group - {t('footer_rights')}</span>
              <Link to="/terms" className="footer-legal-link">{t('footer_imprint')}</Link>
              <Link to="/privacy" className="footer-legal-link">{t('footer_privacy')}</Link>
            </div>
            <div className="footer-cream-right">
              <span>{lang === 'en' ? 'An excellence initiative of the' : 'Eine Exzellenz-Initiative der'} <strong>Zebrold Group</strong></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
