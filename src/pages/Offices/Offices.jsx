import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { offices } from '../../data/offices';
import OfficeMap from '../../components/OfficeMap/OfficeMap';
import SEO from '../../components/SEO/SEO';
import './Offices.css';

const regions = ['Europe', 'India', 'Australia'];

export default function Offices() {
  const pageRef = useScrollReveal();

  const officesSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Global Offices — Zebrold International Holdings Limited (Zebrold IHL)",
    "description": "26 global offices across Europe, India, and Australia with Global Headquarters in Frankfurt am Main, Germany.",
    "url": "https://www.zebrold.de/offices",
    "mainEntity": {
      "@type": "Corporation",
      "name": "Zebrold International Holdings Limited",
      "alternateName": ["Zebrold IHL", "Zebrold Group"],
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
    <div ref={pageRef} className="offices-page">
      <SEO 
        title="Global Offices & Locations | Zebrold International Holdings Limited (Zebrold IHL)"
        description="26 strategic locations across Europe, India, and Australia. Global Headquarters of Zebrold International Holdings Limited (Zebrold IHL) in Frankfurt am Main, Germany."
        keywords="Zebrold offices, Zebrold global locations, Zebrold IHL headquarters, Zebrold International Holdings Limited Frankfurt, Munich, Dresden, London, Hyderabad, Sydney"
        url="/offices"
        schemaData={officesSchema}
      />
      {/* Hero */}
      <section className="page-hero offices-hero" aria-label="Offices hero">
        <div className="container page-hero-inner">
          <div className="offices-hero-top-bar">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/" className="breadcrumb-link">Home</a>
              <span> / </span>
              <span aria-current="page">Global Offices</span>
            </nav>
            <Link to="/admin" className="offices-admin-hero-btn">
              ⚙ Admin Console
            </Link>
          </div>
          <h1 className="page-hero-title reveal">26 Offices. 3 Continents.</h1>
          <p className="page-hero-sub reveal" data-delay="1">
            From Frankfurt to Hyderabad to Sydney — the Zebrold Group is where business happens.
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="section offices-map-section" aria-labelledby="offices-map-heading">
        <div className="container">
          <h2 id="offices-map-heading" className="section-title reveal" style={{ color: 'var(--color-white)' }}>
            Interactive Office Map
          </h2>
          <div className="divider" />
          <OfficeMap />
        </div>
      </section>

      {/* Office cards by region */}
      {regions.map(region => {
        const regionOffices = offices.filter(o => o.region === region);
        return (
          <section key={region} className="section offices-region" aria-labelledby={`region-${region}-heading`}>
            <div className="container">
              <div className="offices-region-header reveal">
                <span className="section-label">{region}</span>
                <h2 id={`region-${region}-heading`} className="section-title">
                  {regionOffices.length} Office{regionOffices.length > 1 ? 's' : ''}
                </h2>
              </div>
              <div className="offices-grid">
                {regionOffices.map((office, i) => (
                  <div
                    key={office.id}
                    className={`office-card reveal card-lift ${office.function.includes('Headquarter') ? 'office-card--hq' : ''}`}
                    data-delay={(i % 3) + 1}
                  >
                    {office.function.includes('Headquarter') && (
                      <span className="office-card-hq-badge">HQ</span>
                    )}
                    <div className="office-card-top">
                      <h3 className="office-card-city">{office.city}</h3>
                      <span className="office-card-country">{office.country}</span>
                    </div>
                    <span className="office-card-function">{office.function}</span>
                    <div className="office-card-region-tag">
                      <span className="office-region-dot" aria-hidden="true" />
                      {office.region}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Admin Console Callout */}
      <section className="section offices-admin-section">
        <div className="container">
          <div className="offices-admin-card reveal">
            <div className="offices-admin-text-wrap">
              <span className="section-label">CORPORATE GOVERNANCE</span>
              <h3 className="offices-admin-heading">Zebrold Group Admin Console</h3>
              <p className="offices-admin-desc">
                Access executive CMS controls, job postings, candidate CV applications, and homepage content management.
              </p>
            </div>
            <Link to="/admin" className="button button-large offices-admin-cta-btn">
              <span className="button-text">Open Admin Console →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
