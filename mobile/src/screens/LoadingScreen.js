import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  en: {
    loading: 'Loading...'
  },
  pa: {
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...'
  }
};

export default function LoadingScreen() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0ea5e9" />
      <Text style={styles.text}>{t.loading}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#374151',
  },
});
