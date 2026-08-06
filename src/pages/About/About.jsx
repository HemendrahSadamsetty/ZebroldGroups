import { useScrollReveal } from '../../hooks/useScrollReveal';
import SEO from '../../components/SEO/SEO';
import './About.css';

const boardOfDirectors = [
  {
    name: 'Hemendrah Kumar Sadamsetty',
    title: 'Chairman',
    bio: 'A visionary entrepreneur and industrialist, Hemendrah Kumar Sadamsetty founded the Zebrold Group in 2013 with a singular mission: to build globally competitive enterprises anchored in German standards of precision, governance, and innovation.',
    initials: 'HKS',
    isChairman: true,
  },
  {
    name: 'Stakwe Haplene',
    title: 'Chief Executive Officer',
    bio: 'Group CEO responsible for operational leadership, portfolio performance, and cross-sector strategic execution across European and global markets. Drives the Group\'s expansion across 12 sectors and 3 continents.',
    initials: 'SH',
  },
  {
    name: 'Indu Reddy Morthala',
    title: 'Managing Director',
    bio: 'Indu Reddy Morthala brings two decades of operational leadership across finance, technology, and industrial sectors. As Managing Director, she drives portfolio strategy, cross-subsidiary synergies, and the Group\'s global expansion agenda.',
    initials: 'IRM',
  },
];

const subsidiaries = [
  { company: 'Everstone Energy', ceo: 'Dr. Klaus Mehringer', md: 'Ms. Priya Venkatesh' },
  { company: 'Northvolt Power', ceo: 'Mr. Lars Bergström', md: 'Mr. Rajiv Srinivasan' },
  { company: 'Meridian Microelectronics', ceo: 'Prof. Dr. Andrea Fischmann', md: 'Mr. Suresh Ramachandran' },
  { company: 'Silicon Crest Technologies', ceo: 'Dr. Maara Krishnamurthy', md: 'Mr. Thomas Kleinhans' },
  { company: 'Redford Automotive', ceo: 'Mr. Sebastian Wirth', md: 'Ms. Ananya Reddy' },
  { company: 'Westbridge Motors', ceo: 'Mr. Jonathan Hartley', md: 'Mr. Vikram Nair' },
  { company: 'PrimeMart Retail', ceo: 'Ms. Helena Brandt', md: 'Mr. Arun Pillai' },
  { company: 'UrbanBasket Stores', ceo: 'Mr. Felix Gruber', md: 'Ms. Deepa Iyer' },
  { company: 'Brighton Education Group', ceo: 'Dr. Sophie Lindqvist', md: 'Mr. Arjun Krishnan' },
  { company: 'Clearpath Learning', ceo: 'Ms. Nadia Schulz', md: 'Dr. Kiran Subramanian' },
  { company: 'Instructis Career', ceo: 'Ms. Priya Malhotra', md: 'Mr. Hemendrah Kumar Sadamsetty' },
  { company: 'Skybridge Technologies', ceo: 'Mr. Rahul Banerjee', md: 'Ms. Christine Hofer' },
  { company: 'Arden Digital Solutions', ceo: 'Ms. Preethi Nambiar', md: 'Mr. Markus Steiner' },
  { company: 'Sterling Financial Services', ceo: 'Mr. Aditya Mehta', md: 'Ms. Katarina Vogt' },
  { company: 'Harrington Capital Group', ceo: 'Mr. James Harrington IV', md: 'Dr. Anand Subramaniam' },
  { company: 'Oakwell Healthcare', ceo: 'Dr. Ramesh Padmanabhan', md: 'Dr. Ingrid Bauer' },
  { company: 'Greenford Pharmaceuticals', ceo: 'Dr. Sanjay Kulkarni', md: 'Dr. Petra Zimmermann' },
  { company: 'PrimeRoute Logistics', ceo: 'Mr. Sanjiv Kapoor', md: 'Ms. Birgit Hoffmann' },
];

const values = [
  { title: 'Precision', desc: 'German engineering rigour applied to every decision — from capital allocation to product design.', icon: '⬡' },
  { title: 'Scale', desc: 'Operating across 12 sectors and 3 continents, we build for impact at the highest order of magnitude.', icon: '◎' },
  { title: 'Trust', desc: 'Governance, transparency, and accountability are non-negotiable at every level of the Group.', icon: '◈' },
  { title: 'Innovation', desc: 'We invest ahead of the curve — in semiconductors, EV, AI, and next-generation healthcare.', icon: '◇' },
];
const stats = [
  { value: 'EUR 2.1B', label: 'Revenue FY25' },
  { value: 'INR 13,705 Cr', label: 'Working Capital' },
  { value: '26', label: 'Global Offices' },
  { value: '12', label: 'Sectors' },
];

