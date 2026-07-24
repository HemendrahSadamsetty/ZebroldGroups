import { useState, useCallback } from 'react';
import Toast from '../../components/Toast/Toast';
import { subsidiaries } from '../../data/subsidiaries';
import './Admin.css';

const SIDEBAR_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',           icon: '⊞' },
  { id: 'announcement', label: 'Announcements',      icon: '📢' },
  { id: 'hero',        label: 'Hero Banner',          icon: '🖼' },
  { id: 'spotlight',   label: 'Subsidiary Spotlight', icon: '⭐' },
  { id: 'news',        label: 'News Posts',           icon: '📰' },
  { id: 'settings',   label: 'Settings',              icon: '⚙' },
];

function loadFromStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

/* ── Dashboard ── */
function Dashboard() {
  return (
    <div className="admin-dashboard">
      <h2 className="admin-section-title">Admin Dashboard</h2>
      <p className="admin-section-sub">Manage site content. All changes save to localStorage and reflect in the preview.</p>
      <div className="admin-dash-cards">
        {[
          { label: 'Total Subsidiaries', value: '26', color: 'blue' },
          { label: 'News Posts', value: '6', color: 'gold' },
          { label: 'Active Sectors', value: '12', color: 'blue' },
          { label: 'Global Offices', value: '26', color: 'gold' },
        ].map(c => (
          <div key={c.label} className={`admin-dash-card admin-dash-card--${c.color}`}>
            <span className="admin-dash-card-val">{c.value}</span>
            <span className="admin-dash-card-label">{c.label}</span>
          </div>
        ))}
      </div>
      <div className="admin-dash-notice">
        <span>ℹ</span>
        <p>This is a frontend-only admin demo. All data is stored in your browser's localStorage. Select a module from the sidebar to edit site content.</p>
      </div>
    </div>
  );
}

