import { useScrollReveal } from '../../hooks/useScrollReveal';
import { offices } from '../../data/offices';
import OfficeMap from '../../components/OfficeMap/OfficeMap';
import './Offices.css';

const regions = ['Europe', 'India', 'Australia'];

export default function Offices() {
  const pageRef = useScrollReveal();

  return (
    <div ref={pageRef} className="offices-page">
      {/* Hero */}
      <section className="page-hero offices-hero" aria-label="Offices hero">
        <div className="container page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="breadcrumb-link">Home</a>
            <span> / </span>
            <span aria-current="page">Global Offices</span>
          </nav>
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
    </div>
  );
}
