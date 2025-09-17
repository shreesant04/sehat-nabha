// Same i18n utilities as web version
export const translations = {
  en: {
    // Navigation
    home: 'Home',
    appointments: 'Appointments',
    prescriptions: 'Prescriptions',
    reports: 'Reports',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    
    // Authentication
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    phone: 'Phone Number',
    
    // Emergency
    emergency: 'Emergency',
    sosButton: 'SOS - Emergency Help',
    
    // Chatbot
    chatbot: 'Health Assistant',
    
    // Messages
    welcomeMessage: 'Welcome to Sehat Nabha',
    platformDescription: 'Your trusted telemedicine platform',
  },
  
  pa: {
    // Navigation
    home: 'ਘਰ',
    appointments: 'ਮੁਲਾਕਾਤਾਂ',
    prescriptions: 'ਨੁਸਖੇ',
    reports: 'ਰਿਪੋਰਟਾਂ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    logout: 'ਲਾਗ ਆਉਟ',
    login: 'ਲਾਗ ਇਨ',
    register: 'ਰਜਿਸਟਰ',
    
    // Common
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    save: 'ਸੇਵ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
    
    // Authentication
    email: 'ਈਮੇਲ',
    password: 'ਪਾਸਵਰਡ',
    name: 'ਪੂਰਾ ਨਾਮ',
    phone: 'ਫੋਨ ਨੰਬਰ',
    
    // Emergency
    emergency: 'ਐਮਰਜੈਂਸੀ',
    sosButton: 'SOS - ਐਮਰਜੈਂਸੀ ਮਦਦ',
    
    // Chatbot
    chatbot: 'ਸਿਹਤ ਸਹਾਇਕ',
    
    // Messages
    welcomeMessage: 'ਸਹਿਤ ਨਭਾ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
    platformDescription: 'ਤੁਹਾਡਾ ਭਰੋਸੇਮੰਦ ਟੈਲੀਮੈਡੀਸਿਨ ਪਲੇਟਫਾਰਮ',
  }
};

export const useTranslation = (language = 'en') => {
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  return { t };
};