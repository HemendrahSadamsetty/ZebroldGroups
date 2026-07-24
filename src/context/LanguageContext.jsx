import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Default language is 'de' (German)
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('zebrold_lang');
    return saved === 'en' ? 'en' : 'de';
  });

  useEffect(() => {
    localStorage.setItem('zebrold_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang) => {
    if (newLang === 'en' || newLang === 'de') {
      setLangState(newLang);
    }
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'de' ? 'en' : 'de'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['de']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
