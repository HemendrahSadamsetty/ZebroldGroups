import { useState, useEffect } from 'react';
import './AnnouncementBanner.css';

const STORAGE_KEY = 'zebrold_announcement_dismissed';

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Check if dismissed
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    // Load from localStorage (admin editable) or defaults
    const stored = localStorage.getItem('zebrold_announcement');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.visible) {
        setContent(parsed);
        setVisible(true);
      }
    } else {
      setContent({
        text: 'Zebrold Group FY 2025–26 Annual Report now available — EUR 2.1B Revenue · 14% YoY Growth',
        color: 'blue',
        visible: true,
      });
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  if (!visible || !content) return null;

  return (
    <div className={`announcement announcement--${content.color}`} role="alert">
      <div className="announcement-inner container">
        <p className="announcement-text">{content.text}</p>
        <button
          className="announcement-close"
          onClick={dismiss}
          aria-label="Dismiss announcement"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
