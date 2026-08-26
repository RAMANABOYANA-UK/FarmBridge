import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, ShoppingCart, ArrowRight, MapPin, IndianRupee, Check } from 'lucide-react';
import IndianFlag from '../components/IndianFlag';

const RoleSelect = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'farmer',
      title: t('farmer'),
      icon: Sprout,
      description: t('farmerDesc'),
      color: 'green',
      image: '🌱'
    },
    {
      id: 'buyer',
      title: t('buyer'),
      icon: ShoppingCart,
      description: t('buyerDesc'),
      color: 'orange',
      image: '🛒'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/login', { state: { role: selectedRole } });
    }
  };

  const handleBack = () => {
    navigate('/');
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
          <div className="flex items-center"></div>
        </header>

        <div className="hidden md:flex justify-center gap-3 mt-2 flex-wrap">
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
          <div className="max-w-2xl w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 rounded-full overflow-hidden shadow-lg border-4 border-white animate-pulse">
                <IndianFlag variant="circle" className="w-full h-full" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-3">{t('selectYourRole')}</h2>
              <p className="text-gray-600 mt-1">{t('roleSelectionDesc')}</p>
            </div>

            <div className="space-y-5 mb-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full p-6 rounded-2xl border-4 transition-all duration-300 ${
                    selectedRole === role.id
                      ? role.id === 'farmer'
                        ? 'border-green-500 bg-green-50 shadow-xl'
                        : 'border-orange-500 bg-orange-50 shadow-xl'
                      : 'border-gray-200 bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center ${
                      role.id === 'farmer' ? 'bg-green-100' : 'bg-orange-100'
                    } ${selectedRole === role.id ? (role.id === 'farmer' ? 'animate-bounce' : 'animate-pulse') : ''}`}>
                      <span className="text-4xl">{role.image}</span>
                    </div>

                    <div className="text-left flex-grow">
                      <div className="flex items-center mb-2">
                        <h3 className={`text-2xl font-bold ${role.id === 'farmer' ? 'text-green-700' : 'text-orange-700'}`}>
                          {role.title}
                        </h3>
                        {selectedRole === role.id && (
                          <Check className="ml-3 w-6 h-6 text-green-500" />
                        )}
                      </div>
                      <p className="text-gray-600">{role.description}</p>
                    </div>

                    <ArrowRight className={`h-6 w-6 ml-4 ${
                      selectedRole === role.id
                        ? role.id === 'farmer' ? 'text-green-500' : 'text-orange-500'
                        : 'text-gray-300'
                    }`} />
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                selectedRole
                  ? selectedRole === 'farmer'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedRole ? t('continueAs', { role: t(selectedRole) }) : t('selectRoleToContinue')}
            </button>

            <button onClick={handleBack} className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-4">
              ← Back to language selection
            </button>
          </div>
        </main>

        <footer className="py-4 text-center text-white/80 text-sm">
          Proudly connecting India's farmers & consumers 🌾 &nbsp;•&nbsp; @2026 Copyright
        </footer>
      </div>
    </div>
  );
};

export default RoleSelect;