export default function About() {
  const pageRef = useScrollReveal();

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Zebrold International Holdings Limited (Zebrold IHL)",
    "description": "Corporate overview, history, board of directors, and governance of Zebrold International Holdings Limited (Zebrold IHL).",
    "url": "https://www.zebrold.de/about",
    "mainEntity": {
      "@type": "Corporation",
      "name": "Zebrold International Holdings Limited",
      "alternateName": ["Zebrold IHL", "Zebrold Group", "ZIHL"],
      "foundingDate": "2013",
      "url": "https://www.zebrold.de",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bockenheimer Landstrasse 17-19",
        "addressLocality": "Frankfurt am Main",
        "postalCode": "60325",
        "addressCountry": "DE"
      }
    }
  };

  return (
    <div ref={pageRef} className="about-page">
      <SEO
        title="About Us | Zebrold International Holdings Limited (Zebrold IHL)"
        description="Learn about Zebrold International Holdings Limited (Zebrold IHL) — Established in 2013 in Frankfurt am Main, Germany. Managing 26 subsidiaries across 12 strategic sectors with EUR 2.1B revenue."
        keywords="About Zebrold, Zebrold IHL, Zebrold International Holdings Limited, Zebrold Group history, Frankfurt conglomerate governance, board of directors"
        url="/about"
        schemaData={aboutSchema}
      />
      {/* Hero */}
      <section className="page-hero about-hero" aria-label="About hero">
        <div className="container page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="breadcrumb-link">Home</a>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">About</span>
          </nav>
          <h1 className="page-hero-title reveal">
            Built to Lead.<br />Built to Last.
          </h1>
          <p className="page-hero-sub reveal" data-delay="1">
            The story of Zebrold International Holdings Limited (Zebrold IHL) — a Frankfurt conglomerate with global ambition.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="section about-overview" aria-labelledby="about-overview-heading">
        <div className="container">
          <div className="about-overview-grid">
            <div className="about-overview-left">
              <span className="section-label">Group Overview</span>
              <h2 id="about-overview-heading" className="section-title reveal">
                A conglomerate engineered for the 21st century.
              </h2>
              <div className="divider" />
              <p className="about-overview-body reveal" data-delay="1">
                <strong>Zebrold International Holdings Limited</strong> (widely known as <strong>Zebrold IHL</strong> or the Zebrold Group) was established in 2013 in Frankfurt am Main with a vision to build a globally diversified, institutionally governed enterprise capable of competing across industries and continents. Today, the Group comprises 26 subsidiaries operating in 12 strategic sectors — from EV charging infrastructure and semiconductor design to finance, education, healthcare, and industrial engineering.
              </p>
              <p className="about-overview-body reveal" data-delay="2">
                With EUR 2.1 billion in annual revenue and INR 13,705 crore in working capital, Zebrold operates with the financial discipline of a public company and the strategic agility of a founder-led enterprise. Our 26 offices span Europe, India, and Australia, making us a truly multi-regional group with local depth in every market we serve.
              </p>
            </div>
            <div className="about-stats-grid reveal" data-delay="2">
              {stats.map((s, i) => (
                <div key={i} className="about-stat-card">
                  <span className="about-stat-val">{s.value}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="section about-leadership about-board-section" aria-labelledby="board-heading">
        <div className="container">
          <span className="section-label" style={{ color: 'rgba(200,160,100,0.8)' }}>Corporate Governance</span>
          <h2 id="board-heading" className="section-title reveal" style={{ color: 'var(--color-white)' }}>
            Board of Directors
          </h2>
          <div className="divider" />
          <div className="about-board-grid">
            {boardOfDirectors.map((leader, i) => (
              <div key={leader.name} className={`about-board-card reveal${leader.isChairman ? ' about-board-card--chairman' : ''}`} data-delay={i + 1}>
                <div className="about-board-monogram" aria-hidden="true">{leader.initials}</div>
                <div className="about-board-info">
                  <p className="about-board-role">{leader.title}</p>
                  <h3 className="about-board-name">{leader.name}</h3>
                  <p className="about-board-bio">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Subsidiary Table */}
          <div className="about-subs-section">
            <div className="about-subs-header">
              <span className="section-label" style={{ color: 'rgba(200,160,100,0.8)', marginBottom: 0 }}>Subsidiary Leadership</span>
              <span className="about-subs-count">18 Companies</span>
            </div>
            <div className="about-subs-table">
              <div className="about-subs-thead">
                <div className="about-subs-th about-subs-th--company">Company</div>
                <div className="about-subs-th">CEO</div>
                <div className="about-subs-th">Managing Director</div>
              </div>
              <div className="about-subs-tbody">
                {subsidiaries.map((row, i) => (
                  <div key={i} className="about-subs-row">
                    <div className="about-subs-td about-subs-td--company">
                      <span className="about-subs-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="about-subs-company-name">{row.company}</span>
                    </div>
                    <div className="about-subs-td">{row.ceo}</div>
                    <div className="about-subs-td">{row.md}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section about-values" aria-labelledby="values-heading">
        <div className="container">
          <span className="section-label" style={{ color: 'var(--color-blue-400)' }}>Our Principles</span>
          <h2 id="values-heading" className="section-title reveal" style={{ color: 'var(--color-white)' }}>Four Pillars. One Standard.</h2>
          <div className="divider" />
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={v.title} className="value-card reveal card-lift" data-delay={i + 1}>
                <span className="value-icon" aria-hidden="true">{v.icon}</span>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HQ */}
      <section className="section about-hq" aria-labelledby="hq-heading">
        <div className="container">
          <div className="hq-card reveal">
            <div className="hq-card-left">
              <h2 id="hq-heading" className="hq-title">Frankfurt am Main</h2>
              <address className="hq-address">
                <p>Zebrold International Holdings Limited</p>
                <p>Bockenheimer Landstrasse 17-19</p>
                <p>60325 Frankfurt am Main</p>
                <p>Federal Republic of Germany</p>
              </address>
              <div className="hq-contact">
                <a href="tel:+496921004800">+49 69 2100 4800</a>
                <a href="mailto:investor@zebroldgroup.com">investor@zebroldgroup.com</a>
              </div>
            </div>
            <div className="hq-card-right" aria-hidden="true">
              <div className="hq-map-placeholder">
                <span className="hq-pin">📍</span>
                <span>Frankfurt, Germany</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
