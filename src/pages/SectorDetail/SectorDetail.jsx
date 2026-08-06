import { useParams, Link } from 'react-router-dom';
import { sectors } from '../../data/sectors';
import { subsidiaries } from '../../data/subsidiaries';
import { sectorDetailsData } from '../../data/sectorDetailsData';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO/SEO';
import './SectorDetail.css';

export default function SectorDetail() {
  const { sectorSlug } = useParams();
  const { lang } = useLanguage();

  // Find sector matching slug or name
  const sector = sectors.find(s => {
    const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return slug === sectorSlug || String(s.id) === sectorSlug;
  }) || sectors[0];

  const matchedSlug = sector.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const richData = sectorDetailsData[matchedSlug] || sectorDetailsData['ev-charging-battery'];

  const sectorCompanies = subsidiaries.filter(c => c.sector === sector.name);

  const sectorDetailSchema = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": `${sector.name} — Zebrold International Holdings Limited (Zebrold IHL)`,
    "description": richData.overview,
    "url": `https://www.zebrold.de/sectors/${matchedSlug}`,
    "mainEntity": {
      "@type": "Service",
      "name": sector.name,
      "description": richData.overview,
      "provider": {
        "@type": "Corporation",
        "name": "Zebrold International Holdings Limited",
        "alternateName": ["Zebrold IHL", "Zebrold Group"]
      }
    }
  };

  return (
    <div className="sector-detail-page">
      <SEO 
        title={`${sector.name} | Zebrold International Holdings Limited (Zebrold IHL)`}
        description={`${richData.overview} Operated by Zebrold International Holdings Limited (Zebrold IHL).`}
        keywords={`${sector.name}, Zebrold ${sector.name}, Zebrold IHL, Zebrold International Holdings Limited, ${sectorCompanies.map(c => c.name).join(', ')}`}
        url={`/sectors/${matchedSlug}`}
        schemaData={sectorDetailSchema}
      />
      {/* Hero with Domain Background Image */}
      <section className="sector-detail-hero-section">
        <div className="sector-hero-bg-wrapper">
          <img src={richData.image} alt={sector.name} className="sector-hero-bg-img" loading="eager" width="1920" height="1080" />
          <div className="sector-hero-bg-overlay" />
        </div>

        <div className="container sector-hero-container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-sep"> / </span>
            <Link to="/sectors" className="breadcrumb-link">Sectors</Link>
            <span className="breadcrumb-sep"> / </span>
            <span aria-current="page" className="breadcrumb-current">{sector.name}</span>
          </nav>

          <div className="sector-hero-badge-wrap">
            <span className="sector-hero-badge">{sector.wc} Operational Capital</span>
            <span className="sector-hero-badge sector-badge-dark">{sectorCompanies.length || sector.companies.length} Portfolio Companies</span>
          </div>

          <h1 className="sector-hero-title">{sector.name}</h1>
          <p className="sector-hero-tagline">{richData.tagline}</p>
          <p className="sector-hero-overview">{richData.overview}</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="sector-stats-section">
        <div className="container">
          <div className="sector-stats-grid">
            {richData.stats.map((stat, i) => (
              <div key={i} className="sector-stat-card">
                <div className="sector-stat-value">{stat.value}</div>
                <div className="sector-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="sector-detail-body-section">
        <div className="container">
          {/* Key Innovations */}
          <div className="sector-innovations-block">
            <div className="sector-section-header">
              <span className="section-caption">Core Engineering & Capabilities</span>
              <h2 className="sector-section-h2">Technological Innovations in {sector.name}</h2>
            </div>
            
            <div className="sector-innovations-grid">
              {richData.innovations.map((item, idx) => (
                <div key={idx} className="innovation-card">
                  <div className="innovation-num">0{idx + 1}</div>
                  <h3 className="innovation-title">{item.title}</h3>
                  <p className="innovation-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Companies */}
          <div className="sector-companies-block">
            <div className="sector-section-header">
              <span className="section-caption">Zebrold Portfolio</span>
              <h2 className="sector-section-h2">Operating Subsidiaries in {sector.name}</h2>
            </div>

            <div className="sector-companies-grid">
              {sectorCompanies.length > 0 ? (
                sectorCompanies.map(company => (
                  <div key={company.id} className="sector-company-card">
                    <div className="company-badge-line">
                      <span className="company-tag">{company.location || 'Global Headquarters'}</span>
                      <span className="company-wc-tag">{company.wc || 'EUR 250M'}</span>
                    </div>
                    <h3 className="company-name">{company.name}</h3>
                    <p className="company-desc">{company.description || 'Market leader within the Zebrold Group industrial ecosystem.'}</p>
                  </div>
                ))
              ) : (
                (sector.companies || ['Zebrold Subsidiary']).map((cName, idx) => (
                  <div key={idx} className="sector-company-card">
                    <span className="company-tag">Zebrold Group Subsidiary</span>
                    <h3 className="company-name">{cName}</h3>
                    <p className="company-desc">Operating division specializing in strategic industrial deployment and technical services.</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Strategic Mission Quote */}
          <div className="sector-mission-banner">
            <div className="mission-banner-content">
              <span className="mission-caption">STRATEGIC MISSION</span>
              <p className="mission-text">"{richData.mission}"</p>
            </div>
          </div>

          {/* Back Navigation Bar */}
          <div className="sector-detail-cta-bar">
            <Link to="/sectors" className="button button-secondary">
              ← {lang === 'en' ? 'Back to All Sectors' : 'Zurück zu allen Sektoren'}
            </Link>
            <Link to="/contact" className="button">
              {lang === 'en' ? 'Partner With This Sector →' : 'Mit diesem Sektor kooperieren →'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
