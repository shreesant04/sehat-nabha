import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, loading } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg card-shadow max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('login')}
          </h1>
          <p className="text-gray-600">
            {language === 'pa' 
              ? 'ਆਪਣੇ ਖਾਤੇ ਵਿੱਚ ਲਾਗ ਇਨ ਕਰੋ'
              : 'Sign in to your account'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                {...register('email', { 
                  required: language === 'pa' ? 'ਈਮੇਲ ਲਾਜ਼ਮੀ ਹੈ' : 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: language === 'pa' ? 'ਗਲਤ ਈਮੇਲ ਫਾਰਮੈਟ' : 'Invalid email format'
                  }
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={language === 'pa' ? 'ਆਪਣਾ ਈਮੇਲ ਦਰਜ ਕਰੋ' : 'Enter your email'}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { 
                  required: language === 'pa' ? 'ਪਾਸਵਰਡ ਲਾਜ਼ਮੀ ਹੈ' : 'Password is required',
                  minLength: {
                    value: 6,
                    message: language === 'pa' ? 'ਪਾਸਵਰਡ ਘੱਟੋ ਘੱਟ 6 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ' : 'Password must be at least 6 characters'
                  }
                })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={language === 'pa' ? 'ਆਪਣਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ' : 'Enter your password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2"></div>
                {language === 'pa' ? 'ਲਾਗ ਇਨ ਹੋ ਰਿਹਾ ਹੈ...' : 'Signing in...'}
              </div>
            ) : (
              t('login')
            )}
          </button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              {language === 'pa' ? 'ਖਾਤਾ ਨਹੀਂ ਹੈ?' : "Don't have an account?"}{' '}
              <Link 
                to="/register" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {language === 'pa' ? 'ਰਜਿਸਟਰ ਕਰੋ' : 'Sign up'}
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {language === 'pa' ? 'ਡੈਮੋ ਖਾਤੇ:' : 'Demo Accounts:'}
          </h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              <strong>{language === 'pa' ? 'ਮਰੀਜ਼:' : 'Patient:'}</strong> patient@demo.com / password123
            </div>
            <div>
              <strong>{language === 'pa' ? 'ਡਾਕਟਰ:' : 'Doctor:'}</strong> doctor@demo.com / password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;