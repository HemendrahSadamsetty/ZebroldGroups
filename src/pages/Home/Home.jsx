import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCountUp } from '../../hooks/useCountUp';
import SubsidiaryCard from '../../components/SubsidiaryCard/SubsidiaryCard';
import NewsCard from '../../components/NewsCard/NewsCard';
import { sectors } from '../../data/sectors';
import { subsidiaries } from '../../data/subsidiaries';
import { news } from '../../data/news';
import heroBg1 from '../../assets/hero_bg_meridian.png';
import heroBg2 from '../../assets/hero_bg_northvolt.png';
import heroBg3 from '../../assets/hero_bg_everstone.png';
import companyHqImg from '../../assets/company_hq.png';
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
import './Home.css';

/* Sector image map — keyed by sector name */
const sectorImageMap = {
  'EV Charging & Battery': evSectorImg,
  'Semiconductors': semiSectorImg,
  'Car Manufacturing': carSectorImg,
  'Retail & Consumer': retailSectorImg,
  'Education': educationSectorImg,
  'Technology & IT': techSectorImg,
  'Finance & Investment': financeSectorImg,
  'Healthcare & Pharma': healthcareSectorImg,
  'Logistics & Supply Chain': logisticsSectorImg,
  'Agriculture & Food': agricultureSectorImg,
  'Industrial & Engineering': industrialSectorImg,
  'Media & Entertainment': mediaSectorImg,
};

const PRESS_RELEASES = [
  {
    title: "Zebrold Semiconductor and ASML Announce Strategic Partnership",
    quote: "to advance semiconductor manufacturing ecosystem in India and EMEA regions",
    category: "PRESS RELEASE"
  },
  {
    title: "Northvolt Power Launches Next-Generation Cell Grid Storage Battery",
    quote: "delivering sustainable lithium-ion utility and grid-scale storage solutions",
    category: "PRESS RELEASE"
  },
  {
    title: "Everstone Energy Reaches 1.5GW Operational Clean Energy Milestones",
    quote: "accelerating local net-zero transition targets across European markets",
    category: "PRESS RELEASE"
  }
];

const FACTS = [
  {
    text: "Zebrold pioneered carbon-neutral last-mile logistics in Europe: Zebrold Logistics Service was set up on October 15, 2013. It later became PrimeRoute Logistics.",
    author: "Wings for a Nation"
  },
  {
    text: "We design MEMS sensors and automotive chips powering 15M+ vehicles worldwide: Meridian Microelectronics was established in Munich in 2014.",
    author: "Precision Engineering"
  },
  {
    text: "Zebrold's education vertical trains 45,000+ professionals annually: Brighton Education Group has active campuses across three continents.",
    author: "Empowering Future Talent"
  }
];

