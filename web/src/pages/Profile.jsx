import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';

const Profile = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('profile')}</h1>
      <div className="bg-white p-8 rounded-lg card-shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('name')}
            </label>
            <p className="mt-1 text-lg text-gray-900">{userProfile?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('role')}
            </label>
            <p className="mt-1 text-lg text-gray-900">{userProfile?.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('phone')}
            </label>
            <p className="mt-1 text-lg text-gray-900">{userProfile?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;