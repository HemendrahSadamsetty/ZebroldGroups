import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../context/LanguageContext';
import { getExpertise, getStats, getDomains, getFaq, getNewsSection, getAboutScroll, getCta, getSectionOrder, getTicker } from '../../utils/homepageData';
import './Home.css';
import heroBg1 from '../../assets/hero_bg_meridian.png';
import heroBg2 from '../../assets/hero_bg_northvolt.png';
import heroBg3 from '../../assets/hero_bg_everstone.png';
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
import countryHealthLogo from '../../assets/country_health_logo.png';
import instructisLogo from '../../assets/instructis_logo.png';
import leadershipTeamImg from '../../assets/leadership_team_zebrold.jpg';
gsap.registerPlugin(ScrollTrigger);
/* ── Data ── */
const BRAND_LETTERS = ['Z', 'E', 'B', 'R', 'O', 'L', 'D'];
const COMPANY_TICKER_ITEMS = [
  { name: 'Country Health', logo: countryHealthLogo, country: 'Düsseldorf, Deutschland', sector: 'Gesundheitswesen & Pharma' },
  { name: 'Instructis', logo: instructisLogo, country: 'Hyderabad, Indien', sector: 'Bildung & Karriere' },
];
const EXPERTISE_ITEMS = [
  {
    id: 'industrial-excellence',
    num: '01',
    caption: 'Industrielle Exzellenz',
    title: 'Ingenieurspräzision auf institutioneller Ebene',
    body: 'Wir entwerfen, bauen und betreiben Infrastruktur in zwölf Sektoren — von der Halbleiterfertigung bis zu sauberen Energienetzen. Unsere Tochtergesellschaften liefern industrielle Lösungen mit deutscher Ingenieurspräzision und verbinden fortschrittliche Fertigungskapazitäten mit nachhaltigen Praktiken auf globalen Märkten.',
    cta: 'Sektoren erkunden',
    ctaPath: '/sectors',
    image: semiSectorImg,
    badge1: 'Digitale Transformation',
    badge2: 'Präzisionsfertigung',
    badge3: 'Nachhaltige Innovation',
  },
  {
    id: 'healthcare-education',
    num: '02',
    caption: 'Gesundheitswesen & Bildung',
    title: 'Innovation im Gesundheitswesen und in der Bildung',
    body: 'Wir investieren in die Zukunft menschlichen Wohlergehens und Wissensaufbaus. Durch spezialisierte Tochtergesellschaften verbinden wir lebensrettende Medizintechnik mit moderner Bildungs- und Plattformtechnologie für globale Märkte.',
    cta: 'Initiativen entdecken',
    ctaPath: '/sectors',
    image: healthcareSectorImg,
    badge1: 'Medizintechnik & Pharma',
    badge2: 'Digitale Bildung',
    badge3: 'Skalierbare Gesundheitssysteme',
  },
  {
    id: 'global-presence',
    num: '03',
    caption: 'Globale Präsenz',
    title: 'Lokale Expertise, globale Infrastruktur',
    body: 'Mit Produktionsstätten in München und Dresden, Vertriebszentren in 22 europäischen Märkten und Standorten auf drei Kontinenten kombinieren wir tiefes lokales Wissen mit Ausführung im institutionellen Maßstab. Unsere Teams arbeiten weltweit in regulierten, präzisionskritischen Umgebungen.',
    cta: 'Unsere Büros',
    ctaPath: '/offices',
    image: heroBg3,
    badge1: '3 Kontinente',
    badge2: '22 DACH Märkte',
    badge3: 'Institutioneller Maßstab',
  },
];
const CASE_STUDIES = [
  {
    title: 'Meridian Microelectronics',
    subtitle: 'Fortschrittliche Halbleiterfertigung',
    tags: ['Halbleiter'],
    desc: 'Entwicklung von Power-Management-ICs der nächsten Generation und Automotive-Chips an den Standorten München und Dresden.',
    image: heroBg1,
    thumb: semiSectorImg,
    link: '/subsidiaries',
  },
  {
    title: 'Northvolt Power',
    subtitle: 'Zellfertigung der nächsten Generation',
    tags: ['EV & Batterie'],
    desc: 'Bereitstellung nachhaltiger Lithium-Ionen-Technologie für Automobil- und Netzspeicheranwendungen.',
    image: heroBg2,
    thumb: evSectorImg,
    link: '/subsidiaries',
  },
  {
    title: 'Everstone Energy',
    subtitle: 'Infrastruktur für saubere Energie',
    tags: ['Saubere Energie'],
    desc: 'Betrieb von 1,5 GW an sauberer Energiekapazität zur Beschleunigung des Net-Zero-Übergangs in europäischen Märkten.',
    image: heroBg3,
    thumb: financeSectorImg,
    link: '/subsidiaries',
  },
];
const DOMAINS_LIST = [
  {
    id: 'ev-battery',
    title: 'EV-Laden & Batterien',
    subtitle: 'EV Charging & Battery',
    companies: 'Everstone Energy, Northvolt Power',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'semiconductors',
    title: 'Halbleiter',
    subtitle: 'Semiconductors',
    companies: 'Meridian Microelectronics, Silicon Crest',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="15" x2="23" y2="15" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="15" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    id: 'car-manufacturing',
    title: 'Automobilbau',
    subtitle: 'Car Manufacturing',
    companies: 'Redford Automotive, Westbridge Motors',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  },
  {
    id: 'education',
    title: 'Bildung',
    subtitle: 'Education',
    companies: 'Instructis, Brighton Education, Clearpath',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: 'technology',
    title: 'Technologie & IT',
    subtitle: 'Technology & IT',
    companies: 'Skybridge Technologies, Arden Digital',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'finance',
    title: 'Finanzen & Investitionen',
    subtitle: 'Finance & Investment',
    companies: 'Sterling Financial, Harrington Capital',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: 'healthcare',
    title: 'Gesundheitswesen & Pharma',
    subtitle: 'Healthcare & Pharma',
    companies: 'Country Health, Oakwell, Greenford',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'logistics',
    title: 'Logistik & Lieferkette',
    subtitle: 'Logistics & Supply Chain',
    companies: 'PrimeRoute Logistics, GlobalLink',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'retail',
    title: 'Einzelhandel & Konsumgüter',
    subtitle: 'Retail & Consumer',
    companies: 'PrimeMart Retail, UrbanBasket Stores',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 'agriculture',
    title: 'Landwirtschaft & Lebensmittel',
    subtitle: 'Agriculture & Food',
    companies: 'Greenfield Agri, Harvest Hill Foods',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2z" />
        <path d="M12 12c-2.5 0-5 2.5-5 5" />
        <path d="M12 12c2.5 0 5-2.5 5-5" />
      </svg>
    ),
  },
  {
    id: 'industrial',
    title: 'Industrie & Maschinenbau',
    subtitle: 'Industrial & Engineering',
    companies: 'Ironclad Engineering, Stonebridge',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20" />
        <path d="M5 20V8l5 3V8l5 3V4h4v16" />
      </svg>
    ),
  },
  {
    id: 'media',
    title: 'Medien & Unterhaltung',
    subtitle: 'Media & Entertainment',
    companies: 'Northstar Entertainment, Silverline',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    ),
  },
];
const STATS = [
  { value: 2.1, prefix: '€', suffix: ' Mrd.', label: 'Umsatz der Tochtergesellschaften' },
  { value: 26, prefix: '', suffix: '', label: 'Unternehmen in unserem Portfolio' },
  { value: 40, prefix: '+', suffix: '%', label: 'Wachstum gegenüber dem Vorjahr in Schlüsselsektoren' },
];
function getFaqItems(t, lang) {
  /* Read from admin-editable data (localStorage), fall back to hardcoded FAQ_ITEMS */
  const adminFaq = getFaq();
  return adminFaq.map(item => ({
    q: lang === 'en' ? (item.q_en || item.q_de || item.q || '') : (item.q_de || item.q || ''),
    a: lang === 'en' ? (item.a_en || item.a_de || item.a || '') : (item.a_de || item.a || ''),
  }));
}

