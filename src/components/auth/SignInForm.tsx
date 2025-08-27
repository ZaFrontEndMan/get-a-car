
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface SignInFormProps {
  formData: {
    email: string;
    password: string;
  };
  onFormDataChange: (data: { email: string; password: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const SignInForm = ({ formData, onFormDataChange, onSubmit, isLoading }: SignInFormProps) => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('emailAddress')}
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          placeholder={t('enterEmail')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('password')}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) => onFormDataChange({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder={t('enterPassword')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2 rtl:ml-2 rtl:mr-0" />
          <span className="text-sm text-gray-600">{t('rememberMe')}</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80">
          {t('forgotPassword')}
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Signing In...' : t('signIn')}
      </button>
    </form>
  );
};

export default SignInForm;
