import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';
import { MessageCircle, Send } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('/chatbot/check-symptoms', {
        symptoms: [symptoms],
        language
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Chatbot error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">{t('chatbot')}</h1>
        <p className="text-gray-600">
          {language === 'pa' 
            ? 'ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਪੁੱਛੋ ਅਤੇ ਸਲਾਹ ਲਓ'
            : 'Ask about your symptoms and get advice'
          }
        </p>
      </div>

      <div className="bg-white rounded-lg card-shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('enterSymptoms')}
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="4"
              placeholder={language === 'pa' 
                ? 'ਜਿਵੇਂ: ਬੁਖਾਰ, ਖੰਘ, ਸਿਰ ਦਰਦ...'
                : 'e.g., fever, cough, headache...'
              }
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !symptoms.trim()}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="spinner mr-2"></div>
            ) : (
              <Send className="h-5 w-5 mr-2" />
            )}
            {loading ? t('loading') : t('checkSymptoms')}
          </button>
        </form>

        {analysis && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'pa' ? 'ਜਾਂਚ ਦੇ ਨਤੀਜੇ:' : 'Analysis Results:'}
            </h3>
            
            <div className="space-y-4">
              {analysis.responses.map((response, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {language === 'pa' ? 'ਲੱਛਣ:' : 'Symptom:'} {response.symptom}
                  </h4>
                  <p className="text-gray-700 mb-2">{response.message}</p>
                  <p className="text-sm text-gray-600">{response.advice}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                {language === 'pa' ? 'سفارشات:' : 'Recommendations:'}
              </h4>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-blue-800 text-sm">• {rec}</li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>{language === 'pa' ? 'ਨੋਟ:' : 'Disclaimer:'}</strong> {analysis.disclaimer}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;