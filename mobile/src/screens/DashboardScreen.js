import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  en: {
    welcome: 'Welcome',
    quickActions: 'Quick Actions',
    bookAppointment: 'Book Appointment',
    viewAppointments: 'View Appointments',
    emergency: 'Emergency SOS',
    profile: 'My Profile',
    recentActivity: 'Recent Activity',
    noActivity: 'No recent activity',
    logout: 'Logout',
  },
  pa: {
    welcome: 'ਸੁਆਗਤ ਹੈ',
    quickActions: 'ਤੁਰੰਤ ਕਿਰਿਆਵਾਂ',
    bookAppointment: 'ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ',
    viewAppointments: 'ਮੁਲਾਕਾਤਾਂ ਦੇਖੋ',
    emergency: 'ਐਮਰਜੈਂਸੀ SOS',
    profile: 'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ',
    recentActivity: 'ਹਾਲ ਦੀ ਗਤੀਵਿਧੀ',
    noActivity: 'ਕੋਈ ਹਾਲ ਦੀ ਗਤੀਵਿਧੀ ਨਹੀਂ',
    logout: 'ਲਾਗਆਉਟ',
  }
};

export default function DashboardScreen({ navigation }) {
  const { userProfile, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ]
    );
  };

  const quickActions = [
    {
      title: t.bookAppointment,
      onPress: () => navigation.navigate('Appointments'),
      color: '#10b981',
    },
    {
      title: t.viewAppointments,
      onPress: () => navigation.navigate('Appointments'),
      color: '#3b82f6',
    },
    {
      title: t.emergency,
      onPress: () => navigation.navigate('SOS'),
      color: '#ef4444',
    },
    {
      title: t.profile,
      onPress: () => navigation.navigate('Profile'),
      color: '#8b5cf6',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {t.welcome}, {userProfile?.name || 'User'}!
        </Text>
        <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
          <Text style={styles.languageText}>{language.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.quickActions}</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={action.onPress}
            >
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.recentActivity}</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>{t.noActivity}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#0ea5e9',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  languageButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  languageText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  activityText: {
    color: '#6b7280',
    fontSize: 16,
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
