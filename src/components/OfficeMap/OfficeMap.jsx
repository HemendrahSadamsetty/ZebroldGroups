import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { offices } from '../../data/offices';
import './OfficeMap.css';

const REGIONS = ['All', 'Europe', 'India', 'Australia'];

export default function OfficeMap({ filterRegion = 'All' }) {
  const [tooltip, setTooltip] = useState(null);
  const [activeRegion, setActiveRegion] = useState(filterRegion);

  const filtered = activeRegion === 'All'
    ? offices
    : offices.filter(o => o.region === activeRegion);

  return (
    <div className="office-map-wrapper">
      {/* Region Filter */}
      <div className="office-map-filters" role="tablist" aria-label="Filter offices by region">
        {REGIONS.map(r => (
          <button
            key={r}
            role="tab"
            aria-selected={activeRegion === r}
            className={`office-map-filter ${activeRegion === r ? 'active' : ''}`}
            onClick={() => setActiveRegion(r)}
          >
            {r}
            {r !== 'All' && (
              <span className="office-map-filter-count">
                {offices.filter(o => o.region === r).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SVG Map */}
      <div className="office-map-container" aria-label="World map showing office locations">
        <svg
          viewBox="0 0 1000 500"
          className="office-map-svg"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-describedby="map-desc"
        >
          <title id="map-desc">World map showing Zebrold Group office locations</title>

          {/* Simplified world map paths */}
          {/* North America */}
          <path d="M 80 120 L 75 100 L 90 90 L 110 85 L 140 80 L 165 75 L 190 80 L 205 95 L 220 110 L 230 130 L 240 145 L 250 160 L 245 175 L 235 185 L 220 195 L 200 200 L 185 210 L 170 220 L 155 225 L 140 220 L 125 215 L 110 205 L 95 190 L 82 170 L 80 150 Z" className="map-land" />
          {/* Greenland */}
          <path d="M 220 65 L 230 55 L 250 50 L 270 55 L 280 65 L 275 78 L 260 82 L 240 78 Z" className="map-land" />
          {/* South America */}
          <path d="M 185 225 L 200 220 L 215 230 L 225 250 L 230 270 L 228 295 L 220 320 L 210 345 L 195 365 L 180 380 L 170 385 L 160 375 L 150 355 L 148 330 L 152 305 L 155 280 L 158 255 L 165 235 Z" className="map-land" />
          {/* Europe */}
          <path d="M 440 120 L 450 110 L 465 108 L 480 110 L 498 115 L 510 120 L 520 128 L 515 138 L 505 145 L 510 155 L 505 165 L 495 168 L 485 162 L 475 170 L 465 175 L 452 170 L 445 162 L 438 150 L 440 138 Z" className="map-land" />
          {/* UK */}
          <path d="M 440 148 L 448 143 L 455 148 L 453 158 L 445 162 L 438 156 Z" className="map-land" />
          {/* Africa */}
          <path d="M 455 185 L 470 178 L 490 178 L 510 182 L 525 195 L 535 215 L 540 240 L 538 265 L 530 290 L 518 315 L 503 335 L 488 350 L 473 355 L 460 345 L 448 325 L 440 300 L 438 272 L 442 248 L 448 225 L 450 205 Z" className="map-land" />
          {/* Middle East */}
          <path d="M 530 195 L 545 188 L 565 185 L 580 190 L 590 200 L 588 215 L 578 220 L 562 222 L 545 218 L 533 208 Z" className="map-land" />
          {/* Russia/Central Asia */}
          <path d="M 510 100 L 540 92 L 580 88 L 625 85 L 670 88 L 710 92 L 740 98 L 760 108 L 755 122 L 740 130 L 720 135 L 695 138 L 668 140 L 640 138 L 612 135 L 582 130 L 555 125 L 530 118 Z" className="map-land" />
          {/* South Asia / India */}
          <path d="M 598 200 L 615 195 L 635 196 L 650 205 L 658 220 L 655 238 L 645 255 L 632 268 L 618 272 L 607 265 L 598 248 L 595 228 Z" className="map-land" />
          {/* Southeast Asia */}
          <path d="M 680 210 L 698 205 L 715 210 L 720 225 L 712 238 L 698 242 L 683 235 L 678 220 Z" className="map-land" />
          {/* East Asia */}
          <path d="M 720 130 L 745 125 L 770 128 L 790 138 L 800 155 L 795 170 L 780 180 L 760 182 L 740 175 L 725 160 L 718 145 Z" className="map-land" />
          {/* Japan */}
          <path d="M 800 148 L 808 143 L 815 148 L 813 158 L 805 162 L 798 156 Z" className="map-land" />
          {/* Australia */}
          <path d="M 790 340 L 815 325 L 845 318 L 875 320 L 900 330 L 912 348 L 908 368 L 895 382 L 875 390 L 850 392 L 825 388 L 803 375 L 792 360 Z" className="map-land" />
          {/* New Zealand */}
          <path d="M 920 380 L 928 373 L 935 378 L 933 390 L 925 395 L 918 388 Z" className="map-land" />

          {/* Office dots */}
          {filtered.map(office => (
            <g
              key={office.id}
              className="office-dot-group"
              onMouseEnter={(e) => setTooltip({ office, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}
              role="button"
              tabIndex={0}
              aria-label={`${office.city}, ${office.country} — ${office.function}`}
            >
              {/* Pulse ring */}
              <circle
                cx={office.x}
                cy={office.y}
                r={office.function.includes('Headquarter') ? 8 : 5}
                className="office-dot-ring"
              />
              {/* Core dot */}
              <circle
                cx={office.x}
                cy={office.y}
                r={office.function.includes('Headquarter') ? 4 : 3}
                className={`office-dot-core ${office.function.includes('Headquarter') ? 'office-dot-core--hq' : ''}`}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              className="office-tooltip"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{
                position: 'fixed',
                left: tooltip.x + 16,
                top: tooltip.y - 20,
                pointerEvents: 'none',
              }}
            >
              <p className="office-tooltip-city">{tooltip.office.city}, {tooltip.office.country}</p>
              <p className="office-tooltip-fn">{tooltip.office.function}</p>
              <p className="office-tooltip-region">{tooltip.office.region}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Region summary */}
      <div className="office-map-summary">
        {['Europe', 'India', 'Australia'].map(r => (
          <button
            key={r}
            className={`office-region-tag ${activeRegion === r ? 'active' : ''}`}
            onClick={() => setActiveRegion(activeRegion === r ? 'All' : r)}
          >
            <span className="office-region-dot" />
            {r}
            <span className="office-region-count">{offices.filter(o => o.region === r).length}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
