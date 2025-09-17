import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import * as Location from 'expo-location';

export default function HomeScreen({ navigation }) {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleSOS = () => {
    if (!location) {
      Alert.alert('Location Required', 'Please enable location services for emergency features');
      return;
    }
    navigation.navigate('SOS');
  };

  const texts = {
    en: {
      welcome: 'Welcome',
      quickActions: 'Quick Actions',
      bookAppointment: 'Book Appointment',
      viewAppointments: 'View Appointments',
      chatbot: 'Health Assistant',
      emergency: 'Emergency SOS',
      emergencyDesc: 'Get immediate help',
    },
    pa: {
      welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ',
      quickActions: 'ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ',
      bookAppointment: 'ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ',
      viewAppointments: 'ਮੁਲਾਕਾਤਾਂ ਦੇਖੋ',
      chatbot: 'ਸਿਹਤ ਸਹਾਇਕ',
      emergency: 'ਸੰਕਟਕਾਲੀ SOS',
      emergencyDesc: 'ਤੁਰੰਤ ਮਦਦ ਲਓ',
    },
  };

  const t = texts[language];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            {t.welcome}, {userProfile?.name || 'User'}!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.quickActions}</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, styles.primaryCard]}
              onPress={() => navigation.navigate('BookAppointment')}
            >
              <Text style={styles.actionTitle}>{t.bookAppointment}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Appointments')}
            >
              <Text style={styles.actionTitle}>{t.viewAppointments}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Chatbot')}
            >
              <Text style={styles.actionTitle}>{t.chatbot}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.emergencyCard]}
              onPress={handleSOS}
            >
              <Text style={[styles.actionTitle, styles.emergencyText]}>
                {t.emergency}
              </Text>
              <Text style={[styles.actionDesc, styles.emergencyText]}>
                {t.emergencyDesc}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: '#0ea5e9',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1e293b',
  },
  actionGrid: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: '#0ea5e9',
  },
  emergencyCard: {
    backgroundColor: '#ef4444',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionDesc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  emergencyText: {
    color: 'white',
  },
});
