import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Shield, Truck, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">Farm Bridge</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span>{t('getStarted')}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {t('welcomeTitle')}
              <span className="text-green-600"> {t('farmers')}</span> & 
              <span className="text-orange-500"> {t('consumers')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              {t('welcomeSubtitle')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
                <p className="text-gray-600">{t('farmersConnected')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Truck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">5000+</h3>
                <p className="text-gray-600">{t('ordersDelivered')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">98%</h3>
                <p className="text-gray-600">{t('satisfactionRate')}</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-green-600 text-2xl mb-3">🚜</div>
                <h4 className="font-bold text-lg mb-2">{t('directFromFarm')}</h4>
                <p className="text-gray-600 text-sm">{t('directFromFarmDesc')}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-green-600 text-2xl mb-3">📍</div>
                <h4 className="font-bold text-lg mb-2">{t('hyperlocal')}</h4>
                <p className="text-gray-600 text-sm">{t('hyperlocalDesc')}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-green-600 text-2xl mb-3">💵</div>
                <h4 className="font-bold text-lg mb-2">{t('fairPrices')}</h4>
                <p className="text-gray-600 text-sm">{t('fairPricesDesc')}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-green-600 text-2xl mb-3">📱</div>
                <h4 className="font-bold text-lg mb-2">{t('easyToUse')}</h4>
                <p className="text-gray-600 text-sm">{t('easyToUseDesc')}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>{t('iAmFarmer')}</span>
                <Sprout className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>{t('iAmBuyer')}</span>
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm mb-2">{t('supportingLocalAgriculture')}</p>
          <p className="text-xs opacity-80">© 2026 Farm Bridge. {t('allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;