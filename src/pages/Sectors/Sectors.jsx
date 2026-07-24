import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { sectors } from '../../data/sectors';
import { subsidiaries } from '../../data/subsidiaries';
import SectorCard from '../../components/SectorCard/SectorCard';
import './Sectors.css';

export default function Sectors() {
  const pageRef = useScrollReveal();
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedSector, setExpandedSector] = useState(null);

  const filters = ['All', 'Industrial', 'Finance', 'Technology', 'Consumer', 'Healthcare', 'Infrastructure'];

  const categoryMap = {
    All: sectors,
    Industrial: sectors.filter(s => ['Industrial & Engineering', 'Car Manufacturing'].includes(s.name)),
    Finance: sectors.filter(s => ['Finance & Investment'].includes(s.name)),
    Technology: sectors.filter(s => ['Technology & IT', 'Semiconductors', 'EV Charging & Battery'].includes(s.name)),
    Consumer: sectors.filter(s => ['Retail & Consumer', 'Media & Entertainment', 'Education', 'Agriculture & Food'].includes(s.name)),
    Healthcare: sectors.filter(s => ['Healthcare & Pharma'].includes(s.name)),
    Infrastructure: sectors.filter(s => ['Logistics & Supply Chain'].includes(s.name)),
  };

  const filtered = categoryMap[activeFilter] || sectors;

  return (
    <div ref={pageRef} className="sectors-page">
      {/* Hero */}
      <section className="page-hero sectors-hero" aria-label="Sectors hero">
        <div className="container page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="breadcrumb-link">Home</a>
            <span> / </span>
            <span aria-current="page">Sectors</span>
          </nav>
          <h1 className="page-hero-title reveal">12 Sectors. Built to Lead.</h1>
          <p className="page-hero-sub reveal" data-delay="1">
            A diversified portfolio engineered for resilience and growth across the world's most strategic industries.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section sectors-main" aria-labelledby="sectors-main-heading">
        <div className="container">
          <h2 id="sectors-main-heading" className="sr-only">All Sectors</h2>

          {/* Filter tabs */}
          <div className="sector-filters reveal" role="tablist" aria-label="Filter sectors by category">
            {filters.map(f => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                className={`sector-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
                {f !== 'All' && (
                  <span className="sector-filter-count">{(categoryMap[f] || []).length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div className="sector-cards-grid" role="list">
            {filtered.map((sector, i) => (
              <div key={sector.id} role="listitem">
                <SectorCard sector={sector} delay={(i % 4) + 1} />
              </div>
            ))}
          </div>

          {/* Accordion detail */}
          <div className="sector-accordion reveal" aria-label="Sector details">
            <h3 className="sector-accordion-heading">Sector Detail</h3>
            {sectors.map(sector => {
              const sectorCompanies = subsidiaries.filter(c => c.sector === sector.name);
              const isOpen = expandedSector === sector.id;
              return (
                <div key={sector.id} className="sector-accordion-item">
                  <button
                    className="sector-accordion-trigger"
                    onClick={() => setExpandedSector(isOpen ? null : sector.id)}
                    aria-expanded={isOpen}
                    id={`sector-acc-${sector.id}`}
                    aria-controls={`sector-panel-${sector.id}`}
                  >
                    <span className="sector-accordion-name">{sector.name}</span>
                    <div className="sector-accordion-meta">
                      <span className="sector-accordion-wc font-mono">{sector.wc}</span>
                      <span className="sector-accordion-count">{sectorCompanies.length} companies</span>
                      <span className={`sector-accordion-chevron ${isOpen ? 'open' : ''}`}>▾</span>
                    </div>
                  </button>
                  <div
                    id={`sector-panel-${sector.id}`}
                    role="region"
                    aria-labelledby={`sector-acc-${sector.id}`}
                    className={`sector-accordion-panel ${isOpen ? 'open' : ''}`}
                  >
                    {sectorCompanies.map(co => (
                      <div key={co.id} className="sector-acc-company">
                        <div className="sector-acc-co-header">
                          <span className="sector-acc-co-name">{co.name}</span>
                          <span className="sector-acc-co-hq font-mono">{co.hq}</span>
                        </div>
                        <p className="sector-acc-co-desc">{co.description}</p>
                        <div className="sector-acc-co-stats">
                          <span>Revenue: <strong>{co.revenue}</strong></span>
                          <span>WC: <strong>{co.wc}</strong></span>
                          <span>Staff: <strong>{co.employees}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
