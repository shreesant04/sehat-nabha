import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';
import { AlertTriangle, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

const Emergency = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [sosActive, setSosActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [emergencyResponse, setEmergencyResponse] = useState(null);

  const handleSOS = async () => {
    if (sosActive) return;

    setSosActive(true);
    
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          try {
            const response = await axios.post('/sos/emergency', {
              latitude,
              longitude,
              emergencyType: 'general'
            });
            setEmergencyResponse(response.data.response);
          } catch (error) {
            console.error('SOS error:', error);
          }
        },
        (error) => {
          console.error('Location error:', error);
          // Continue with SOS without location
          handleSOSWithoutLocation();
        }
      );
    } else {
      handleSOSWithoutLocation();
    }
  };

  const handleSOSWithoutLocation = async () => {
    try {
      const response = await axios.post('/sos/emergency', {
        latitude: 30.2672, // Default to Nabha coordinates
        longitude: 76.1947,
        emergencyType: 'general'
      });
      setEmergencyResponse(response.data.response);
    } catch (error) {
      console.error('SOS error:', error);
    }
  };

  const emergencyContacts = [
    { name: language === 'pa' ? 'ਪੁਲਿਸ' : 'Police', number: '100' },
    { name: language === 'pa' ? 'ਫਾਇਰ ਬ੍ਰਿਗੇਡ' : 'Fire Brigade', number: '101' },
    { name: language === 'pa' ? 'ਐਂਬੂਲੈਂਸ' : 'Ambulance', number: '108' },
    { name: language === 'pa' ? 'ਸਿਵਲ ਹਸਪਤਾਲ ਨਭਾ' : 'Civil Hospital Nabha', number: '+91-1765-222222' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">{t('emergency')}</h1>
        <p className="text-gray-600">
          {language === 'pa' 
            ? 'ਐਮਰਜੈਂਸੀ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਤੁਰੰਤ ਮਦਦ ਲਓ'
            : 'Get immediate help in case of emergency'
          }
        </p>
      </div>

      {/* SOS Button */}
      <div className="bg-white rounded-lg card-shadow p-6 text-center">
        <button
          onClick={handleSOS}
          disabled={sosActive}
          className={`w-32 h-32 mx-auto rounded-full text-white font-bold text-lg transition-all duration-200 ${
            sosActive 
              ? 'bg-green-600 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 active:scale-95'
          }`}
        >
          {sosActive ? (
            <div className="flex flex-col items-center">
              <div className="spinner border-white"></div>
              <span className="text-sm mt-2">
                {language === 'pa' ? 'ਸਕਿਰਿਆ' : 'ACTIVE'}
              </span>
            </div>
          ) : (
            <div>
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              SOS
            </div>
          )}
        </button>
        
        <p className="mt-4 text-gray-600">
          {sosActive 
            ? (language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਸਿਗਨਲ ਭੇਜਿਆ ਗਿਆ ਹੈ' : 'Emergency signal sent')
            : (language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਲਈ ਦਬਾਓ' : 'Press for emergency')
          }
        </p>
      </div>

      {/* Emergency Response */}
      {emergencyResponse && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            {t('emergencyActivated')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-green-800">
                {language === 'pa' ? 'ਜਵਾਬ ਦਾ ਸਮਾਂ:' : 'Estimated Response Time:'} {emergencyResponse.estimatedResponseTime}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-green-900">
                {language === 'pa' ? 'ਨੇੜਲਾ ਹਸਪਤਾਲ:' : 'Nearest Hospital:'}
              </h4>
              <p className="text-green-800">{emergencyResponse.nearestHospital.name}</p>
              <p className="text-green-700 text-sm">
                {language === 'pa' ? 'ਫੋਨ:' : 'Phone:'} {emergencyResponse.nearestHospital.phone}
              </p>
              <p className="text-green-700 text-sm">
                {language === 'pa' ? 'ਦੂਰੀ:' : 'Distance:'} {emergencyResponse.nearestHospital.distance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg card-shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ' : 'Emergency Contacts'}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">{contact.name}</span>
              </div>
              <a
                href={`tel:${contact.number}`}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700"
              >
                {contact.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          {language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਦੇ ਨਿਰਦੇਸ਼:' : 'Emergency Instructions:'}
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>• {language === 'pa' ? 'ਸ਼ਾਂਤ ਰਹੋ ਅਤੇ ਘਬਰਾਓ ਨਹੀਂ' : 'Stay calm and do not panic'}</li>
          <li>• {language === 'pa' ? 'SOS ਬਟਨ ਦਬਾਓ ਜਾਂ ਸਿੱਧਾ ਕਾਲ ਕਰੋ' : 'Press SOS button or call directly'}</li>
          <li>• {language === 'pa' ? 'ਆਪਣੀ ਸਥਿਤੀ ਅਤੇ ਸਮੱਸਿਆ ਸਪਸ਼ਟ ਕਰੋ' : 'Clearly explain your situation and problem'}</li>
          <li>• {language === 'pa' ? 'ਮਦਦ ਆਉਣ ਤੱਕ ਸੁਰੱਖਿਤ ਜਗ੍ਹਾ ਰਹੋ' : 'Stay in a safe place until help arrives'}</li>
        </ul>
      </div>
    </div>
  );
};

export default Emergency;