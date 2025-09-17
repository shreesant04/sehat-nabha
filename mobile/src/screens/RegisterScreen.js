import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  en: {
    title: 'Create Account',
    name: 'Full Name',
    phone: 'Phone Number',
    aadhaar: 'Aadhaar Number (Optional)',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    register: 'Create Account',
    login: 'Already have an account? Login',
    passwordMismatch: 'Passwords do not match',
    fillAllFields: 'Please fill in all required fields',
    registerError: 'Registration failed. Please try again.',
  },
  pa: {
    title: 'ਖਾਤਾ ਬਣਾਓ',
    name: 'ਪੂਰਾ ਨਾਮ',
    phone: 'ਫੋਨ ਨੰਬਰ',
    aadhaar: 'ਆਧਾਰ ਨੰਬਰ (ਵਿਕਲਪਿਕ)',
    email: 'ਈਮੇਲ',
    password: 'ਪਾਸਵਰਡ',
    confirmPassword: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    register: 'ਖਾਤਾ ਬਣਾਓ',
    login: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ? ਲਾਗਇਨ ਕਰੋ',
    passwordMismatch: 'ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ',
    fillAllFields: 'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਲੋੜੀਂਦੇ ਖੇਤਰ ਭਰੋ',
    registerError: 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
  }
};

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhaar: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const { register, loading } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, phone, email, password, confirmPassword, aadhaar } = formData;
    
    if (!name || !phone || !email || !password || !confirmPassword) {
      Alert.alert('Error', t.fillAllFields);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', t.passwordMismatch);
      return;
    }

    try {
      const userData = {
        name,
        phone,
        role: 'patient',
        ...(aadhaar && { aadhaar })
      };
      
      await register(email, password, userData);
    } catch (error) {
      Alert.alert('Registration Error', t.registerError);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t.name}
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder={t.phone}
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder={t.aadhaar}
            value={formData.aadhaar}
            onChangeText={(value) => updateFormData('aadhaar', value)}
            keyboardType="number-pad"
            maxLength={12}
          />
          
          <TextInput
            style={styles.input}
            placeholder={t.email}
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder={t.password}
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry
          />
          
          <TextInput
            style={styles.input}
            placeholder={t.confirmPassword}
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{t.register}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>{t.login}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    color: '#0ea5e9',
    fontSize: 16,
  },
});
