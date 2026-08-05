import { Link } from 'react-router-dom';
import { useSmoothTilt } from '../../hooks/useSmoothTilt';
import './SectorCard.css';

// Import our premium backgrounds to use as the visual card covers
import heroBg1 from '../../assets/hero_bg.png';
import heroBg2 from '../../assets/hero_bg_2.png';
import heroBg3 from '../../assets/hero_bg_3.png';
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

const bgImages = [heroBg1, heroBg2, heroBg3];

export default function SectorCard({ sector, delay = 0, index = 0 }) {
  const { ref, style, glareStyle, onMouseMove, onMouseEnter, onMouseLeave } = useSmoothTilt({
    maxTilt: 4.5,
    scale: 1.015,
  });

  let bgImg = bgImages[index % 3];
  if (sector.name === 'EV Charging & Battery') bgImg = evSectorImg;
  else if (sector.name === 'Semiconductors') bgImg = semiSectorImg;
  else if (sector.name === 'Car Manufacturing') bgImg = carSectorImg;
  else if (sector.name === 'Retail & Consumer') bgImg = retailSectorImg;
  else if (sector.name === 'Education') bgImg = educationSectorImg;
  else if (sector.name === 'Technology & IT') bgImg = techSectorImg;
  else if (sector.name === 'Finance & Investment') bgImg = financeSectorImg;
  else if (sector.name === 'Healthcare & Pharma') bgImg = healthcareSectorImg;
  else if (sector.name === 'Logistics & Supply Chain') bgImg = logisticsSectorImg;
  else if (sector.name === 'Agriculture & Food') bgImg = agricultureSectorImg;
  else if (sector.name === 'Industrial & Engineering') bgImg = industrialSectorImg;
  else if (sector.name === 'Media & Entertainment') bgImg = mediaSectorImg;

  const previewCompanies = sector.companies ? sector.companies.slice(0, 3).join(', ') : '';
  const slug = sector.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <Link
      ref={ref}
      to={`/sectors/${slug}`}
      className="mobbin-sector-card reveal"
      data-delay={delay}
      style={style}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`${sector.name} sector`}
    >
      {/* Dynamic Specular Glare */}
      <div className="card-glare-sheen" style={glareStyle} aria-hidden="true" />

      <div className="mobbin-sector-visual">
        <div className="mobbin-sector-img" style={{ backgroundImage: `url(${bgImg})` }} />
      </div>

      <div className="mobbin-sector-meta">
        <h3 className="mobbin-sector-title">{sector.name}.</h3>
        <p className="mobbin-sector-subtitle">
          Leading the group with {sector.companies ? sector.companies.length : 2} subsidiaries.
          Key innovators include {previewCompanies}.
          Total operational working capital of {sector.wc}.
        </p>
      </div>
    </Link>
  );
}
