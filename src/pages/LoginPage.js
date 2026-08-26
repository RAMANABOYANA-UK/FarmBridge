import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Phone, ShieldCheck, ArrowRight, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import VoiceInputField from '../components/VoiceInputField';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [loading, setLoading] = useState(false);
  const [demoOtp] = useState('123456');

  const selectedRole = location.state?.role || 'buyer';

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      toast.success(`OTP sent to ${phone}. Demo OTP: ${demoOtp}`);
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid OTP');
      return;
    }
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      if (otp === demoOtp) {
        const userData = {
          id: 'demo-user-1',
          name: selectedRole === 'farmer' ? 'Demo Farmer' : 'Demo Buyer',
          phone: phone,
          role: selectedRole,
          email: '',
          profilePhoto: null,
        };
        login(userData, 'demo-token-123');
        toast.success(t('loginSuccess'));
        navigate(selectedRole === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
      } else {
        toast.error('Invalid OTP. Try 123456');
      }
    }, 1000);
  };

  return (
    <div className="relative min-h-screen">
      {/* Full-page background image */}
      <img
        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80"
        alt="Farm field at sunset"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center animate-bounce">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">FarmBridge</h1>
              <p className="text-green-100 text-sm opacity-90">Farmer to Consumer • Made in India</p>
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Sprout className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('login')}
          </h1>
          <p className="text-gray-600">
            {selectedRole === 'farmer' ? t('iAmFarmer') : t('iAmBuyer')}
          </p>
        </div>

        <div>
          {step === 'phone' ? (
            <>
              {/* Phone Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phoneNumber')}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 flex-grow focus-within:border-green-500 bg-white">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendOtp(); } }}
                      placeholder="+91 98765 43210"
                      className="flex-grow outline-none"
                    />
                  </div>
                  <VoiceInputField
                    onResult={(text) => setPhone(text)}
                    language={language}
                    placeholder=""
                    textarea={false}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>{t('sendOtp')}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('otp')}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 flex-grow focus-within:border-green-500 bg-white">
                    <ShieldCheck className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleVerifyOtp(); } }}
                      placeholder="Enter OTP"
                      maxLength={6}
                      className="flex-grow outline-none"
                    />
                  </div>
                  <VoiceInputField
                    onResult={(text) => setOtp(text.replace(/\D/g, '').slice(0, 6))}
                    language={language}
                    placeholder=""
                    textarea={false}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('demoOtp')}: 123456
                </p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>{t('verifyOtp')}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('phone')}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                ← Change phone number
              </button>
            </>
          )}
        </div>

        {/* Helper Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {t('newToFarmBridge')}{' '}
          <button onClick={() => navigate('/signup', { state: { role: selectedRole } })} className="text-green-600 font-medium hover:underline">
            {t('createAccount')}
          </button>
        </p>
          </div>
        </main>

        <footer className="py-4 text-center text-white/80 text-sm">
          Proudly connecting India's farmers & consumers 🌾 &nbsp;•&nbsp; @2026 Copyright
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;