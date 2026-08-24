import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, User, Save, LogOut, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'react-toastify';
import VoiceInputField from '../../components/VoiceInputField';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { t, language } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    age: '',
    place: '',
    address: '',
    pincode: '',
    bankAccountNumber: '',
    upiId: ''
  });

  const handleInputChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ ...user, ...formData });
    toast.success(t('saveChanges'));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const speak = () => {
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    const text = `${t('name')}: ${formData.name}. ${t('phone')}: ${formData.phone}. ${t('email')}: ${formData.email}. ${t('place')}: ${formData.place}. ${t('fullAddress')}: ${formData.address}. ${t('pincode')}: ${formData.pincode}`;
    const langMap = { en:'en-IN', hi:'hi-IN', ta:'ta-IN', te:'te-IN', kn:'kn-IN', ml:'ml-IN', bn:'bn-IN', mr:'mr-IN', gu:'gu-IN', pa:'pa-IN', or:'or-IN' };
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langMap[language] || 'en-IN';
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const getLocale = (lang) => ({ en:'en-IN', hi:'hi-IN', ta:'ta-IN', te:'te-IN', kn:'kn-IN', ml:'ml-IN', bn:'bn-IN', mr:'mr-IN', gu:'gu-IN', pa:'pa-IN', or:'or-IN' })[lang] || 'en-IN';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/farmer/dashboard')} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('profile')}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={speak}
              title={t('speak')}
              className={`p-2 rounded-lg transition-colors ${speaking ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
            >
              {speaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 text-red-600">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 lg:p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">{user?.name || 'Farmer'}</h2>
          <p className="text-gray-500">{t('farmer')}</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">
          <h3 className="text-lg font-bold mb-4">{t('editProfile')}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
            <VoiceInputField value={formData.name} onChange={handleInputChange('name')} language={language} placeholder={t('name')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
            <VoiceInputField value={formData.phone} onChange={handleInputChange('phone')} language={language} placeholder={t('phone')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
            <VoiceInputField value={formData.email} onChange={handleInputChange('email')} language={language} placeholder={t('email')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('age')}</label>
              <VoiceInputField value={formData.age} onChange={handleInputChange('age')} language={language} placeholder={t('age')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('place')}</label>
              <VoiceInputField value={formData.place} onChange={handleInputChange('place')} language={language} placeholder={t('place')} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('fullAddress')}</label>
            <VoiceInputField value={formData.address} onChange={handleInputChange('address')} language={language} placeholder={t('fullAddress')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('pincode')}</label>
            <VoiceInputField value={formData.pincode} onChange={handleInputChange('pincode')} language={language} placeholder={t('pincode')} />
          </div>

          <h3 className="text-lg font-bold mt-6 mb-4">{t('bankDetails')}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('bankAccountNumber')}</label>
            <VoiceInputField value={formData.bankAccountNumber} onChange={handleInputChange('bankAccountNumber')} language={language} placeholder={t('bankAccountNumber')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('upiId')}</label>
            <VoiceInputField value={formData.upiId} onChange={handleInputChange('upiId')} language={language} placeholder={t('upiId')} />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 flex items-center justify-center space-x-2">
            <Save className="h-5 w-5" />
            <span>{t('saveChanges')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfile;