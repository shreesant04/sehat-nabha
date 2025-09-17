import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';

const VideoCall = () => {
  const { appointmentId } = useParams();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const jitsiRoomUrl = `https://meet.jit.si/appointment-${appointmentId}`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {language === 'pa' ? 'ਵੀਡੀਓ ਸਲਾਹ' : 'Video Consultation'}
      </h1>
      
      <div className="bg-white rounded-lg card-shadow overflow-hidden">
        <div className="video-container">
          <iframe
            src={jitsiRoomUrl}
            allow="camera; microphone; fullscreen; display-capture"
            title="Video Consultation"
          ></iframe>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          {language === 'pa' 
            ? 'ਜੇ ਵੀਡੀਓ ਲੋਡ ਨਹੀਂ ਹੋ ਰਿਹਾ, ਤਾਂ ਹੇਠ ਦਿੱਤੇ ਲਿੰਕ ਤੇ ਕਲਿੱਕ ਕਰੋ:'
            : 'If the video is not loading, click the link below:'
          }
        </p>
        <a
          href={jitsiRoomUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 inline-block"
        >
          {language === 'pa' ? 'ਵੀਡੀਓ ਕਾਲ ਜੁਆਇਨ ਕਰੋ' : 'Join Video Call'}
        </a>
      </div>
    </div>
  );
};

export default VideoCall;