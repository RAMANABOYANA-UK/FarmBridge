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
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section with Farmer-Life Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-14">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                {t('welcomeTitle')}
                <span className="text-green-600"> {t('farmers')}</span> & 
                <span className="text-orange-500"> {t('consumers')}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                {t('welcomeSubtitle')}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">🌾 {t('directFromFarm')}</span>
                <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">📍 {t('hyperlocal')}</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">💰 {t('fairPrices')}</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                alt="Farmer in field"
                className="rounded-3xl shadow-2xl w-full h-80 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center space-x-3">
                <div className="text-3xl">🌱</div>
                <div>
                  <div className="font-bold text-green-700">{t('farmersConnected')}</div>
                  <div className="text-sm text-gray-500">10,000+</div>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <button
              onClick={() => navigate('/login', { state: { role: 'farmer' } })}
              className="bg-white rounded-2xl shadow-lg border-2 border-green-200 hover:border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden text-center group"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80"
                  alt="Farmer harvesting"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-green-700 mb-2">{t('farmer')}</h2>
                <p className="text-gray-600 mb-4">{t('farmerDesc')}</p>
                <span className="inline-flex items-center text-green-600 font-semibold">
                  {t('iAmFarmer')} <ArrowRight className="h-4 w-4 ml-2" />
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate('/login', { state: { role: 'buyer' } })}
              className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 hover:border-orange-500 hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden text-center group"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
                  alt="Fresh vegetables market"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-orange-700 mb-2">{t('buyer')}</h2>
                <p className="text-gray-600 mb-4">{t('buyerDesc')}</p>
                <span className="inline-flex items-center text-orange-600 font-semibold">
                  {t('iAmBuyer')} <ArrowRight className="h-4 w-4 ml-2" />
                </span>
              </div>
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