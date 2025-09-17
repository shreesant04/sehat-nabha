import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';

const Appointments = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('appointments')}</h1>
      <div className="bg-white p-8 rounded-lg card-shadow text-center">
        <p className="text-gray-600">
          {language === 'pa' ? 'ਮੁਲਾਕਾਤਾਂ ਦਾ ਪੰਨਾ ਬਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...' : 'Appointments page is being built...'}
        </p>
      </div>
    </div>
  );
};

export default Appointments;