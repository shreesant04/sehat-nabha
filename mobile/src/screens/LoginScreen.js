import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  en: {
    title: 'Sehat Nabha',
    subtitle: 'Your Health, Our Priority',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    register: 'Create Account',
    forgotPassword: 'Forgot Password?',
    language: 'Change Language',
    loginError: 'Login failed. Please check your credentials.',
  },
  pa: {
    title: 'ਸਿਹਤ ਨਭਾ',
    subtitle: 'ਤੁਹਾਡੀ ਸਿਹਤ, ਸਾਡੀ ਪਹਿਲੀ ਪਸੰਦ',
    email: 'ਈਮੇਲ',
    password: 'ਪਾਸਵਰਡ',
    login: 'ਲਾਗਇਨ',
    register: 'ਖਾਤਾ ਬਣਾਓ',
    forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    language: 'ਭਾਸ਼ਾ ਬਦਲੋ',
    loginError: 'ਲਾਗਇਨ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਵੇਰਵੇ ਦੀ ਜਾਂਚ ਕਰੋ।',
  }
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Error', t.loginError);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t.email}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder={t.password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{t.login}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>{t.register}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={toggleLanguage}
        >
          <Text style={styles.linkText}>{t.language}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
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
    marginBottom: 10,
  },
  linkText: {
    color: '#0ea5e9',
    fontSize: 16,
  },
  languageButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
});
