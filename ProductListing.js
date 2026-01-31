import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [t, setT] = useState(() => translations['en']);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('farmbridge_language') || 'en';
    setLanguage(savedLanguage);
    setT(translations[savedLanguage]);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setT(translations[lang]);
    localStorage.setItem('farmbridge_language', lang);
    
    // Update language preference in backend
    if (localStorage.getItem('token')) {
      // API call to update language preference
      // This would be implemented with your API service
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};