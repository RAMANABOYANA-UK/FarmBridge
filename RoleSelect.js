import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, ShoppingCart, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {t('selectYourRole')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('roleSelectionDesc')}
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-6 mb-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`
                w-full p-6 rounded-2xl border-4 transition-all duration-300
                ${selectedRole === role.id
                  ? role.id === 'farmer'
                    ? 'border-green-500 bg-green-50 shadow-xl'
                    : 'border-orange-500 bg-orange-50 shadow-xl'
                  : 'border-gray-200 bg-white hover:shadow-lg'
                }
              `}
            >
              <div className="flex items-center">
                {/* Icon/Image */}
                <div className={`
                  flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-4xl
                  ${role.id === 'farmer' ? 'bg-green-100' : 'bg-orange-100'}
                `}>
                  {role.image}
                </div>

                {/* Content */}
                <div className="ml-6 text-left flex-grow">
                  <div className="flex items-center mb-2">
                    <h3 className={`
                      text-2xl font-bold
                      ${role.id === 'farmer' ? 'text-green-700' : 'text-orange-700'}
                    `}>
                      {role.title}
                    </h3>
                    {selectedRole === role.id && (
                      <div className="ml-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {role.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className={`
                  h-6 w-6 ml-4
                  ${selectedRole === role.id
                    ? role.id === 'farmer' ? 'text-green-500' : 'text-orange-500'
                    : 'text-gray-300'
                  }
                `} />
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`
            w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300
            ${selectedRole
              ? selectedRole === 'farmer'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {selectedRole ? t('continueAs', { role: t(selectedRole) }) : t('selectRoleToContinue')}
        </button>

        {/* Helper Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {t('roleSelectionNote')}
        </p>
      </div>
    </div>
  );
};

export default RoleSelect;