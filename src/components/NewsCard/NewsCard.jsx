import { Link } from 'react-router-dom';
import { useSmoothTilt } from '../../hooks/useSmoothTilt';
import './NewsCard.css';

// Importing premium assets to use as dynamic editorial photography
import heroBg1 from '../../assets/hero_bg.png';
import heroBg2 from '../../assets/hero_bg_2.png';
import heroBg3 from '../../assets/hero_bg_3.png';

const bgImages = [heroBg1, heroBg2, heroBg3];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NewsCard({ post, featured = false, delay = 0 }) {
  const { ref, style, glareStyle, onMouseMove, onMouseEnter, onMouseLeave } = useSmoothTilt({
    maxTilt: 4,
    scale: 1.015,
  });

  // Use post.id to deterministically assign an editorial image
  const imgUrl = bgImages[(post.id - 1) % bgImages.length];

  return (
    <article
      ref={ref}
      className={`news-editorial-card reveal ${featured ? 'news-card-featured' : ''}`}
      data-delay={delay}
      style={style}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Dynamic Specular Glare */}
      <div className="card-glare-sheen" style={glareStyle} aria-hidden="true" />

      {/* Slow Infinite Zoom Mask */}
      <div className="news-image-mask">
        <div className="news-image-inner" style={{ backgroundImage: `url(${imgUrl})` }} />
        <div className="news-image-gradient" />
      </div>

      <div className="news-content-layer">
        <div className="news-meta">
          <span className="pill news-tag">{post.sector}</span>
          <time className="news-date" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
        </div>
        <h3 className="news-title">{post.title}</h3>
        <p className="news-excerpt">{post.excerpt}</p>
        <Link to="/news" className="news-read-more">
          Read Full Story →
        </Link>
      </div>
    </article>
  );
}
