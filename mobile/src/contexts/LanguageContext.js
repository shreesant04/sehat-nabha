import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  React.useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('sehat-nabha-language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'pa' : 'en';
    setLanguage(newLanguage);
    try {
      await AsyncStorage.setItem('sehat-nabha-language', newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    try {
      await AsyncStorage.setItem('sehat-nabha-language', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
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