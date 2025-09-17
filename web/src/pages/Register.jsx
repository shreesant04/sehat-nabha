import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';
import { Mail, Lock, User, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const userData = {
        name: data.name,
        phone: data.phone,
        aadhaar: data.aadhaar,
        role: data.role
      };
      
      await registerUser(data.email, data.password, userData);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  // Aadhaar validation (basic format check for hackathon)
  const validateAadhaar = (value) => {
    if (!value) return true; // Aadhaar is optional
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(value) || (language === 'pa' ? 'ਆਧਾਰ 12 ਅੰਕਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ' : 'Aadhaar must be 12 digits');
  };

  // Phone validation
  const validatePhone = (value) => {
    const phoneRegex = /^[+]?[1-9]\d{9,14}$/;
    return phoneRegex.test(value) || (language === 'pa' ? 'ਗਲਤ ਫੋਨ ਨੰਬਰ' : 'Invalid phone number');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg card-shadow max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('register')}
          </h1>
          <p className="text-gray-600">
            {language === 'pa' 
              ? 'ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ'
              : 'Create your new account'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('name')} *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('name', { 
                  required: language === 'pa' ? 'ਨਾਮ ਲਾਜ਼ਮੀ ਹੈ' : 'Name is required',
                  minLength: {
                    value: 2,
                    message: language === 'pa' ? 'ਨਾਮ ਘੱਟੋ ਘੱਟ 2 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ' : 'Name must be at least 2 characters'
                  }
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={language === 'pa' ? 'ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ' : 'Enter your full name'}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')} *
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

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('phone')} *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                {...register('phone', { 
                  required: language === 'pa' ? 'ਫੋਨ ਨੰਬਰ ਲਾਜ਼ਮੀ ਹੈ' : 'Phone number is required',
                  validate: validatePhone
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={language === 'pa' ? '+91XXXXXXXXXX' : '+91XXXXXXXXXX'}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Aadhaar (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('aadhaar')} ({language === 'pa' ? 'ਵਿਕਲਪਿਕ' : 'Optional'})
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('aadhaar', { validate: validateAadhaar })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={language === 'pa' ? 'XXXX XXXX XXXX' : 'XXXX XXXX XXXX'}
                maxLength="12"
              />
            </div>
            {errors.aadhaar && (
              <p className="mt-1 text-sm text-red-600">{errors.aadhaar.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('role')} *
            </label>
            <select
              {...register('role', { required: language === 'pa' ? 'ਭੂਮਿਕਾ ਚੁਣੋ' : 'Please select a role' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">
                {language === 'pa' ? 'ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ' : 'Select your role'}
              </option>
              <option value="patient">{t('patient')}</option>
              <option value="doctor">{t('doctor')}</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('password')} *
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
                placeholder={language === 'pa' ? 'ਪਾਸਵਰਡ ਬਣਾਓ' : 'Create a password'}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('confirmPassword')} *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', { 
                  required: language === 'pa' ? 'ਪਾਸਵਰਡ ਦੁਹਰਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ' : 'Please confirm your password',
                  validate: value => value === password || (language === 'pa' ? 'ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ' : 'Passwords do not match')
                })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={language === 'pa' ? 'ਪਾਸਵਰਡ ਦੁਹਰਾਓ' : 'Confirm your password'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2"></div>
                {language === 'pa' ? 'ਰਜਿਸਟਰ ਹੋ ਰਿਹਾ ਹੈ...' : 'Creating account...'}
              </div>
            ) : (
              t('register')
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              {language === 'pa' ? 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?' : 'Already have an account?'}{' '}
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {language === 'pa' ? 'ਲਾਗ ਇਨ ਕਰੋ' : 'Sign in'}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;