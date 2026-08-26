import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Phone, User, ArrowRight, Loader, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import VoiceInputField from '../components/VoiceInputField';

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('details');
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const demoOtp = '123456';
  const selectedRole = location.state?.role || 'buyer';

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const sendOtp = () => {
    if (!name.trim()) return toast.error('Please enter your name');
    if (!phone || phone.length < 10) return toast.error('Please enter a valid phone number');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); toast.success(`OTP sent to ${phone}. Demo OTP: ${demoOtp}`); }, 1000);
  };

  const verifyOtp = () => {
    if (!otp || otp.length < 6) return toast.error('Please enter a valid OTP');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp === demoOtp) {
        login({ id: 'demo-user-' + Date.now(), name, phone, role: selectedRole, email: '', profilePhoto }, 'demo-token-123');
        toast.success(t('loginSuccess'));
        navigate(selectedRole === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
      } else toast.error('Invalid OTP. Try 123456');
    }, 1000);
  };

  const onEnter = (e) => { if (e.key === 'Enter') { e.preventDefault(); step === 'details' ? sendOtp() : verifyOtp(); } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4" onKeyDown={onEnter}>
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block relative rounded-3xl overflow-hidden shadow-2xl h-[560px]">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80" alt="Farmer" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-3xl font-bold mb-2">FarmBridge</h2>
            <p className="opacity-90">{t('welcomeSubtitle')}</p>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"><Sprout className="h-8 w-8 text-green-600" /></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('createAccount')}</h1>
            <p className="text-gray-600">{selectedRole === 'farmer' ? t('iAmFarmer') : t('iAmBuyer')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {step === 'details' ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20">
                    {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-green-100" />
                      : <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"><User className="h-10 w-10 text-green-600" /></div>}
                    <label htmlFor="signup-photo" className="absolute bottom-0 right-0 bg-green-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-700 shadow"><Camera className="h-3.5 w-3.5" /></label>
                    <input type="file" id="signup-photo" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
                  <VoiceInputField value={name} onChange={setName} language={language} placeholder={t('name')} />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('phoneNumber')}</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 flex-grow focus-within:border-green-500 bg-white">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="flex-grow outline-none" />
                    </div>
                    <VoiceInputField onResult={setPhone} language={language} placeholder="" />
                  </div>
                </div>

                <button onClick={sendOtp} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50">
                  {loading ? <Loader className="h-5 w-5 animate-spin" /> : <><span>{t('sendOtp')}</span><ArrowRight className="h-5 w-5" /></>}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  {t('alreadyHaveAccount')}{' '}
                  <button onClick={() => navigate('/login', { state: { role: selectedRole } })} className="text-green-600 font-medium hover:underline">{t('login')}</button>
                </p>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('otp')}</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 flex-grow focus-within:border-green-500 bg-white">
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" maxLength={6} className="flex-grow outline-none" />
                    </div>
                    <VoiceInputField onResult={(text) => setOtp(text.replace(/\D/g, '').slice(0, 6))} language={language} placeholder="" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{t('demoOtp')}: 123456</p>
                </div>

                <button onClick={verifyOtp} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50">
                  {loading ? <Loader className="h-5 w-5 animate-spin" /> : <><span>{t('verifyOtp')}</span><ArrowRight className="h-5 w-5" /></>}
                </button>

                <button onClick={() => setStep('details')} className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-4">← {t('changePhone')}</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;