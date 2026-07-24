import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

import { IconWorld, IconMail, IconSearch, IconSun } from '@tabler/icons-react';
import zebroldLogo from '../../assets/zebrold_logo.svg';

const navLinks = [
  {
    label: 'Business',
    path: '/sectors',
    mega: true,
    columns: [
      ['EV Charging & Battery', 'Semiconductors', 'Car Manufacturing', 'Retail & Consumer'],
      ['Education', 'Technology & IT', 'Finance & Investment', 'Healthcare & Pharma'],
      ['Logistics & Supply Chain', 'Agriculture & Food', 'Industrial & Engineering', 'Media & Entertainment'],
    ],
  },
  {
    label: 'Community',
    path: '/subsidiaries',
    mega: true,
    columns: [
      ['Everstone Energy', 'Northvolt Power', 'Meridian Microelectronics', 'Silicon Crest Technologies', 'Redford Automotive'],
      ['Westbridge Motors', 'PrimeMart Retail', 'Brighton Education Group', 'Skybridge Technologies', 'Sterling Financial Services'],
      ['Oakwell Healthcare', 'PrimeRoute Logistics', 'Greenfield Agri', 'Ironclad Engineering', 'Northstar Entertainment'],
    ],
    footer: '26 companies across 12 sectors →',
    footerPath: '/subsidiaries',
  },
  { label: 'About Us', path: '/about' },
  { label: 'Newsroom', path: '/news' },
  { label: 'Careers', path: '/careers' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMega(null);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar--solid' : 'navbar--transparent'} ${mobileOpen ? 'navbar--mobile-open' : ''}`}
      aria-label="Main navigation"
    >
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="Zebrold Group — Home">
          <img src={zebroldLogo} alt="Zebrold Group" className="navbar-logo-img" />
        </Link>

        {/* Desktop nav */}
        <ul className="navbar-links" role="list">
          {navLinks.map((link) => (
            <li
              key={link.label}
              className="navbar-item"
              onMouseEnter={() => link.mega && setActiveMega(link.label)}
              onMouseLeave={() => setActiveMega(null)}
            >
              <Link
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'navbar-link--active' : ''}`}
              >
                {link.label}
                {link.mega && <span className="navbar-chevron">▾</span>}
              </Link>

              {/* Mega menu with Framer Motion */}
              <AnimatePresence>
                {link.mega && activeMega === link.label && (
                  <motion.div
                    className="mega-menu"
                    initial={{ opacity: 0, y: 15, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.99 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mega-menu-inner container">
                      <p className="mega-menu-heading label">{link.label}</p>
                      <div className="mega-menu-cols">
                        {link.columns.map((col, ci) => (
                          <ul key={ci} className="mega-menu-col" role="list">
                            {col.map((item, ii) => (
                              <motion.li 
                                key={item}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (ci * 0.05) + (ii * 0.05), ease: [0.32, 0.72, 0, 1] }}
                              >
                                <Link
                                  to={link.path}
                                  className="mega-menu-item"
                                >
                                  {item}
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        ))}
                      </div>
                      {link.footer && (
                        <Link to={link.footerPath} className="mega-menu-footer">
                          {link.footer}
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="navbar-actions">
          <button className="navbar-icon-btn" aria-label="Region">
            <IconWorld size={20} stroke={1.5} />
          </button>
          <Link to="/contact" className="navbar-icon-btn" aria-label="Contact">
            <IconMail size={20} stroke={1.5} />
          </Link>
          <button className="navbar-icon-btn" aria-label="Search">
            <IconSearch size={20} stroke={1.5} />
          </button>
          <button className="navbar-icon-btn" aria-label="Theme Toggle">
            <IconSun size={20} stroke={1.5} />
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu with Framer Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden={!mobileOpen}
          >
            <ul role="list">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="mobile-menu-link">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li><Link to="/admin" className="mobile-menu-link">Admin</Link></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
