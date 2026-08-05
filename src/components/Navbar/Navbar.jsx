import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Magnetic from '../Magnetic/Magnetic';
import zebroldLogoMark from '../../assets/zebrold_logo_mark.png';
import './Navbar.css';

/* ── Framer Motion variants for staggered mobile menu ── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1], staggerChildren: 0.06, delayChildren: 0.15 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1], staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
  },
};

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

  /* Lock body scroll when mobile overlay is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
          <Magnetic strength={0.32}>
            <Link to="/contact" className="arrodz-contact-btn">
              <span>{t('nav_contact')}</span>
              <span className="contact-btn-arrow" aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </div>

        {/* Mobile Hamburger → X Morph */}
        <button
          className={`arrodz-hamburger ${mobileOpen ? 'is-open' : ''}`}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="hamburger-line line-1" aria-hidden="true" />
          <span className="hamburger-line line-2" aria-hidden="true" />
          <span className="hamburger-line line-3" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="arrodz-mobile-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mobile-overlay-content">
              <nav className="mobile-overlay-nav" aria-label="Mobile Navigation">
                {navLinks.map((link, i) => (
                  <motion.div key={i} variants={linkVariants}>
                    <Link
                      to={link.path}
                      className={`mobile-overlay-link ${isActive(link.path) ? 'is-active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="mobile-link-index">{String(i + 1).padStart(2, '0')}</span>
                      <span className="mobile-link-text">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div className="mobile-overlay-footer" variants={linkVariants}>
                <LanguageSwitcher className="mobile-lang" />
                <Link
                  to="/contact"
                  className="mobile-contact-pill"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav_contact')}
                  <span className="mobile-contact-arrow" aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