const FAQ_ITEMS = [
  {
    q: 'In welchen Sektoren ist die Zebrold Group tätig?',
    a: 'Die Zebrold Group ist in zwölf strategischen Sektoren tätig, darunter EV-Laden & Batterien, Halbleiter, Automobilbau, Gesundheitswesen & Pharma, Finanzen & Investitionen, Technologie & IT, Bildung, Einzelhandel & Konsumgüter, Logistik & Lieferkette, Landwirtschaft & Lebensmittel, Industrie & Maschinenbau sowie Medien & Unterhaltung.',
  },
  {
    q: 'Wie viele Tochtergesellschaften hat die Gruppe?',
    a: 'Wir verwalten sechsundzwanzig marktführende Tochtergesellschaften auf drei Kontinenten. Jede Tochtergesellschaft agiert mit voller operativer Autonomie und profitiert gleichzeitig vom einheitlichen Kapitalrahmen und der institutionellen Governance-Struktur der Gruppe.',
  },
  {
    q: 'Wo befindet sich der Hauptsitz der Zebrold Group?',
    a: 'Der Hauptsitz der Zebrold Group ist in Frankfurt am Main, Deutschland. Wir unterhalten operative Niederlassungen in Europa, Indien und Australien sowie Produktionsstätten in München, Dresden, Stuttgart und an anderen strategischen Standorten.',
  },
  {
    q: 'Was unterscheidet Zebrold von anderen Konglomeraten?',
    a: 'Unser Unterscheidungsmerkmal ist die Kombination aus deutscher Ingenieurspräzision und globaler Ausführung. Jede Tochtergesellschaft profitiert von tiefgreifender Branchenexpertise, einer institutionellen Governance durch einen unabhängigen Aufsichtsrat und einem einheitlichen Kapitalrahmen, der den industriellen Wandel beschleunigt.',
  },
  {
    q: 'Investiert Zebrold in Nachhaltigkeit?',
    a: 'Nachhaltigkeit ist der Kern unserer Strategie. Vom 1,5-GW-Portfolio für saubere Energie von Everstone Energy über die Batterien der nächsten Generation von Northvolt Power bis hin zur kohlenstoffneutralen Logistik von PrimeRoute treiben wir die emissionsfreie Transformation der globalen Infrastruktur aktiv voran.',
  },
  {
    q: 'Wie kann ich mit der Zebrold Group zusammenarbeiten?',
    a: 'Wir begrüßen strategische Partnerschaften in allen zwölf Sektoren. Ob Sie nach Investitionspartnerschaften, Technologiekooperationen oder Supply-Chain-Integration suchen, unser Team bewertet Möglichkeiten durch einen strukturierten Bewertungsprozess. Kontaktieren Sie uns, um Ihr Projekt zu besprechen.',
  },
  {
    q: 'Wie sieht die Governance-Struktur der Gruppe aus?',
    a: 'Die Zebrold Group wird von einem unabhängigen Aufsichtsrat geleitet, der Finanzdisziplin und operative Autonomie für jede Tochtergesellschaft garantiert. Wir arbeiten mit institutioneller Strenge und legen Wert auf starke Cash-Generierung, Governance-Compliance und transparente Berichterstattung an die Stakeholder.',
  },
  {
    q: 'Bietet Zebrold Karrieremöglichkeiten?',
    a: 'Ja. Mit sechsundzwanzig Tochtergesellschaften in zwölf Sektoren bieten wir vielfältige Karrierewege in den Bereichen Ingenieurwesen, Finanzen, Technologie, Gesundheitswesen, Bildung und mehr. Jede Tochtergesellschaft leitet ihre eigene Rekrutierung, während die Gruppe übergreifende Mobilitätsprogramme für Talente koordiniert.',
  },
];
/* ═══════════════════════════════════════════
   LOADER COMPONENT
   ═══════════════════════════════════════════ */
