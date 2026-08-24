import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Map of supported languages to their speech locales used by both speech recognition and synthesis
const LOCALE_MAP = {
  en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
  kn: 'kn-IN', ml: 'ml-IN', bn: 'bn-IN', mr: 'mr-IN',
  gu: 'gu-IN', pa: 'pa-IN', or: 'or-IN'
};

export const getLocale = (lang) => LOCALE_MAP[lang] || 'en-IN';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // `t` lookup function with graceful fallback to English if a key is missing
  const t = useCallback((key, params) => {
    const langData = translations[language] || {};
    const enData = translations['en'] || {};
    let text = langData[key] ?? enData[key] ?? key;
    if (params) {
      Object.keys(params).forEach((param) => {
        text = String(text).replace(`{${param}}`, params[param]);
      });
    }
    return text;
  }, [language]);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('farmbridge_language', lang);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('farmbridge_language') || 'en';
    if (translations[saved]) setLanguage(saved);
  }, []);

  const value = useMemo(() => ({ language, t, setLanguage: changeLanguage, getLocale }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};