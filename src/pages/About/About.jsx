import { useScrollReveal } from '../../hooks/useScrollReveal';
import './About.css';

const leadership = [
  {
    name: 'Hemendrah Kumar Sadamsetty',
    title: 'Chairman',
    bio: 'A visionary entrepreneur and industrialist, Hemendrah Kumar Sadamsetty founded the Zebrold Group in 2013 with a singular mission: to build globally competitive enterprises anchored in German standards of precision, governance, and innovation.',
    initials: 'HS',
  },
  {
    name: 'Indu Reddy Morthala',
    title: 'Managing Director',
    bio: 'Indu Reddy Morthala brings two decades of operational leadership across finance, technology, and industrial sectors. As Managing Director, she drives portfolio strategy, cross-subsidiary synergies, and the Group\'s global expansion agenda.',
    initials: 'IM',
  },
];

const values = [
  { title: 'Precision', desc: 'German engineering rigour applied to every decision — from capital allocation to product design.', icon: '⬡' },
  { title: 'Scale', desc: 'Operating across 12 sectors and 3 continents, we build for impact at the highest order of magnitude.', icon: '◎' },
  { title: 'Trust', desc: 'Governance, transparency, and accountability are non-negotiable at every level of the Group.', icon: '◈' },
  { title: 'Innovation', desc: 'We invest ahead of the curve — in semiconductors, EV, AI, and next-generation healthcare.', icon: '◇' },
];

const timeline = [
  { year: 2013, event: 'Zebrold Group founded in Frankfurt. Sterling Financial Services established as the anchor company.' },
  { year: 2014, event: 'Redford Automotive, Ironclad Engineering, and Harrington Capital Group incorporated.' },
  { year: 2015, event: 'Entry into healthcare and logistics. Oakwell Healthcare and PrimeRoute Logistics launched.' },
  { year: 2016, event: 'Technology expansion: Skybridge Technologies, Brighton Education Group, and Greenfield Agri established.' },
  { year: 2017, event: 'EV & Battery entry with Everstone Energy. Stonecraft Interiors and PrimeMart Retail added.' },
  { year: 2018, event: 'Instructis Career, UrbanBasket Stores, and Silverline Studios mark expansion into consumer and media verticals.' },
  { year: 2019, event: 'Nordics battery division launched via Northvolt Power. Total subsidiaries reach 26.' },
  { year: 2025, event: 'Group achieves EUR 2.1B revenue milestone. INR 13,705 Cr working capital. 26 offices worldwide.' },
];

const stats = [
  { value: 'EUR 2.1B', label: 'Revenue FY25' },
  { value: 'INR 13,705 Cr', label: 'Working Capital' },
  { value: '26', label: 'Global Offices' },
  { value: '12', label: 'Sectors' },
];

export default function About() {
  const pageRef = useScrollReveal();

  return (
    <div ref={pageRef} className="about-page">
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
            The story of a Frankfurt conglomerate with global ambition.
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
                Zebrold Group of Companies was established in 2013 in Frankfurt am Main with a vision to build a globally diversified, institutionally governed enterprise capable of competing across industries and continents. Today, the Group comprises 26 subsidiaries operating in 12 strategic sectors — from EV charging infrastructure and semiconductor design to finance, education, healthcare, and industrial engineering.
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

      {/* Leadership */}
      <section className="section about-leadership" aria-labelledby="leadership-heading">
        <div className="container">
          <h2 id="leadership-heading" className="section-title reveal" style={{ color: 'var(--color-white)' }}>
            The Minds Behind the Group.
          </h2>
          <div className="divider" />
          <div className="leaders-grid">
            {leadership.map((leader, i) => (
              <div key={leader.name} className="leader-card reveal" data-delay={i + 1}>
                <div className="leader-avatar" aria-hidden="true">{leader.initials}</div>
                <div className="leader-info">
                  <p className="leader-title label">{leader.title}</p>
                  <h3 className="leader-name">{leader.name}</h3>
                  <p className="leader-bio">{leader.bio}</p>
                  <div className="leader-sig" aria-hidden="true">— {leader.name.split(' ')[0]} {leader.name.split(' ').pop()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section about-timeline" aria-labelledby="timeline-heading">
        <div className="container">
          <h2 id="timeline-heading" className="section-title reveal">From Founding to EUR 2.1B.</h2>
          <div className="divider" />
          <div className="timeline">
            {timeline.map((item, i) => (
              <div key={item.year} className="timeline-item reveal" data-delay={(i % 4) + 1}>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-connector" aria-hidden="true">
                  <div className="timeline-dot" />
                  {i < timeline.length - 1 && <div className="timeline-line" />}
                </div>
                <p className="timeline-event">{item.event}</p>
              </div>
            ))}
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
                <p>Zebrold Group of Companies GmbH</p>
                <p>Neue Mainzer Straße 28</p>
                <p>60311 Frankfurt am Main</p>
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
