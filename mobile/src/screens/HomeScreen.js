import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';

export default function HomeScreen({ navigation }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="heart" size={48} color="#0ea5e9" />
        <Text style={styles.title}>{t('welcomeMessage')}</Text>
        <Text style={styles.subtitle}>{t('platformDescription')}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryButtonText}>{t('register')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>{t('login')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>
          {language === 'pa' ? 'ਸੇਵਾਵਾਂ' : 'Our Services'}
        </Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="calendar" size={24} color="#0ea5e9" />
          <Text style={styles.featureText}>
            {language === 'pa' ? 'ਆਸਾਨ ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ' : 'Easy Appointment Booking'}
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="videocam" size={24} color="#0ea5e9" />
          <Text style={styles.featureText}>
            {language === 'pa' ? 'ਵੀਡੀਓ ਸਲਾਹ' : 'Video Consultations'}
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="chatbubble" size={24} color="#0ea5e9" />
          <Text style={styles.featureText}>
            {language === 'pa' ? 'AI ਸਿਹਤ ਸਹਾਇਕ' : 'AI Health Assistant'}
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="warning" size={24} color="#ef4444" />
          <Text style={styles.featureText}>
            {language === 'pa' ? 'ਐਮਰਜੈਂਸੀ SOS' : 'Emergency SOS'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0ea5e9',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#4b5563',
    marginLeft: 12,
  },
});