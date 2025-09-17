import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('sehat-nabha-language') || 'en'
  );

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'pa' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('sehat-nabha-language', newLanguage);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('sehat-nabha-language', lang);
  };

  const value = {
    language,
    toggleLanguage,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};