/* ── Announcement Module ── */
function AnnouncementModule({ onSave }) {
  const [form, setForm] = useState(() => loadFromStorage('zebrold_announcement', {
    text: 'Zebrold Group FY 2025–26 Annual Report now available — EUR 2.1B Revenue · 14% YoY Growth',
    color: 'blue',
    visible: true,
  }));

  const save = () => {
    localStorage.setItem('zebrold_announcement', JSON.stringify(form));
    onSave('Announcement saved successfully.');
  };

  return (
    <div className="admin-module">
      <h2 className="admin-section-title">Announcement Banner</h2>
      <p className="admin-section-sub">Edit the sitewide announcement shown at the top of all pages.</p>

      <div className="admin-form">
        <div className="form-group">
          <label htmlFor="ann-text" className="form-label">Banner Text</label>
          <textarea
            id="ann-text"
            className="form-textarea"
            rows={3}
            maxLength={300}
            value={form.text}
            onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
          />
          <span className="form-hint">{form.text.length}/300 characters</span>
        </div>

        <div className="form-group">
          <label className="form-label">Banner Colour</label>
          <div className="color-options" role="radiogroup" aria-label="Banner colour">
            {['blue', 'black', 'gold'].map(c => (
              <label key={c} className={`color-option color-option--${c} ${form.color === c ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="ann-color"
                  value={c}
                  checked={form.color === c}
                  onChange={() => setForm(p => ({ ...p, color: c }))}
                  className="sr-only"
                />
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Visibility</label>
          <div className="toggle-wrap">
            <button
              role="switch"
              aria-checked={form.visible}
              className={`toggle ${form.visible ? 'toggle--on' : ''}`}
              onClick={() => setForm(p => ({ ...p, visible: !p.visible }))}
              id="ann-visibility-toggle"
            >
              <span className="toggle-thumb" />
            </button>
            <span className="toggle-label">{form.visible ? 'Published' : 'Draft'}</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={save} id="ann-save-btn">Save Changes</button>
      </div>
    </div>
  );
}

/* ── Hero Banner Module ── */
function HeroBannerModule({ onSave }) {
  const [form, setForm] = useState(() => loadFromStorage('zebrold_hero', {
    headline: 'Building Industries.\nDefining Futures.',
    subline: 'EUR 2.1 Billion · 26 Companies · 12 Sectors · Frankfurt, Germany',
    ctaLabel: 'Explore the Group →',
    ctaUrl: '/about',
    imagePreview: null,
  }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, imagePreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const save = () => {
    localStorage.setItem('zebrold_hero', JSON.stringify(form));
    onSave('Hero banner saved successfully.');
  };

  return (
    <div className="admin-module">
      <h2 className="admin-section-title">Hero Banner</h2>
      <p className="admin-section-sub">Edit the homepage hero headline, subline, and background image.</p>

      <div className="admin-form">
        <div className="form-group">
          <label htmlFor="hero-headline" className="form-label">Headline</label>
          <textarea
            id="hero-headline"
            className="form-textarea"
            rows={3}
            value={form.headline}
            onChange={e => setForm(p => ({ ...p, headline: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="hero-subline" className="form-label">Subline</label>
          <input
            id="hero-subline"
            type="text"
            className="form-input"
            value={form.subline}
            onChange={e => setForm(p => ({ ...p, subline: e.target.value }))}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hero-cta-label" className="form-label">CTA Button Label</label>
            <input
              id="hero-cta-label"
              type="text"
              className="form-input"
              value={form.ctaLabel}
              onChange={e => setForm(p => ({ ...p, ctaLabel: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hero-cta-url" className="form-label">CTA Button URL</label>
            <input
              id="hero-cta-url"
              type="text"
              className="form-input"
              value={form.ctaUrl}
              onChange={e => setForm(p => ({ ...p, ctaUrl: e.target.value }))}
            />
          </div>
        </div>

        {/* Image upload */}
        <div className="form-group">
          <label className="form-label">Background Image</label>
          <div
            className="image-upload-zone"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('hero-image-input').click()}
            role="button"
            tabIndex={0}
            aria-label="Upload hero background image"
            onKeyDown={e => e.key === 'Enter' && document.getElementById('hero-image-input').click()}
          >
            {form.imagePreview ? (
              <img src={form.imagePreview} alt="Hero preview" className="image-upload-preview" />
            ) : (
              <>
                <div className="image-upload-icon" aria-hidden="true">⬆</div>
                <p>Drag & drop or click to upload</p>
                <p className="image-upload-hint">JPG, PNG, WebP — max 5MB</p>
              </>
            )}
          </div>
          <input
            id="hero-image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleImageUpload}
            aria-label="Select hero background image file"
          />
          {form.imagePreview && (
            <button
              className="btn-ghost"
              style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}
              onClick={() => setForm(p => ({ ...p, imagePreview: null }))}
            >
              Remove image
            </button>
          )}
        </div>

        <button className="btn btn-primary" onClick={save} id="hero-save-btn">Save Changes</button>
      </div>
    </div>
  );
}

/* ── Subsidiary Spotlight ── */
function SpotlightModule({ onSave }) {
  const [slots, setSlots] = useState(() =>
    loadFromStorage('zebrold_spotlight', [
      subsidiaries[0].name,
      subsidiaries[4].name,
      subsidiaries[11].name,
      subsidiaries[13].name,
    ])
  );

  const save = () => {
    localStorage.setItem('zebrold_spotlight', JSON.stringify(slots));
    onSave('Subsidiary spotlight saved.');
  };

  return (
    <div className="admin-module">
      <h2 className="admin-section-title">Subsidiary Spotlight</h2>
      <p className="admin-section-sub">Choose which 4 subsidiaries appear in the homepage carousel.</p>

      <div className="admin-form">
        {slots.map((slot, i) => (
          <div key={i} className="form-group">
            <label htmlFor={`slot-${i}`} className="form-label">Slot {i + 1}</label>
            <select
              id={`slot-${i}`}
              className="form-select"
              value={slot}
              onChange={e => {
                const next = [...slots];
                next[i] = e.target.value;
                setSlots(next);
              }}
            >
              {subsidiaries.map(co => (
                <option key={co.id} value={co.name}>{co.name}</option>
              ))}
            </select>
          </div>
        ))}
        <button className="btn btn-primary" onClick={save} id="spotlight-save-btn">Save Layout</button>
      </div>
    </div>
  );
}

/* ── Settings ── */
function SettingsModule({ onSave }) {
  const [form, setForm] = useState(() => loadFromStorage('zebrold_settings', {
    tagline: 'Building Industries. Defining Futures.',
    phone: '+49 69 2100 4800',
    email: 'investor@zebroldgroup.com',
    linkedin: 'https://linkedin.com/company/zebrold',
  }));

  const save = () => {
    localStorage.setItem('zebrold_settings', JSON.stringify(form));
    onSave('Settings saved.');
  };

  return (
    <div className="admin-module">
      <h2 className="admin-section-title">Site Settings</h2>
      <p className="admin-section-sub">Global site configuration — tagline, contact details, and social links.</p>

      <div className="admin-form">
        {[
          { id: 'settings-tagline', key: 'tagline', label: 'Site Tagline', type: 'text' },
          { id: 'settings-phone', key: 'phone', label: 'HQ Phone Number', type: 'tel' },
          { id: 'settings-email', key: 'email', label: 'HQ Email Address', type: 'email' },
          { id: 'settings-linkedin', key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
        ].map(field => (
          <div key={field.key} className="form-group">
            <label htmlFor={field.id} className="form-label">{field.label}</label>
            <input
              id={field.id}
              type={field.type}
              className="form-input"
              value={form[field.key]}
              onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
            />
          </div>
        ))}
        <button className="btn btn-primary" onClick={save} id="settings-save-btn">Save Settings</button>
      </div>
    </div>
  );
}

/* ── Admin (main) ── */
export default function Admin() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast({ message: msg, type: 'success' });
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'announcement': return <AnnouncementModule onSave={showToast} />;
      case 'hero': return <HeroBannerModule onSave={showToast} />;
      case 'spotlight': return <SpotlightModule onSave={showToast} />;
      case 'settings': return <SettingsModule onSave={showToast} />;
      case 'news': return (
        <div className="admin-module">
          <h2 className="admin-section-title">News Posts</h2>
          <p className="admin-section-sub">News post management — coming in the next iteration. Currently 6 posts are in the data layer.</p>
        </div>
      );
      default: return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="admin-logo-word">ZEBROLD</span>
            <span className="admin-logo-sub">ADMIN</span>
          </div>
        </div>
        <nav>
          <ul className="admin-nav" role="list">
            {SIDEBAR_ITEMS.map(item => (
              <li key={item.id}>
                <button
                  className={`admin-nav-item ${activeModule === item.id ? 'admin-nav-item--active' : ''}`}
                  onClick={() => setActiveModule(item.id)}
                  aria-current={activeModule === item.id ? 'page' : undefined}
                  id={`admin-nav-${item.id}`}
                >
                  <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" className="admin-view-site">← View Site</a>
          <p className="admin-sidebar-note">Frontend demo — no auth required</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main" id="admin-main-content">
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">
            {SIDEBAR_ITEMS.find(i => i.id === activeModule)?.label || 'Dashboard'}
          </h1>
          <div className="admin-topbar-right">
            <span className="admin-topbar-user">Administrator</span>
          </div>
        </div>

        <div className="admin-content">
          {renderModule()}
        </div>
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