function HomeLoader({ onComplete }) {
  const loaderRef = useRef(null);
  const counterRef = useRef(null);
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenLoader');
    const ts = parseInt(seen, 10);
    if (seen && (Date.now() - ts < 3600000)) {
      onComplete();
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        localStorage.setItem('hasSeenLoader', Date.now().toString());
        onComplete();
      },
    });
    /* Phase 1: Counter 0→100 */
    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(counter.val) + '%';
        }
      },
    });
    /* Phase 2: Letters stagger in */
    tl.fromTo(
      '.loader-letter',
      { y: '120%', opacity: 0, rotateX: -40 },
      {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power4.out',
      },
      '-=0.5'
    );
    /* Phase 3: Pause + scale down + blur out */
    tl.to({}, { duration: 0.4 })
      .to('.loader-counter', {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      })
      .to('.loader-letter', {
        scale: 1.3,
        letterSpacing: '0.2em',
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        stagger: 0.03,
      })
      .to('.loader-progress-fill', {
        scaleX: 0,
        transformOrigin: 'right center',
        duration: 0.4,
        ease: 'power2.in',
      }, '<')
      .to(loaderRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.7,
        ease: 'power3.inOut',
      }, '-=0.2');
    return () => tl.kill();
  }, [onComplete]);
  return (
    <div ref={loaderRef} className="home-loader">
      <div className="loader-container">
        <div className="loader-counter" ref={counterRef}>0%</div>
        <div className="loader-letters">
          {BRAND_LETTERS.map((letter, i) => (
            <span key={i} className="loader-letter">{letter}</span>
          ))}
        </div>
        <div className="loader-progress">
          <div className="loader-progress-fill" />
        </div>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════
   ANIMATED COUNTER COMPONENT
   ═══════════════════════════════════════════ */
function AnimatedCounter({ value, prefix = '', suffix = '', isDecimal = false }) {
  const ref = useRef(null);
  const numRef = useRef(null);
  const hasAnimated = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const counter = { val: 0 };
          gsap.to(counter, {
            val: value,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              if (numRef.current) {
                const display = isDecimal
                  ? counter.val.toFixed(1)
                  : Math.floor(counter.val);
                numRef.current.textContent = `${prefix}${display}${suffix}`;
              }
            },
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, prefix, suffix, isDecimal]);
  return (
    <span ref={ref}>
      <span ref={numRef} className="data-value-num">
        {prefix}0{suffix}
      </span>
    </span>
  );
}
/* ═══════════════════════════════════════════
   FAQ ACCORDION ITEM
   ═══════════════════════════════════════════ */
