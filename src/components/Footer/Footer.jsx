import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconBrandFacebook, IconBrandLinkedin, IconBrandX, IconBrandYoutube, IconBrandInstagram, IconMail, IconArrowRight } from '@tabler/icons-react';
import './Footer.css';
import zebroldLogo from '../../assets/zebrold_logo.svg';

import evSectorImg from '../../assets/ev_sector.png';
import semiSectorImg from '../../assets/semi_sector.jpg';
import carSectorImg from '../../assets/car_sector.png';
import retailSectorImg from '../../assets/retail_sector.png';
import educationSectorImg from '../../assets/education_sector.png';
import techSectorImg from '../../assets/tech_sector.png';
import financeSectorImg from '../../assets/finance_sector.png';
import healthcareSectorImg from '../../assets/healthcare_sector.png';
import logisticsSectorImg from '../../assets/logistics_sector.png';
import agricultureSectorImg from '../../assets/agriculture_sector.png';
import industrialSectorImg from '../../assets/industrial_sector.png';
import mediaSectorImg from '../../assets/media_sector.png';

const carouselBrands = [
  { name: 'Everstone Energy', img: evSectorImg },
  { name: 'Meridian Micro', img: semiSectorImg },
  { name: 'Redford Auto', img: carSectorImg },
  { name: 'PrimeMart Retail', img: retailSectorImg },
  { name: 'Brighton Edu', img: educationSectorImg },
  { name: 'Skybridge Tech', img: techSectorImg },
  { name: 'Sterling Finance', img: financeSectorImg },
  { name: 'Oakwell Health', img: healthcareSectorImg },
  { name: 'PrimeRoute Logistics', img: logisticsSectorImg },
  { name: 'Greenfield Agri', img: agricultureSectorImg },
  { name: 'Ironclad Eng', img: industrialSectorImg },
  { name: 'Silverline Studios', img: mediaSectorImg },
];

const businessSectors = [
  'Technology & IT',
  'Semiconductors',
  'Car Manufacturing',
  'EV Charging & Battery',
  'Finance & Investment',
  'Healthcare & Pharma',
  'Industrial & Engineering',
  'Logistics & Supply Chain',
  'Media & Entertainment',
  'Education',
  'Retail & Consumer',
  'Agriculture & Food',
];

const communityLinks = ['Health', 'Education', 'Empowerment', 'Environment'];

const aboutLinks = [
  'The Zebrold group',
  'Values and Purpose',
  'Leadership',
  'Heritage',
  'Sustainability',
  'Innovation',
  'Sponsorships',
  'Investors',
  'Code of Conduct',
];

export default function Footer() {
  const carouselRef = useRef(null);

  const scrollNext = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 240, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      {/* ── Brand Carousel Strip ── */}
      <div className="footer-carousel-wrapper">
        <div className="footer-carousel-container container">
          <div className="footer-carousel" ref={carouselRef}>
            {carouselBrands.map((brand, idx) => (
              <div key={idx} className="footer-carousel-card">
                <img src={brand.img} alt={brand.name} className="footer-carousel-card-img" />
                <div className="footer-carousel-card-overlay" />
                <span className="footer-carousel-card-name">{brand.name}</span>
              </div>
            ))}
          </div>
          <button className="footer-carousel-next" onClick={scrollNext} aria-label="Next brands">
            <IconArrowRight size={20} stroke={2} />
          </button>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="footer-inner container">
        <div className="footer-grid">
          {/* Column 1: Business */}
          <div className="footer-col">
            <p className="footer-col-heading">Business</p>
            <ul className="footer-links">
              {businessSectors.map((sector) => (
                <li key={sector}>
                  <Link to="/sectors" className="footer-link">
                    {sector}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/subsidiaries" className="footer-browse-brands">
              Browse our brands
            </Link>
          </div>

          {/* Column 2: Community */}
          <div className="footer-col">
            <p className="footer-col-heading">Community</p>
            <ul className="footer-links">
              {communityLinks.map((link) => (
                <li key={link}>
                  <Link to="/about" className="footer-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: About */}
          <div className="footer-col">
            <p className="footer-col-heading">About</p>
            <ul className="footer-links">
              {aboutLinks.map((link) => (
                <li key={link}>
                  <Link to="/about" className="footer-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsroom / Careers / Legal */}
          <div className="footer-col footer-col--legal">
            <p className="footer-col-heading-large">
              <Link to="/news" className="footer-link-large">Newsroom</Link>
            </p>
            <p className="footer-col-heading-large">
              <Link to="/careers" className="footer-link-large">Careers</Link>
            </p>
            <p className="footer-col-heading-large">
              <Link to="/careers" className="footer-link-large">Jobs</Link>
            </p>
            <ul className="footer-links footer-links--spaced">
              <li>
                <Link to="/careers" className="footer-link">Equal Opportunity</Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="footer-link">Legal Disclaimer</Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Right panel (Socials, Subscription, Logo) */}
          <div className="footer-col footer-col--right">
            {/* Social Icons */}
            <div className="footer-socials">
              <a href="#" className="footer-social-icon" aria-label="Facebook">
                <IconBrandFacebook size={22} stroke={1.5} />
              </a>
              <a href="#" className="footer-social-icon" aria-label="LinkedIn">
                <IconBrandLinkedin size={22} stroke={1.5} />
              </a>
              <a href="#" className="footer-social-icon" aria-label="X">
                <IconBrandX size={22} stroke={1.5} />
              </a>
              <a href="#" className="footer-social-icon" aria-label="YouTube">
                <IconBrandYoutube size={22} stroke={1.5} />
              </a>
              <a href="#" className="footer-social-icon" aria-label="Instagram">
                <IconBrandInstagram size={22} stroke={1.5} />
              </a>
              <a href="#" className="footer-social-icon" aria-label="Mail">
                <IconMail size={22} stroke={1.5} />
              </a>
            </div>

            {/* Newsletter Subscription */}
            <form className="footer-subscribe" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email ID to subscribe"
                className="footer-subscribe-input"
                required
              />
              <button type="submit" className="footer-subscribe-btn" aria-label="Subscribe">
                <IconArrowRight size={18} stroke={1.5} />
              </button>
            </form>

            {/* Brand Logo */}
            <div className="footer-brand-logo-container">
              <img src={zebroldLogo} alt="Zebrold Group" className="footer-brand-logo" />
            </div>
          </div>
        </div>

        {/* ── Copyright Bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Zebrold Group of Companies GmbH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
