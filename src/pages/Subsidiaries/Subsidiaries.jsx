import { useState, useMemo } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { subsidiaries } from '../../data/subsidiaries';
import { sectors } from '../../data/sectors';
import SubsidiaryCard from '../../components/SubsidiaryCard/SubsidiaryCard';
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import './Subsidiaries.css';

export default function Subsidiaries() {
  const pageRef = useScrollReveal();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [sectorFilter, setSectorFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return subsidiaries.filter(co => {
      const matchSector = sectorFilter === 'All' || co.sector === sectorFilter;
      const matchSearch = search === '' ||
        co.name.toLowerCase().includes(search.toLowerCase()) ||
        co.description.toLowerCase().includes(search.toLowerCase());
      return matchSector && matchSearch;
    });
  }, [sectorFilter, search]);

  return (
    <div ref={pageRef} className="subs-page">
      {/* Hero */}
      <section className="page-hero subs-hero" aria-label="Subsidiaries hero">
        <div className="container page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="breadcrumb-link">Home</a>
            <span> / </span>
            <span aria-current="page">Subsidiaries</span>
          </nav>
          <h1 className="page-hero-title reveal">26 Companies. Every Sector.</h1>
          <p className="page-hero-sub reveal" data-delay="1">
            A portfolio built for scale across 12 industries and 3 continents.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section subs-main" aria-labelledby="subs-main-heading">
        <div className="container">
          <h2 id="subs-main-heading" className="sr-only">All Subsidiaries</h2>

          {/* Filter bar */}
          <div className="subs-filters reveal">
            <div className="subs-search-wrap">
              <svg className="subs-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                id="subs-search-input"
                type="search"
                className="subs-search"
                placeholder="Search companies…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search subsidiaries"
              />
            </div>
            <div className="subs-sector-filter-wrap">
              <label htmlFor="subs-sector-select" className="sr-only">Filter by sector</label>
              <select
                id="subs-sector-select"
                className="subs-sector-select"
                value={sectorFilter}
                onChange={e => setSectorFilter(e.target.value)}
                aria-label="Filter by sector"
              >
                <option value="All">All Sectors</option>
                {sectors.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <p className="subs-count font-mono">
              {filtered.length} / {subsidiaries.length} companies
            </p>
          </div>

          {/* Cards grid */}
          {filtered.length > 0 ? (
            <div className="subs-grid" role="list" aria-label="Subsidiary companies">
              {filtered.map((company, i) => (
                <div key={company.id} role="listitem">
                  <SubsidiaryCard
                    company={company}
                    delay={(i % 3) + 1}
                    onClick={setSelectedCompany}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="subs-empty">
              <p>No companies match your filters.</p>
              <button className="btn btn-primary" onClick={() => { setSectorFilter('All'); setSearch(''); }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Side Drawer */}
      <SideDrawer company={selectedCompany} onClose={() => setSelectedCompany(null)} />
    </div>
  );
}