function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  return (
    <div className={`faq-accordion ${open ? 'is-open' : ''}`} data-faq-index={index}>
      <button
        className="faq-question"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <p className="faq-question-text">{question}</p>
        <div className="faq-icon-wrapper">
          <div className="faq-plus-v" />
          <div className="faq-plus-h" />
          <div className="faq-plus-dot" />
        </div>
      </button>
      <div
        className="faq-answer"
        style={{
          maxHeight: open ? '1000px' : '0px',
        }}
      >
        <div ref={contentRef} className="faq-answer-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════
   MAIN HOME COMPONENT
   ═══════════════════════════════════════════ */
export default function Home() {
  const { t, lang } = useLanguage();
  const [loaderDone, setLoaderDone] = useState(false);
  const homeRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const aboutTextRef = useRef(null);

  /* Chatbot Floating Widget state */
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatName, setChatName] = useState('');
  const [chatEmail, setChatEmail] = useState('');
  const [chatMsg, setChatMsg] = useState('');
  const [chatSent, setChatSent] = useState(false);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    setChatSent(true);
    setTimeout(() => {
      setChatSent(false);
      setIsChatOpen(false);
      setChatName('');
      setChatEmail('');
      setChatMsg('');
    }, 2500);
  };

  /* Read expertise from admin-editable data; fall back to translation keys for unedited fields */
  const IMAGE_MAP = { semi_sector: semiSectorImg, healthcare_sector: healthcareSectorImg, hero_bg_everstone: heroBg3 };
  const adminExpertise = getExpertise();
  const expertiseItems = adminExpertise.map((item, idx) => {
    const fallbackCaptions = [t('exp_1_caption'), t('exp_2_caption'), t('exp_3_caption')];
    const fallbackTitles = [t('exp_1_title'), t('exp_2_title'), t('exp_3_title')];
    const fallbackBodies = [t('exp_1_body'), t('exp_2_body'), t('exp_3_body')];
    const fallbackCtas = [t('exp_1_cta'), t('exp_2_cta'), t('exp_3_cta')];
    return {
      id: item.id,
      num: item.num,
      caption: lang === 'en' ? (item.caption_en || fallbackCaptions[idx]) : (item.caption_de || fallbackCaptions[idx]),
      title: lang === 'en' ? (item.title_en || fallbackTitles[idx]) : (item.title_de || fallbackTitles[idx]),
      body: lang === 'en' ? (item.body_en || fallbackBodies[idx]) : (item.body_de || fallbackBodies[idx]),
      cta: lang === 'en' ? (item.cta_en || fallbackCtas[idx]) : (item.cta_de || fallbackCtas[idx]),
      ctaPath: item.ctaPath,
      image: item.imagePreview || IMAGE_MAP[item.imageKey] || semiSectorImg,
    };
  });

  /* Read stats from admin-editable data */
  const adminStats = getStats();
  const statsList = adminStats.map((stat, idx) => {
    const fallbackLabels = [t('stat_1_label'), t('stat_2_label'), t('stat_3_label')];
    return {
      value: stat.value,
      prefix: stat.prefix,
      suffix: stat.suffix,
      label: lang === 'en' ? (stat.label_en || fallbackLabels[idx]) : (stat.label_de || fallbackLabels[idx]),
    };
  });



  /* ════════════════════════════════════════
     MASTER GSAP ANIMATION SETUP
     ════════════════════════════════════════ */
  useEffect(() => {
    if (!loaderDone || !homeRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      /* ── 1. Hero entrance sequence ── */
      const heroTL = gsap.timeline({ delay: 0.1 });
      heroTL
        .fromTo('.hero-bg-img',
          { opacity: 0 },
          { opacity: 1, duration: 2, ease: 'power2.out' }
        )
        .fromTo('.hero-title',
          { x: -120, opacity: 0, filter: 'blur(8px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out' },
          0.3
        )
        .fromTo('.hero-desc-wrap',
          { x: 120, opacity: 0, filter: 'blur(8px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out' },
          0.5
        )
        .fromTo('.hero-letter',
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power4.out' },
          0.7
        );
      /* ── 2. Hero parallax on scroll ── */
      gsap.to('.hero-bg-img', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('.hero-content', {
        y: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: '60% top',
          end: 'bottom top',
          scrub: true,
        },
      });

      /* ── 4. Expertise section reveals ── */
      // Heading
      gsap.fromTo('.expertise-section .heading-wrapper',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.expertise-section .heading-wrapper',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
      /* ── 4b. Sticky Envelope Card Stacking Animation ── */
      const expCards = gsap.utils.toArray('.exp-card-row');
      expCards.forEach((card, i) => {
        // Scale down & dim current card as next card comes up over it like an envelope layer
        if (i < expCards.length - 1) {
          gsap.to(card, {
            scale: 0.92,
            opacity: 0.45,
            filter: 'blur(4px)',
            ease: 'none',
            scrollTrigger: {
              trigger: expCards[i + 1],
              start: 'top 90%',
              end: 'top 100px',
              scrub: true,
            },
          });
        }
      });
      /* ── 5. Case title & marquee ── */
      const caseTitleTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.case-title-section',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
      caseTitleTL
        .fromTo('.case-title-section .caption',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo('.case-title-section .heading-style-h2',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          0.1
        )
        .fromTo('.case-title-section .text-size-small',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          0.3
        );
      /* ── 7. Domain words list stagger ── */
      gsap.fromTo('.domain-word-item',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.domains-words-list',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
      /* ── 8. Data / Stats section ── */
      const dataTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.data-section',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
      dataTL
        .fromTo('.data-title-wrap',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
        )
        .fromTo('.data-item',
          { y: 60, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
          0.2
        )
        .fromTo('.data-cta-wrap',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          0.6
        );
      /* ── 10. CTA section ── */
      const ctaTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
      ctaTL
        .fromTo('.cta-section .caption',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        )
        .fromTo('.cta-h3',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          0.1
        )
        .fromTo('.cta-big-text',
          { y: 80, opacity: 0, scale: 0.7 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power4.out' },
          0.2
        )
        .fromTo('.cta-bottom',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          0.5
        );
      /* ── 11. FAQ section ── */
      const faqTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.faq-section',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
      faqTL
        .fromTo('.faq-section .heading-wrapper',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo('.faq-accordion',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
          0.2
        )
        .fromTo('.faq-cta-card',
          { y: 50, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
          0.3
        );
      /* ── 13. About horizontal scroll & overlay sequence ── */
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-scroll-section',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // 1. Giant text scrolls horizontally across the image (0 to 0.85)
      aboutTl.to('.about-scroll-text', {
        x: () => {
          const el = document.querySelector('.about-scroll-text');
          return el ? -(el.scrollWidth - window.innerWidth + window.innerWidth * 0.15) : -1500;
        },
        ease: 'none',
        duration: 0.85,
      }, 0);

      // 2. Giant text fades out smoothly (0.5 to 0.65)
      aboutTl.to('.about-scroll-text', {
        opacity: 0,
        duration: 0.15,
      }, 0.5);

      // 3. Right-side paragraph fades & slides in (0.5 to 1.3)
      aboutTl.fromTo('.about-split-overlay',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
        0.5
      );

      /* ── 12. Footer letter reveal ── */
      gsap.fromTo('.footer-links-area',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.footer',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
      gsap.fromTo('.footer-giant-letter',
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0, opacity: 1,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.footer-letters-wrap',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, homeRef);
    return () => ctx.revert();
  }, [loaderDone]);

  /* Callback for loader */
  const handleLoaderComplete = useCallback(() => setLoaderDone(true), []);
  if (!loaderDone) {
    return <HomeLoader onComplete={handleLoaderComplete} />;
  }

  return (
    <div className="home-page" ref={homeRef}>
      {/* Floating Contact Chatbot Widget */}
      {isChatOpen && (
        <div className="home-chat-widget">
          <div className="chat-widget-header">
            <div className="chat-widget-title-wrap">
              <span className="chat-online-dot" />
              <div>
                <h4 className="chat-widget-title">Zebrold Executive Desk</h4>
                <span className="chat-widget-subtitle">Usually replies in &lt; 5 mins</span>
              </div>
            </div>
            <button
              type="button"
              className="chat-widget-close"
              onClick={() => setIsChatOpen(false)}
              aria-label="Close widget"
            >
              ✕
            </button>
          </div>

          <div className="chat-widget-body">
            {chatSent ? (
              <div className="chat-success-msg">
                <span className="success-icon">✓</span>
                <h4>Vielen Dank / Thank you!</h4>
                <p>Your inquiry has been logged. An executive will reach out shortly.</p>
              </div>
            ) : (
              <>
                <div className="chat-welcome-msg">
                  <p>👋 Hallo! How can our industrial management team assist you today?</p>
                </div>

                <div className="chat-options">
                  <a href="tel:+496912345670" className="chat-channel-btn">
                    <span className="channel-icon">📞</span>
                    <div>
                      <strong>Direct Call</strong>
                      <small>+49 (0) 69 1234 5670</small>
                    </div>
                  </a>

                  <a href="mailto:contact@zebrold.de" className="chat-channel-btn">
                    <span className="channel-icon">✉️</span>
                    <div>
                      <strong>Official Email</strong>
                      <small>contact@zebrold.de</small>
                    </div>
                  </a>
                </div>

                <form onSubmit={handleQuickSubmit} className="chat-quick-form">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="chat-input"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Business Email"
                    required
                    className="chat-input"
                    value={chatEmail}
                    onChange={(e) => setChatEmail(e.target.value)}
                  />
                  <textarea
                    placeholder="How can we assist your business?"
                    rows={2}
                    required
                    className="chat-input chat-textarea"
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                  />
                  <button type="submit" className="chat-submit-btn">
                    Send Inquiry →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Contact Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`home-floating-phone ${isChatOpen ? 'active' : ''}`}
        aria-label="Toggle Contact Chat Widget"
      >
        {isChatOpen ? (
          <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>✕</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        )}
      </button>

      {/* ═══════ SECTION 1: HERO ═══════ */}
      <section className="hero-section">
        <div className="hero-bg">
          <img src={heroBg1} alt="" className="hero-bg-img" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <div className="padding-global hero-padding-bottom-zero">
            <div className="container-large hero-layout">
              <div className="hero-copy">
                <h2 className="hero-title">
                  {t('hero_title')}
                </h2>
                <div className="hero-desc-wrap">
                  <p className="hero-desc">
                    {t('hero_desc')}
                  </p>
                </div>
              </div>
              {/* Brand Letters - Arrodz Layout */}
              <div className="hero-brand-letters">
                {/* Floating Badges */}
                <div className="hero-badges-wrapper">
                  <div className="hero-badge hero-badge-cream">
                    {t('hero_badge_1')}
                  </div>
                  <div className="hero-badge hero-badge-brown">
                    {t('hero_badge_2')}
                  </div>
                </div>
                {BRAND_LETTERS.map((letter, i) => {
                  const isBrown = letter === 'E' || letter === 'R' || letter === 'L';
                  const isO = letter === 'O';
                  return (
                    <span
                      key={i}
                      className={`hero-letter ${isBrown ? 'is-brown' : ''} ${isO ? 'is-o' : ''}`}
                    >
                      {isO ? (
                        <Link to="/contact" className="hero-o-pill">
                          <span className="hero-o-pill-text">{t('hero_cta')}</span>
                          <span className="hero-o-pill-arrow">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                              <path d="M2.15 10c0 .46.37.83.83.83h8.91c.89 0 1.34 1.08.71 1.71l-2.11 2.11a.83.83 0 001.18 1.18l5.12-5.13a1 1 0 000-1.41L11.67 4.17a.83.83 0 00-1.18 1.18l2.11 2.11c.63.63.19 1.71-.71 1.71H2.99A.83.83 0 002.15 10z" fill="currentColor" />
                            </svg>
                          </span>
                        </Link>
                      ) : (
                        letter
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ═══════ SECTION 3: EXPERTISE (SINGLE LAYOUT, CARD GRID) ═══════ */}
      <section className="expertise-section">
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="heading-wrapper">
              <div className="caption">{t('exp_caption')}</div>
              <div className="heading-title-wrapper">
                <div className="max-width-large">
                  <h2 className="heading-style-h2">
                    {t('exp_title')}
                  </h2>
                </div>
              </div>
              <div className="max-width-medium">
                <p className="text-size-small">
                  {t('exp_sub')}
                </p>
              </div>
            </div>
            {/* All cards in one single layout */}
            <div className="exp-cards-list">
              {expertiseItems.map((item, idx) => (
                <div
                  key={item.id}
                  id={item.id}
                  className={`exp-card-row exp-card-reveal ${idx === 0 || idx === 2 ? 'exp-card-row--brown' : ''}`}
                >
                  {/* Left: text card */}
                  <div className="exp-card-text-block">
                    <span className="exp-card-pill">{item.caption}</span>
                    <h3 className="exp-card-heading">{item.title}</h3>
                    <p className="exp-card-body">{item.body}</p>
                    <div className="exp-card-cta">
                      <Link to={item.ctaPath} className="button">
                        <span className="button-text">{item.cta}</span>
                      </Link>
                    </div>
                  </div>
                  {/* Right: image */}
                  <div className="exp-card-image-block">
                    {item.id === 'global-presence' ? (
                      <div className="continent-list-container">
                        <div className="continent-group-card">
                          <div className="continent-card-header">
                            <span className="continent-badge">Europa</span>
                            <span className="continent-role">{lang === 'en' ? 'Global HQ & High-Tech Manufacturing' : 'Globaler Hauptsitz & High-Tech Fertigung'}</span>
                          </div>
                          <div className="continent-cities-footer">
                            <h4 className="continent-cities">München & Dresden</h4>
                            <p className="continent-countries">{lang === 'en' ? 'Germany' : 'Deutschland'}</p>
                          </div>
                        </div>
                        <div className="continent-group-card">
                          <div className="continent-card-header">
                            <span className="continent-badge">APAC (Asia-Pacific)</span>
                            <span className="continent-role">{lang === 'en' ? 'APAC Operational Hub & Engineering' : 'APAC-Betriebszentrale & Engineering'}</span>
                          </div>
                          <div className="continent-cities-footer">
                            <h4 className="continent-cities">Sydney & Bangalore</h4>
                            <p className="continent-countries">{lang === 'en' ? 'Australia / India' : 'Australien / Indien'}</p>
                          </div>
                        </div>
                        <div className="continent-group-card">
                          <div className="continent-card-header">
                            <span className="continent-badge">Americas</span>
                            <span className="continent-role">{lang === 'en' ? 'Americas Hub & Capital Allocation' : 'Americas Hub & Capital Allocation'}</span>
                          </div>
                          <div className="continent-cities-footer">
                            <h4 className="continent-cities">New York</h4>
                            <p className="continent-countries">USA</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="exp-card-img-wrap">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="exp-card-img"
                          loading="lazy"
                        />
                        <div className="exp-card-img-overlay" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 4: DOMAINS SHOWCASE ═══════ */}
      <section className="domains-showcase-section">
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="heading-wrapper is-center">
              <div className="heading-title-wrapper is-center">
                <div className="caption">{t('kat_caption')}</div>
                <div className="max-width-large">
                  <h2 className="heading-style-h2">
                    {t('kat_title')}
                  </h2>
                </div>
              </div>
              <div className="max-width-medium">
                <p className="text-size-small">
                  {t('kat_desc')}
                </p>
              </div>
            </div>

            {/* Sector Detail Card (Reference Screenshot Layout) */}
            <div className="sector-detail-card-container">
              <div className="sector-detail-header">
                <span>SECTOR DETAIL</span>
              </div>
              <div className="sector-detail-list">
                {getDomains().map((domain) => {
                  const sectorName = lang === 'en' ? (domain.subtitle || domain.title) : domain.title;
                  const slug = sectorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return (
                    <Link
                      key={domain.id}
                      to={`/sectors/${slug}`}
                      className="sector-detail-row-item"
                    >
                      <span className="sector-detail-row-title">{sectorName}</span>
                      <span className="sector-detail-row-arrow">→</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="domains-cta-bar">
              <Link to="/sectors" className="button button-large">
                <span className="button-text">{t('kat_explore_all')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 7: DATA / STATS ═══════ */}
      <section id="about" className="data-section">
        <div className="padding-global padding-section-small">
          <div className="container-medium">
            <div className="data-component">
              <div className="data-title-wrap">
                <h2 className="heading-style-h4">
                  {t('stats_title')}
                </h2>
                <p className="data-subtitle-text">
                  {lang === 'en'
                    ? 'Uncompromising commitment to capital deployment, operational precision, and long-term value creation across 12 strategic divisions.'
                    : 'Kompromissloser Anspruch an Kapitalallokation, operative Präzision und langfristige Wertschöpfung in 12 strategischen Bereichen.'}
                </p>
              </div>
              <div className="data-grid">
                {statsList.map((stat, i) => {
                  const statSubtext = [
                    lang === 'en'
                      ? 'Aggregated annual turnover generated across global subsidiaries.'
                      : 'Aggregierter Jahresumsatz aller globalen Tochtergesellschaften.',
                    lang === 'en'
                      ? 'Specialized market leaders operating across Europe, Asia & Americas.'
                      : 'Spezialisierte Marktführer in Europa, Asien und Amerika.',
                    lang === 'en'
                      ? 'Accelerated expansion in EV, Semiconductors & AI infrastructure.'
                      : 'Beschleunigtes Wachstum in EV, Halbleitern & KI-Infrastruktur.'
                  ];
                  return (
                    <div key={i} className="data-item">
                      <div className="data-value">
                        <AnimatedCounter
                          value={stat.value}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                          isDecimal={stat.value % 1 !== 0}
                        />
                      </div>
                      <div className="data-label">{stat.label}</div>
                      <div className="data-desc-line">{statSubtext[i]}</div>
                    </div>
                  );
                })}
              </div>
              <div className="data-cta-wrap">
                <p className="text-size-medium text-weight-bold">{t('stat_cta_title')}</p>
                <Link to="/contact" className="button button-small">
                  <span className="button-text">{t('stat_cta_btn')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 8: IN THE NEWS ═══════ */}
      <section className="home-news-section">
        <div className="home-news-tab">{t('news_tab')}</div>
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="home-news-grid">
              {/* Top row */}
              <div className="home-news-row-top">
                <div className="home-news-card news-featured-card">
                  <div className="news-featured-image-side" style={getNewsSection().featured.imagePreview ? { backgroundImage: `url(${getNewsSection().featured.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    <div className="news-dots">
                      <span className="news-dot"></span>
                      <span className="news-dot active"></span>
                      <span className="news-dot"></span>
                    </div>
                  </div>
                  <div className="news-featured-content-side">
                    <div className="news-tag">{lang === 'en' ? (getNewsSection().featured.tag_en || t('news_tag_press')) : (getNewsSection().featured.tag_de || t('news_tag_press'))}</div>
                    <h3 className="news-title">{lang === 'en' ? (getNewsSection().featured.title_en || t('news_title_1')) : (getNewsSection().featured.title_de || t('news_title_1'))}</h3>
                    <div className="news-body-line">
                      <p className="news-desc">{lang === 'en' ? (getNewsSection().featured.desc_en || t('news_desc_1')) : (getNewsSection().featured.desc_de || t('news_desc_1'))}</p>
                    </div>
                    <div className="news-arrow">→</div>
                  </div>
                </div>
                <div className="home-news-card news-facts-card" style={getNewsSection().facts.imagePreview ? { backgroundImage: `url(${getNewsSection().facts.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                  <div className="news-tag">{lang === 'en' ? (getNewsSection().facts.tag_en || 'FACTS') : (getNewsSection().facts.tag_de || 'FAKTEN')}</div>
                  <h3 className="news-title-large">{lang === 'en' ? (getNewsSection().facts.title_en || 'Did You Know') : (getNewsSection().facts.title_de || 'Wussten Sie schon')}</h3>
                  <div className="news-body-line">
                    <p>{lang === 'en' ? (getNewsSection().facts.body_en || '') : (getNewsSection().facts.body_de || '')}</p>
                  </div>
                  <div className="news-reload-icon">↻</div>
                </div>
              </div>
              {/* Bottom row */}
              <div className="home-news-row-bottom">
                <div className="home-news-card news-social-card fb-card" style={getNewsSection().facebook.imagePreview ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getNewsSection().facebook.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff' } : {}}>
                  <div className="social-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </div>
                  <div className="news-body-line">
                    <p>{lang === 'en' ? (getNewsSection().facebook.body_en || '') : (getNewsSection().facebook.body_de || '')}</p>
                    <p className="news-hashtags">{getNewsSection().facebook.hashtags || '#ZebroldGroups #InnovationSummit #FutureTech2026'}</p>
                  </div>
                  <p className="news-date">{lang === 'en' ? (getNewsSection().facebook.date_en || '3 months ago') : (getNewsSection().facebook.date_de || 'Vor 3 Monaten')}</p>
                  <div className="external-link-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </div>
                </div>
                <div className="home-news-card news-social-card ig-card" style={getNewsSection().instagram.imagePreview ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getNewsSection().instagram.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff' } : {}}>
                  <div className="social-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <div className="news-body-line">
                    <p>{lang === 'en' ? (getNewsSection().instagram.body_en || '') : (getNewsSection().instagram.body_de || '')}</p>
                    <p className="news-hashtags">{getNewsSection().instagram.hashtags || '#ZebroldGroups #TechSummit #Innovation2026'}</p>
                  </div>
                  <p className="news-date">{lang === 'en' ? (getNewsSection().instagram.date_en || '3 months ago') : (getNewsSection().instagram.date_de || 'Vor 3 Monaten')}</p>
                  <div className="external-link-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="home-news-cta-wrap">
                <Link to="/news" className="home-news-pill-btn">
                  {t('news_all')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 9: ABOUT HORIZONTAL SCROLL + SPLIT OVERLAY ═══════ */}
      <section className="about-home-section">
        <div className="about-bg-image">
          <img src={leadershipTeamImg} alt="Leadership" className="about-bg-img-inner" />
          <div className="about-image-overlay"></div>
        </div>
        <div className="about-scroll-section">
          <div className="about-scroll-sticky">
            <h2 className="about-scroll-text">
              {lang === 'en' ? (getAboutScroll().text_en || 'WORKING WITH YOU, NOT JUST FOR YOU') : (getAboutScroll().text_de || 'WIR ARBEITEN MIT IHNEN, NICHT NUR FÜR SIE')}
            </h2>

            <div className="about-split-overlay">
              <div className="about-split-content">
                <p>
                  {lang === 'en'
                    ? "We observe, listen, and build strategies that align with your reality. No templated models, no artificial layers: authentic, precise, and sustainable."
                    : "Wir beobachten, hören zu und entwickeln Strategien, die Ihrer Realität entsprechen. Keine vorgefertigten Modelle, keine künstlichen Schichten: authentisch, präzise und nachhaltig."}
                </p>
                <p>
                  {lang === 'en'
                    ? "Zebrold was born from a simple idea: to empower the industries that move the world. Those with a clear vision, a dedicated team, and an eye for detail."
                    : "Zebrold entstand aus einer einfachen Idee: die Industrien zu stärken, die die Welt bewegen. Diejenigen mit einer klaren Vision, einem engagierten Team und einem Auge fürs Detail."}
                </p>
                <p>
                  {lang === 'en'
                    ? "Our approach relies on exchange and observation. We take the time to understand your daily operations, what sets you apart, and what you aim to achieve."
                    : "Unser Ansatz basiert auf Austausch und Beobachtung. Wir nehmen uns die Zeit, Ihre täglichen Abläufe zu verstehen, was Sie auszeichnet und was Sie erreichen wollen."}
                </p>
                <p>
                  {lang === 'en'
                    ? "We don't overplay anything. We just seek the right way to show who you are: sincere content, a coherent strategy, a clear identity. A framework that doesn't distort you, but reveals you."
                    : "Wir spielen nichts vor. Wir suchen nur den richtigen Weg zu zeigen, wer Sie sind: aufrichtige Inhalte, eine kohärente Strategie, eine klare Identität. Ein Rahmen, der Sie nicht verzerrt, sondern Sie enthüllt."}
                </p>
                <p className="text-bold">
                  {lang === 'en'
                    ? "We understand your stakes, not just your requests."
                    : "Wir verstehen Ihre Herausforderungen, nicht nur Ihre Anfragen."}
                </p>
              </div>
              <div className="about-bottom-cta">
                <Link to="/contact" className="about-bottom-btn">
                  {lang === 'en' ? "Ready to advance?" : "Bereit voranzukommen?"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="padding-global padding-section-large">
          <div className="container-medium">
            <div className="cta-component">
              <div className="caption" style={{ color: 'var(--color-cream)', opacity: 0.85 }}>
                {t('cta_bottom_caption')}
              </div>
              <div className="cta-title-wrap">
                <h2 className="heading-style-h3 cta-h3" style={{ color: '#ffffff', opacity: 1 }}>
                  {t('cta_bottom_h3')}
                </h2>
                <div className="cta-big-text">{t('cta_bottom_big')}</div>
              </div>
              <div className="cta-bottom">
                <div className="max-width-medium">
                  <p className="cta-desc-text">
                    {t('cta_bottom_desc')}
                  </p>
                </div>
                <div className="cta-btn-group">
                  <Link to="/contact" className="button is-beige">
                    <span className="button-text">{t('cta_bottom_btn')}</span>
                  </Link>
                  <span className="cta-fine-print">{t('cta_bottom_fine')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ═══════ SECTION 10: FAQ ═══════ */}
      <section className="faq-section">
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="faq-component">
              <div className="faq-left">
                <div className="heading-wrapper">
                  <div className="heading-title-wrapper">
                    <div className="caption">{t('faq_caption')}</div>
                    <div className="max-width-medium">
                      <h2 className="heading-style-h2">
                        {t('faq_h2')}
                      </h2>
                    </div>
                  </div>
                  <div className="max-width-medium">
                    <p className="text-size-small">
                      {t('faq_desc')}
                    </p>
                  </div>
                </div>
                <div className="faq-list">
                  {getFaqItems(t, lang).map((item, i) => (
                    <FaqItem key={i} question={item.q} answer={item.a} index={i} />
                  ))}
                </div>
              </div>
              <div className="faq-cta-card">
                <Link to="/contact" className="faq-cta-link">
                  <p className="text-size-medium text-weight-semibold">
                    {t('faq_cta_text')}
                  </p>
                  <span className="faq-cta-contact">{t('faq_cta_btn')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}