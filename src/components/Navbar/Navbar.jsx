import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import zebroldLogoMark from '../../assets/zebrold_logo_mark.png';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { label: t('nav_business'), path: '/sectors', hasDropdown: true },
    { label: t('nav_portfolio'), path: '/subsidiaries', hasDropdown: true },
    { label: t('nav_about'), path: '/about', hasDropdown: false },
    { label: t('nav_news'), path: '/news', hasDropdown: false },
    { label: t('nav_offices'), path: '/offices', hasDropdown: false },
    { label: t('nav_careers'), path: '/careers', hasDropdown: false },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`arrodz-navbar ${scrolled ? 'is-scrolled' : 'is-transparent'}`}>
      <div className="arrodz-nav-container container-large">
        {/* Left: Brand Logo */}
        <Link to="/" className="arrodz-logo-link" aria-label="Zebrold Group — Home">
          <img src={zebroldLogoMark} alt="Zebrold Group" className="arrodz-logo-img" loading="eager" width="120" height="40" />
        </Link>

        {/* Center: Nav Links */}
        <nav className="arrodz-nav-menu" aria-label="Main Navigation">
          <ul className="arrodz-nav-list" role="list">
            {navLinks.map((link, i) => (
              <li key={i} className="arrodz-nav-item">
                <Link
                  to={link.path}
                  className={`arrodz-nav-link ${isActive(link.path) ? 'is-active' : ''}`}
                >
                  <span>{link.label}</span>
                  {link.hasDropdown && <span className="nav-chevron" aria-hidden="true">▾</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: Language Switcher & Contact Pill */}
        <div className="arrodz-nav-actions">
          <LanguageSwitcher className="nav-lang-switcher" />
          <Link to="/contact" className="arrodz-contact-btn">
            {t('nav_contact')}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="arrodz-hamburger"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="arrodz-mobile-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="arrodz-mobile-inner container">
              <ul className="mobile-nav-list">
                {navLinks.map((link, i) => (
                  <li key={i}>
                    <Link to={link.path} className="mobile-nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="mobile-lang-row">
                  <LanguageSwitcher className="is-light" />
                </li>
                <li>
                  <Link to="/contact" className="mobile-contact-pill">
                    {t('nav_contact')}
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
