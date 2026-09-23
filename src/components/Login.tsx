import { useState } from 'react';
import { Language, translations } from '../i18n/translations';
import { Shield, Eye, EyeOff, Globe } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

const CREDENTIALS = [
  { username: 'admin', password: '123' },
  { username: 'employee1', password: '123' },
];

export default function Login({ onLogin, language, onToggleLanguage }: LoginProps) {
  const t = translations[language];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const valid = CREDENTIALS.some(
        (c) => c.username === username && c.password === password
      );
      if (valid) {
        localStorage.setItem('wolf_lsk_auth', JSON.stringify({ username, loggedInAt: Date.now() }));
        onLogin();
      } else {
        setError(t.loginError);
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-3xl"></div>
      </div>

      {/* Language Toggle */}
      <button
        onClick={onToggleLanguage}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-3 py-2 bg-gray-900/80 border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-amber-400 hover:border-amber-500/30 transition-all z-10"
      >
        <Globe size={14} />
        {language === 'en' ? 'العربية' : 'English'}
      </button>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/50 rounded-2xl shadow-2xl shadow-amber-500/5 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
              <Shield size={28} className="text-gray-900" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              WOLF <span className="text-amber-400">LSK</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">{t.loginSubtitle}</p>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-white">{t.welcomeBack}</h2>
            <p className="text-xs text-gray-500 mt-1">{t.loginSubtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {t.username}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                placeholder={language === 'en' ? 'Enter username' : 'أدخل اسم المستخدم'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {t.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all pr-10"
                  placeholder={language === 'en' ? 'Enter password' : 'أدخل كلمة المرور'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg text-gray-900 font-bold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {language === 'en' ? 'Signing in...' : 'جاري الدخول...'}
                </span>
              ) : (
                t.loginButton
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 pt-4 border-t border-gray-800/50">
            <p className="text-xs text-gray-500 text-center mb-2">
              {language === 'en' ? 'Demo Credentials:' : 'بيانات تجريبية:'}
            </p>
            <div className="flex flex-col gap-1 text-xs text-gray-500">
              <div className="flex justify-between px-3 py-1.5 bg-gray-800/30 rounded">
                <span>admin</span>
                <span className="text-gray-600">/</span>
                <span>123</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-gray-800/30 rounded">
                <span>employee1</span>
                <span className="text-gray-600">/</span>
                <span>123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
