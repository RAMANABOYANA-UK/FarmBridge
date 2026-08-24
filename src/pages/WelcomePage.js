import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Globe, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-800">FarmBridge</span>
          </div>
          <button
            onClick={() => navigate('/language')}
            className="px-4 py-2 rounded-full border-2 border-green-200 text-green-700 hover:bg-green-50 transition-colors flex items-center space-x-2"
          >
            <Globe className="h-4 w-4" />
            <span>भाषा / Language</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('welcomeTitle')}
            <span className="text-green-600"> {t('farmers')}</span> & 
            <span className="text-orange-500"> {t('consumers')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('welcomeSubtitle')}
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/login', { state: { role: 'farmer' } })}
              className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-200 hover:border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">{t('farmer')}</h2>
              <p className="text-gray-600 mb-4">{t('farmerDesc')}</p>
              <span className="inline-flex items-center text-green-600 font-semibold">
                {t('iAmFarmer')} <ArrowRight className="h-4 w-4 ml-2" />
              </span>
            </button>

            <button
              onClick={() => navigate('/login', { state: { role: 'buyer' } })}
              className="bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-200 hover:border-orange-500 hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
            >
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-10 w-10 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-orange-700 mb-2">{t('buyer')}</h2>
              <p className="text-gray-600 mb-4">{t('buyerDesc')}</p>
              <span className="inline-flex items-center text-orange-600 font-semibold">
                {t('iAmBuyer')} <ArrowRight className="h-4 w-4 ml-2" />
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">{t('supportingLocalAgriculture')} • © 2026 FarmBridge</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;