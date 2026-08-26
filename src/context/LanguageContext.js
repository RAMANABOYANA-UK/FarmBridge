import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Map of supported languages to their speech locales used by both speech recognition and synthesis
const LOCALE_MAP = {
  en: 'en', hi: 'hi', ta: 'ta', te: 'te', kn: 'kn', ml: 'ml', bn: 'bn',
  mr: 'mr', gu: 'gu', pa: 'pa', or: 'or', as: 'as', ur: 'ur', ks: 'ks',
  sa: 'sa', sd: 'sd', mai: 'mai', kok: 'kok', doi: 'doi',
  mni: 'mni', sat: 'sat'
};

export const getLocale = (lang) => LOCALE_MAP[lang] || 'en';

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
    // Default to English on first load; only restore a saved language if it's not the initial visit
    const saved = localStorage.getItem('farmbridge_language');
    if (saved && translations[saved]) {
      setLanguage(saved);
    } else {
      setLanguage('en');
    }
  }, []);

  const value = useMemo(() => ({ language, t, setLanguage: changeLanguage, getLocale }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};