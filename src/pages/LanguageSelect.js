import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Check, ArrowRight, Sprout, MapPin, IndianRupee } from 'lucide-react';
import IndianFlag from '../components/IndianFlag';

// Indian scheduled languages (Nepali removed)
const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' }
];

const LanguageSelect = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(language || 'en');

  const handleContinue = () => {
    setLanguage(selectedLang);
    navigate('/role');
  };

  return (
    <div className="relative min-h-screen">
      <img
        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80"
        alt="Farm field"
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

        <div className="hidden md:flex justify-center gap-3 mt-2">
          <span className="px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white text-sm flex items-center space-x-1 animate-pulse">
            <Sprout className="h-4 w-4 text-green-300" /> <span>Direct from Farm</span>
          </span>
          <span className="px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white text-sm flex items-center space-x-1 animate-pulse">
            <MapPin className="h-4 w-4 text-orange-300" /> <span>Hyperlocal</span>
          </span>
          <span className="px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white text-sm flex items-center space-x-1 animate-pulse">
            <IndianRupee className="h-4 w-4 text-yellow-300" /> <span>Fair Prices</span>
          </span>
        </div>

        <main className="flex-grow flex items-center justify-center p-4 mt-4">
          <div className="max-w-3xl w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex w-16 h-16 rounded-full overflow-hidden shadow-lg border-4 border-white animate-pulse">
                <IndianFlag variant="circle" className="w-full h-full" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-3">Select Your Language</h2>
              <p className="text-gray-600 mt-1">Choose your preferred language for the app</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedLang === lang.code
                      ? 'border-green-500 bg-green-50 shadow-md scale-105'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:scale-105'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-base font-semibold mb-0.5 text-gray-800">{lang.nativeName}</div>
                    <div className="text-xs text-gray-500">{lang.name}</div>
                    {selectedLang === lang.code && <Check className="h-4 w-4 text-green-500 mt-1" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="text-center text-gray-500 text-sm mt-3">You can change this later in your profile settings</p>
          </div>
        </main>

        <footer className="py-4 text-center text-white/80 text-sm">Proudly connecting India's farmers & consumers 🌾 &nbsp;•&nbsp; @2026 Copyright</footer>
      </div>
    </div>
  );
};

export default LanguageSelect;
