import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`lang-switcher ${className}`} role="region" aria-label="Language selector">
      <button
        type="button"
        className={`lang-btn ${lang === 'de' ? 'is-active' : ''}`}
        onClick={() => setLang('de')}
        aria-label="Auf Deutsch wechseln"
        aria-pressed={lang === 'de'}
      >
        DE
      </button>
      <span className="lang-divider">|</span>
      <button
        type="button"
        className={`lang-btn ${lang === 'en' ? 'is-active' : ''}`}
        onClick={() => setLang('en')}
        aria-label="Switch to English"
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