/* Sector descriptions — industry-level copy for each business vertical */
const sectorDescriptions = {
  'EV Charging & Battery': 'Zebrold Group entered the electric mobility value chain in 2017 with a focus on ultra-fast charging infrastructure and next-generation battery cell manufacturing. Our subsidiaries operate across Central and Northern Europe, deploying proprietary battery management software and sustainable lithium-ion technology for automotive and grid-scale storage applications.',
  'Semiconductors': 'Our semiconductor division designs and fabricates advanced power management ICs, automotive-grade chips, and MEMS sensor technology. With fabrication facilities in Munich and Dresden, and supply partnerships spanning South Korea, Taiwan, and Japan, we serve precision-critical applications across automotive, industrial, and consumer electronics markets.',
  'Car Manufacturing': 'The automotive manufacturing arm of Zebrold Group produces premium electric vehicles and commercial EV fleets. From the iconic Redford Series crafted in Stuttgart to Westbridge Motors\' light trucks for last-mile logistics, our vehicles combine German engineering precision with zero-emission performance across European markets.',
  'Retail & Consumer': 'Our retail portfolio spans omnichannel premium consumer goods across 85 locations in the DACH region and technology-first grocery delivery serving urban consumers in Asia and the Middle East. Combined, our retail subsidiaries serve millions of customers through physical stores and app-based rapid delivery platforms.',
  'Education': 'Zebrold\'s education vertical delivers accredited degree programmes, corporate upskilling, and placement-linked career acceleration across three continents. From Brighton\'s international campuses to Clearpath\'s Fortune 500 partnerships and Instructis Career\'s placement-linked training in India, we are building the workforce infrastructure for the next decade.',
  'Technology & IT': 'Our technology division delivers enterprise cloud infrastructure, cybersecurity solutions, and AI-powered digital transformation consulting. Serving critical government and financial sector clients across 18 countries, our subsidiaries combine deep engineering capability with regulated-market compliance expertise.',
  'Finance & Investment': 'The financial services arm manages EUR 8B+ in assets under management across infrastructure, real estate, technology growth funds, distressed assets, and structured credit. Our investment professionals operate from Frankfurt, London, and Dubai with a combined track record spanning 15 years of top-quartile returns.',
  'Healthcare & Pharma': 'Zebrold\'s healthcare group operates 12 multi-specialty hospitals, 80 diagnostic centres, and FDA/EMA/WHO-GMP certified pharmaceutical production facilities. From precision diagnostics in Germany to specialty pharmaceutical manufacturing supplying 45 markets globally, we deliver clinical excellence at institutional scale.',
  'Logistics & Supply Chain': 'Our integrated logistics platform operates 22 distribution centres across Europe with dedicated cold-chain, last-mile, and digital supply chain orchestration capabilities. Connecting manufacturers, freight carriers, and retailers across 30 countries through a visibility-first technology platform.',
  'Agriculture & Food': 'The agriculture and food division leverages satellite imagery, AI crop analytics, and sustainable agricultural inputs to manage 850,000+ hectares. Our food processing arm produces organic specialty grains, plant-based proteins, and premium packaged foods for European retail markets.',
  'Industrial & Engineering': 'Our industrial group delivers heavy engineering, precision manufacturing, specialised process engineering, and premium commercial interiors. From structural steel and industrial machinery in Essen to modular plant construction and award-winning workplace environments across three continents.',
  'Media & Entertainment': 'Zebrold\'s media vertical produces premium drama, documentary, live event programming, and multilingual digital content. Our studios in Berlin and Hyderabad create high-volume entertainment, branded content, and gaming experiences distributed across OTT platforms globally.',
};

const heroSlides = [
  {
    image: heroBg1,
    company: 'Meridian Microelectronics',
    sector: 'Semiconductors',
    headline1: 'Precision',
    headline2: 'Silicon',
    sub: 'Cutting-edge semiconductor solutions\nby Zebrold Group',
    cta: 'Explore Company',
    ctaPath: '/subsidiaries',
  },
  {
    image: heroBg2,
    company: 'Northvolt Power',
    sector: 'EV & Battery',
    headline1: 'Deutsche',
    headline2: 'Technik',
    sub: 'The art of German Engineering by\nZebrold Group',
    cta: 'Story and pics',
    ctaPath: '/about',
  },
  {
    image: heroBg3,
    company: 'Everstone Energy',
    sector: 'Clean Energy',
    headline1: 'Green',
    headline2: 'Future',
    sub: 'Sustainable energy solutions\nfor a changing world',
    cta: 'Our Vision',
    ctaPath: '/about',
  },
];

const heroImages = heroSlides.map(s => s.image);

/* Hero stat countUp component */
function HeroStat({ value, prefix, suffix, label }) {
  const [ref, count] = useCountUp(value, 2000);
  return (
    <motion.div
      ref={ref}
      className="hero-stat"
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
    >
      <span className="hero-stat-num">
        {prefix}{count.toLocaleString()}{suffix}
      </span>
      <span className="hero-stat-label">{label}</span>
    </motion.div>
  );
}

