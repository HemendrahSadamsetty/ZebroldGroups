import { useScrollReveal } from '../../hooks/useScrollReveal';
import { news } from '../../data/news';
import NewsCard from '../../components/NewsCard/NewsCard';
import AnnouncementBanner from '../../components/AnnouncementBanner/AnnouncementBanner';
import SEO from '../../components/SEO/SEO';
import './News.css';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function News() {
  const pageRef = useScrollReveal();
  const featured = news.find(n => n.featured);
  const rest = news.filter(n => !n.featured);

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Newsroom — Zebrold International Holdings Limited (Zebrold IHL)",
    "description": "Official press releases and announcements from Zebrold International Holdings Limited (Zebrold IHL).",
    "url": "https://www.zebrold.de/news",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": news.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "NewsArticle",
          "headline": item.title,
          "description": item.summary,
          "datePublished": item.date,
          "publisher": {
            "@type": "Corporation",
            "name": "Zebrold International Holdings Limited",
            "alternateName": ["Zebrold IHL", "Zebrold Group"]
          }
        }
      }))
    }
  };

  return (
    <div ref={pageRef} className="news-page">
      <SEO 
        title="Newsroom & Press Releases | Zebrold International Holdings Limited (Zebrold IHL)"
        description="Official press releases, quarterly updates, and strategic milestones from Zebrold International Holdings Limited (Zebrold IHL) and portfolio subsidiaries."
        keywords="Zebrold news, Zebrold press release, Zebrold IHL announcements, Zebrold International Holdings Limited media updates"
        url="/news"
        schemaData={newsSchema}
      />
      {/* Hero */}
      <section className="page-hero news-hero" aria-label="News hero">
        <div className="container page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="breadcrumb-link">Home</a>
            <span> / </span>
            <span aria-current="page">News</span>
          </nav>
          <h1 className="page-hero-title reveal">Latest from the Group</h1>
          <p className="page-hero-sub reveal" data-delay="1">
            News, announcements, and milestones from Zebrold Group and its 26 subsidiaries.
          </p>
        </div>
      </section>

      <AnnouncementBanner />

      {/* Featured */}
      {featured && (
        <section className="section news-featured-section" aria-labelledby="featured-heading">
          <div className="container">
            <span className="section-label">Featured Announcement</span>
            <article className="news-featured reveal" id="news-featured-article">
              <div className="news-featured-meta">
                <span className="pill news-featured-tag">{featured.sector}</span>
                <time className="news-featured-date" dateTime={featured.date}>
                  {formatDate(featured.date)}
                </time>
              </div>
              <h2 id="featured-heading" className="news-featured-title">{featured.title}</h2>
              <p className="news-featured-body">{featured.excerpt}</p>
              <button className="btn btn-primary" id="news-featured-read-btn">Read full announcement →</button>
            </article>
          </div>
        </section>
      )}

      {/* News grid */}
      <section className="section news-grid-section" aria-labelledby="news-grid-heading">
        <div className="container">
          <h2 id="news-grid-heading" className="section-title reveal">All News</h2>
          <div className="divider" />
          <div className="news-page-grid">
            {rest.map((post, i) => (
              <NewsCard key={post.id} post={post} delay={(i % 3) + 1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
