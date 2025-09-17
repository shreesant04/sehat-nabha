import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';
import { 
  Heart, 
  Users, 
  Calendar, 
  Phone, 
  MessageCircle,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react';

const Home = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const features = [
    {
      icon: Calendar,
      title: language === 'pa' ? 'ਆਸਾਨ ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ' : 'Easy Appointment Booking',
      description: language === 'pa' 
        ? 'ਆਪਣੇ ਫੋਨ ਜਾਂ ਆਧਾਰ ਨੰਬਰ ਨਾਲ ਰਜਿਸਟਰ ਕਰੋ ਅਤੇ ਡਾਕਟਰਾਂ ਨਾਲ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ'
        : 'Register with phone or Aadhaar and book appointments with qualified doctors'
    },
    {
      icon: Phone,
      title: language === 'pa' ? 'ਵੀਡੀਓ ਸਲਾਹ' : 'Video Consultations',
      description: language === 'pa'
        ? 'ਘਰ ਬੈਠੇ ਡਾਕਟਰਾਂ ਨਾਲ ਵੀਡੀਓ ਕਾਲ ਰਾਹੀਂ ਸਲਾਹ ਲਓ'
        : 'Consult with doctors via video calls from the comfort of your home'
    },
    {
      icon: MessageCircle,
      title: language === 'pa' ? 'AI ਸਿਹਤ ਸਹਾਇਕ' : 'AI Health Assistant',
      description: language === 'pa'
        ? 'ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਲਈ ਚੈਟਬੋਟ'
        : 'Chatbot for symptom checking in Punjabi and English'
    },
    {
      icon: Shield,
      title: language === 'pa' ? 'ਐਮਰਜੈਂਸੀ SOS' : 'Emergency SOS',
      description: language === 'pa'
        ? 'ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਤੁਰੰਤ ਨੇੜਲੇ ਹਸਪਤਾਲ ਨਾਲ ਸੰਪਰਕ'
        : 'Instant connection to nearest hospital or ambulance service'
    },
    {
      icon: Smartphone,
      title: language === 'pa' ? 'SMS ਬੁਕਿੰਗ' : 'SMS Booking',
      description: language === 'pa'
        ? 'ਇੰਟਰਨੈਟ ਤੋਂ ਬਿਨਾਂ ਵੀ SMS ਰਾਹੀਂ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ'
        : 'Book appointments via SMS even without internet access'
    },
    {
      icon: Globe,
      title: language === 'pa' ? 'ਦੋ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ' : 'Bilingual Support',
      description: language === 'pa'
        ? 'ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੂਰਾ ਇੰਟਰਫੇਸ'
        : 'Complete interface available in Punjabi and English'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="flex justify-center">
          <Heart className="h-20 w-20 text-primary-600" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            {t('welcomeMessage')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('platformDescription')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 btn-hover"
          >
            {language === 'pa' ? 'ਸ਼ੁਰੂ ਕਰੋ' : 'Get Started'}
          </Link>
          <Link
            to="/login"
            className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 btn-hover"
          >
            {t('login')}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'pa' ? 'ਸੇਵਾਵਾਂ' : 'Our Services'}
          </h2>
          <p className="text-gray-600">
            {language === 'pa' 
              ? 'ਪੇਂਡੂ ਖੇਤਰਾਂ ਲਈ ਆਧੁਨਿਕ ਸਿਹਤ ਸੇਵਾਵਾਂ'
              : 'Modern healthcare services designed for rural areas'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg card-shadow card-shadow-hover">
              <div className="flex items-center space-x-3 mb-4">
                <feature.icon className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SMS Booking Instructions */}
      <section className="bg-blue-50 rounded-lg p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'pa' ? 'SMS ਰਾਹੀਂ ਬੁਕਿੰਗ' : 'SMS Booking'}
          </h2>
          <p className="text-gray-700">
            {language === 'pa' 
              ? 'ਇੰਟਰਨੈਟ ਨਹੀਂ ਹੈ? ਕੋਈ ਸਮੱਸਿਆ ਨਹੀਂ! SMS ਭੇਜੋ:'
              : "No internet? No problem! Send an SMS:"
            }
          </p>
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-blue-300 max-w-md mx-auto">
            <p className="font-mono text-sm text-gray-800">
              BOOK DD/MM/YYYY HH:MM {language === 'pa' ? 'ਕਾਰਨ' : 'REASON'}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {language === 'pa' 
                ? 'ਉਦਾਹਰਨ: BOOK 25/12/2023 10:30 ਬੁਖਾਰ ਅਤੇ ਖੰਘ'
                : 'Example: BOOK 25/12/2023 10:30 Fever and cough'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white rounded-lg p-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-primary-100">
              {language === 'pa' ? 'ਮਰੀਜ਼' : 'Patients'}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">50+</div>
            <div className="text-primary-100">
              {language === 'pa' ? 'ਡਾਕਟਰ' : 'Doctors'}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">1000+</div>
            <div className="text-primary-100">
              {language === 'pa' ? 'ਸਲਾਹਾਂ' : 'Consultations'}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-primary-100">
              {language === 'pa' ? 'ਸਹਾਇਤਾ' : 'Support'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;