/* Hero headline word reveal using Framer Motion */
function AnimatedHeadline({ line1, line2 }) {
  const words1 = line1.split(' ');
  const words2 = line2.split(' ');

  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const wordVars = {
    initial: { y: '100%', clipPath: 'inset(0 0 100% 0)' },
    animate: { y: '0%', clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.h1
      className="hero-headline"
      variants={containerVars}
      initial="initial"
      animate="animate"
    >
      <span className="hero-headline-line" style={{ display: 'block', overflow: 'hidden' }}>
        {words1.map((w, idx) => (
          <motion.span key={idx} variants={wordVars} style={{ display: 'inline-block', marginRight: '0.25em' }}>
            {w}
          </motion.span>
        ))}
      </span>
      <span className="hero-headline-line" style={{ display: 'block', overflow: 'hidden' }}>
        {words2.map((w, idx) => (
          <motion.span key={idx} variants={wordVars} style={{ display: 'inline-block', marginRight: '0.25em' }}>
            {w}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  );
}

const SECTORS_LIST = [
  'All',
  'EV Charging & Battery',
  'Semiconductors',
  'Car Manufacturing',
  'Retail & Consumer',
  'Education',
  'Technology & IT',
  'Finance & Investment',
  'Healthcare & Pharma',
  'Logistics & Supply Chain',
  'Agriculture & Food',
  'Industrial & Engineering',
  'Media & Entertainment'
];

const sectorIcons = {
  'EV Charging & Battery': '⚡',
  'Semiconductors': '🔬',
  'Car Manufacturing': '🚗',
  'Retail & Consumer': '🛒',
  'Education': '🎓',
  'Technology & IT': '💻',
  'Finance & Investment': '💰',
  'Healthcare & Pharma': '🏥',
  'Logistics & Supply Chain': '🚚',
  'Agriculture & Food': '🌱',
  'Industrial & Engineering': '🏗️',
  'Media & Entertainment': '🎬'
};

const getCompanyEmblem = (name, sector) => {
  switch (sector) {
    case 'EV Charging & Battery':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'Semiconductors':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M9 9h6v6H9z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Car Manufacturing':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    case 'Retail & Consumer':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Education':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Technology & IT':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Finance & Investment':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Healthcare & Pharma':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Logistics & Supply Chain':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" rx="1" />
          <polygon points="16 8 20 8 23 11 23 16 16 16" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case 'Agriculture & Food':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 22s10-14 20-14M22 8c0 3.3-1 6.5-3 9M16 12s-3-2-6-1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Industrial & Engineering':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Media & Entertainment':
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="17" y1="2" x2="17" y2="22" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="2" y1="7" x2="7" y2="7" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="2" y1="17" x2="7" y2="17" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="17" y1="17" x2="22" y2="17" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="17" y1="7" x2="22" y2="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className="company-emblem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

const SHOWCASE_SECTORS = [
  "EV Charging & Battery",
  "Semiconductors",
  "Car Manufacturing",
  "Retail & Consumer",
  "Education",
  "Technology & IT"
];

const SHOWCASE_COMPANIES = [
  "Everstone Energy",
  "Northvolt Power",
  "Meridian Microelectronics",
  "Silicon Crest Technologies",
  "Redford Automotive",
  "Westbridge Motors",
  "PrimeMart Retail",
  "UrbanBasket Stores",
  "Brighton Education Group",
  "Clearpath Learning",
  "Instructis Career",
  "Skybridge Technologies",
  "Arden Digital Solutions",
  "Sterling Financial Services",
  "Harrington Capital Group",
  "Oakwell Healthcare",
  "Greenford Pharmaceuticals",
  "PrimeRoute Logistics",
  "GlobalLink Supply Chain",
  "Greenfield Agri",
  "Harvest Hill Foods",
  "Ironclad Engineering",
  "Stonebridge Industries",
  "Stonecraft Interiors",
  "Northstar Entertainment",
  "Silverline Studios"
];

function ShowcaseStat({ value, label }) {
  const [ref, count] = useCountUp(value, 2000);
  return (
    <div ref={ref} className="showcase-stat">
      <span className="showcase-stat-num">{count}</span>
      <span className="showcase-stat-label">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * About the Group
 *
 * A single-column editorial block that introduces the Group. Themed
 * to match the site: dark navy substrate, Playfair Display headline,
 * gold accent rules, mono caps for labels — same vocabulary as the
 * hero and the existing sections.
 * ───────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────
 * About the Group
 *
 * A single-column editorial block that introduces the Group. Themed
 * to match the site: dark navy substrate, Playfair Display headline,
 * gold accent rules, mono caps for labels — same vocabulary as the
 * hero and the existing sections.
 * ───────────────────────────────────────────────────────────────────── */

function AboutGroup() {
  return (
    <section
      className="about-section"
      aria-labelledby="about-heading"
    >
      {/* Subtle radial wash to match site hero feel */}
      <div className="about-bg" aria-hidden="true">
        <div className="about-bg-radial" />
        <div className="about-bg-grid" />
      </div>

      <div className="about-container">
        {/* Eyebrow + brand mark */}
        <div className="about-eyebrow">
          <span className="about-eyebrow-line" />
          <span className="about-eyebrow-text">About the Group</span>
          <span className="about-eyebrow-stamp">N° 01 — Profile</span>
          <span className="about-eyebrow-line about-eyebrow-line--end" />
        </div>

        {/* Image + body spread */}
        <figure className="about-figure">
          <div className="about-figure-imgwrap">
            <img
              src={companyHqImg}
              alt="Zebrold Group headquarters, Frankfurt am Main"
              className="about-figure-img"
              loading="lazy"
            />
            <figcaption className="about-figure-cap">
              <span className="about-figure-cap-key">Headquarters</span>
              <span className="about-figure-cap-val">
                Frankfurt am Main · Est. 2017
              </span>
            </figcaption>
          </div>

          <div className="about-copy">
            <p className="about-lede">
              Zebrold Group is a premier multi-sector conglomerate operating a portfolio of twenty-six market-leading companies. Across twelve strategic sectors, we manage a unified capital framework designed to accelerate industrial transition and technological leadership globally.
            </p>
            <p className="about-body">
              Through flagship subsidiaries like Meridian Microelectronics in semiconductors, Everstone Energy and Northvolt Power in EV charging and clean batteries, and Redford Automotive in automotive manufacturing, we operate at the intersection of precision engineering and sustainable infrastructure. Our presence spans Dresden and Munich fabrication facilities, global logistics networks, and international enterprise platforms.
            </p>
            <p className="about-body">
              We operate with institutional rigor, governed by an independent supervisory board that guarantees financial discipline and operational autonomy for each of our subsidiaries. By prioritizing strong cash generation and governance compliance, we support the zero-emission transformation of global infrastructure.
            </p>
          </div>
        </figure>

      </div>
    </section>
  );
}

export default function Home() {
  const pageRef = useScrollReveal();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exitSlide, setExitSlide] = useState(null);
  const [progressTrigger, setProgressTrigger] = useState(0);
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null); // null | 0 | 1 | 2 | 3 | 4 | 5
  const [cycleIndex, setCycleIndex] = useState(0);
  const [activeSector, setActiveSector] = useState(0);
  const [activePressIdx, setActivePressIdx] = useState(0);
  const [activeFactIdx, setActiveFactIdx] = useState(0);

  // Auto-play press release slider
  useEffect(() => {
    const pressInterval = setInterval(() => {
      setActivePressIdx((prev) => (prev + 1) % PRESS_RELEASES.length);
    }, 6000);
    return () => clearInterval(pressInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCycleIndex((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const SLOT_COMPANIES = [
    ["Everstone Energy", "Northvolt Power", "Redford Automotive", "Westbridge Motors"],
    ["Meridian Microelectronics", "Silicon Crest Technologies", "PrimeMart Retail", "UrbanBasket Stores"],
    ["Brighton Education Group", "Clearpath Learning", "Instructis Career"],
    ["Skybridge Technologies", "Arden Digital Solutions", "Sterling Financial Services", "Harrington Capital Group"],
    ["Oakwell Healthcare", "Greenford Pharmaceuticals", "PrimeRoute Logistics", "GlobalLink Supply Chain", "Greenfield Agri"],
    ["Harvest Hill Foods", "Ironclad Engineering", "Stonebridge Industries", "Stonecraft Interiors", "Northstar Entertainment", "Silverline Studios"]
  ];

  // Get active company for each slot
  const getActiveCompanyForSlot = (slotIdx) => {
    const list = SLOT_COMPANIES[slotIdx];
    const name = list[cycleIndex % list.length];
    return subsidiaries.find(c => c.name === name);
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        setExitSlide(prev);
        setTimeout(() => setExitSlide(null), 1200);
        return (prev + 1) % 3;
      });
      setProgressTrigger(prev => prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (index) => {
    setExitSlide(currentSlide);
    setTimeout(() => setExitSlide(null), 1200);
    setCurrentSlide(index);
    setProgressTrigger(prev => prev + 1);
  };

  return (
    <div ref={pageRef} className="home">
      {/* ── 1. Hero ── */}
      <section className="hero" aria-label="Hero">
        <div className="hero-bg-slider">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''} ${index === exitSlide ? 'exit' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hero-grid-pattern" aria-hidden="true" />
          <div className="hero-particles" aria-hidden="true" />
          <div className="hero-gradient" aria-hidden="true" />
        </div>

        <div className="hero-content container">
          <div className="hero-layout-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${currentSlide}`}
                className="hero-company-badge"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="hero-company-sector">{heroSlides[currentSlide].sector}</span>
                <span className="hero-company-name">{heroSlides[currentSlide].company}</span>
              </motion.div>
            </AnimatePresence>

            <AnimatedHeadline
              key={`headline-${currentSlide}`}
              line1={heroSlides[currentSlide].headline1}
              line2={heroSlides[currentSlide].headline2}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={`subtext-${currentSlide}`}
                className="hero-subtext-block"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hero-vertical-line"></div>
                <p className="hero-sub">
                  {heroSlides[currentSlide].sub.split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${currentSlide}`}
                className="hero-ctas"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={heroSlides[currentSlide].ctaPath} className="btn btn-premium-cta" id="hero-cta-explore">
                  {heroSlides[currentSlide].cta} <span className="arrow">→</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Elements */}
        <div className="hero-bottom-bar reveal" data-delay="6">
          <div className="container hero-bottom-container">
            <div className="hero-slider-controls">
              <span className="slider-pause">||</span>
              <span className="slider-count">{currentSlide + 1} / 3</span>
              <div className="slider-progress-bars">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="progress-bar"
                    onClick={() => handleSlideChange(i)}
                    style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                  >
                    <div
                      key={`${i}-${progressTrigger}`}
                      className="progress-bar-fill"
                      style={{
                        width: i === currentSlide ? '100%' : '0%',
                        transition: i === currentSlide ? 'width 6000ms linear' : 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-scroll-indicator">
              <div className="scroll-chevron"></div>
              <div className="scroll-chevron"></div>
              <div className="scroll-chevron"></div>
            </div>
          </div>
        </div>

        {/* Right Vertical Nav */}
        <div className="hero-vertical-nav reveal" data-delay="6">
          <div className="nav-line"></div>
          <div className="nav-dot active"></div>
          <div className="nav-dot"></div>
          <div className="nav-dot"></div>
          <div className="nav-line"></div>
        </div>
      </section>

      {/* Stats strip - Moved below hero */}
      <div className="hero-stats-wrapper">
        <div className="container">
          <motion.div
            className="hero-stats-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroStat value={2} prefix="EUR " suffix=".1B" label="Revenue FY25" />
            <div className="hero-stats-divider" aria-hidden="true" />
            <HeroStat value={26} label="Subsidiaries" />
            <div className="hero-stats-divider" aria-hidden="true" />
            <HeroStat value={12} label="Sectors" />
            <div className="hero-stats-divider" aria-hidden="true" />
            <HeroStat value={13705} suffix=" Cr" label="Working Capital (INR)" />
            <div className="hero-stats-divider" aria-hidden="true" />
            <HeroStat value={26} label="Global Offices" />
          </motion.div>
        </div>
      </div>

      {/* ── 2. Our Businesses — Interactive Sector Showcase ── */}
      <section className="biz-showcase" aria-labelledby="biz-showcase-heading">
        {/* Background images — crossfade on active sector */}
        <div className="biz-bg-layer" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.div
              key={`biz-bg-${activeSector}`}
              className="biz-bg-image"
              style={{ backgroundImage: `url(${sectorImageMap[sectors[activeSector].name]})` }}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
          <div className="biz-bg-gradient" />
        </div>

        <div className="container biz-container">
          {/* Left — Active sector content */}
          <div className="biz-left">
            <motion.div
              className="biz-label-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="biz-label-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
              </span>
              <span className="biz-label-text">Our Businesses</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`biz-content-${activeSector}`}
                className="biz-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 id="biz-showcase-heading" className="biz-sector-name">
                  {sectors[activeSector].name}
                </h2>

                <p className="biz-sector-desc">
                  {sectorDescriptions[sectors[activeSector].name]}
                </p>

                <div className="biz-sector-meta">
                  <div className="biz-meta-item">
                    <span className="biz-meta-val">{sectors[activeSector].companies.length}</span>
                    <span className="biz-meta-key">Subsidiaries</span>
                  </div>
                  <div className="biz-meta-divider" />
                  <div className="biz-meta-item">
                    <span className="biz-meta-val">{sectors[activeSector].wc}</span>
                    <span className="biz-meta-key">Working Capital</span>
                  </div>
                </div>

                <div className="biz-companies-list">
                  {sectors[activeSector].companies.map((c) => (
                    <span key={c} className="biz-company-tag">{c}</span>
                  ))}
                </div>

                <Link to="/sectors" className="biz-cta" id="biz-readmore-cta">
                  read more <span className="biz-cta-arrow">→</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — Sector tab navigation */}
          <nav className="biz-right" aria-label="Sector navigation">
            {sectors.map((sector, idx) => (
              <button
                key={sector.id}
                className={`biz-tab ${idx === activeSector ? 'biz-tab-active' : ''}`}
                onClick={() => setActiveSector(idx)}
                onMouseEnter={() => setActiveSector(idx)}
                aria-current={idx === activeSector ? 'true' : undefined}
              >
                <span className="biz-tab-name">{sector.name.toUpperCase()}</span>
                {idx === activeSector && (
                  <motion.div
                    className="biz-tab-indicator"
                    layoutId="biz-tab-bar"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* ── 4. About the Group ── */}
      <AboutGroup />



      {/* ── 6. News Strip (Tata-Style Asymmetric Grid) ── */}
      <section className="news-strip section" aria-labelledby="news-strip-heading">
        <div className="container">
          <div className="news-section-tag">
            In the News
          </div>

          <div className="news-asymmetric-grid">
            
            {/* Card 1: Press Release (span 3) */}
            <div className="news-card-press">
              <div className="news-press-left">
                <div className="cyber-grid-graphic" />
                <div className="cyber-grid-glow" />
                <div className="carousel-indicators">
                  {PRESS_RELEASES.map((_, i) => (
                    <button
                      key={i}
                      className={`carousel-indicator-dot ${i === activePressIdx ? 'active' : ''}`}
                      onClick={() => setActivePressIdx(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="news-press-right">
                <span className="press-tag">{PRESS_RELEASES[activePressIdx].category}</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePressIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="press-title">{PRESS_RELEASES[activePressIdx].title}</h3>
                    <div className="press-quote-box">
                      <p className="press-quote-text">
                        {PRESS_RELEASES[activePressIdx].quote}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="press-arrow">→</div>
              </div>
            </div>

            {/* Card 2: Facts "Did you know" (span 2) */}
            <div className="news-card-facts">
              <div className="facts-bg-glow" />
              <div>
                <span className="facts-tag">FACTS</span>
                <h3 className="facts-title">Did you know</h3>
              </div>
              <div className="facts-quote-box">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFactIdx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="facts-quote-text">
                      {FACTS[activeFactIdx].text}
                    </p>
                    <p className="facts-quote-author">
                      {FACTS[activeFactIdx].author}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <button
                className="facts-cycle-btn"
                onClick={() => setActiveFactIdx((prev) => (prev + 1) % FACTS.length)}
                aria-label="Next fact"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
            </div>

            {/* Card 3: Facebook (span 2) */}
            <div className="news-card-fb">
              <div className="social-icon-top">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </div>
              <div className="social-quote-box">
                <p className="social-text">
                  The excitement returns! Welcome to a new season of our global technology summit. The teams are ready and showcasing tomorrow's innovations. Are you? #ZebroldGroups #InnovationSummit #FutureTech2026
                </p>
                <span className="social-time">3 months ago</span>
              </div>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-expand" aria-label="Open Facebook post">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {/* Card 4: Instagram (span 3) */}
            <div className="news-card-ig">
              <div className="social-icon-top">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <div className="social-quote-box">
                <p className="social-text">
                  The wait is over. The excitement returns. Welcome back to a new season of #ZebroldSummit. The teams are ready. Are you? #ZebroldGroups #TechSummit #Innovation2026
                </p>
                <span className="social-time">3 months ago</span>
              </div>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-expand" aria-label="Open Instagram post">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

          </div>

          <div className="news-bottom-cta">
            <Link to="/news" className="btn btn-premium-pill" id="home-news-cta">
              View all news & announcements <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
