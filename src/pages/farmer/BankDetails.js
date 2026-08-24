import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, CreditCard, Landmark, Save, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import VoiceInputField from '../../components/VoiceInputField';

const BankDetailsPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    phoneNumber: ''
  });

  const handleInputChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(t('bankDetailsSaved'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/farmer/dashboard')} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('bankDetails')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 lg:p-6">
        {/* Payment Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Landmark className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold">{t('bankTransfer')}</h3>
                <p className="text-sm text-gray-500">{t('processingTime')}: 1-2 {t('bankTransfer')}</p>
              </div>
            </div>
            <p className="text-green-600 font-medium text-sm">{t('noFees')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold">UPI</h3>
                <p className="text-sm text-gray-500">{t('processingTime')}: {t('instant')}</p>
              </div>
            </div>
            <p className="text-green-600 font-medium text-sm">{t('noFees')}</p>
          </div>
        </div>

        {/* Bank Details Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center">
            <CreditCard className="h-5 w-5 text-green-600 mr-2" />
            {t('bankAccountDetails')}
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('accountHolderName')}</label>
            <VoiceInputField value={formData.accountHolderName} onChange={handleInputChange('accountHolderName')} language={language} placeholder={t('accountHolderName')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('bankName')}</label>
            <VoiceInputField value={formData.bankName} onChange={handleInputChange('bankName')} language={language} placeholder={t('bankName')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('accountNumber')}</label>
            <VoiceInputField value={formData.accountNumber} onChange={handleInputChange('accountNumber')} language={language} placeholder={t('accountNumber')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('ifscCode')}</label>
            <VoiceInputField value={formData.ifscCode} onChange={handleInputChange('ifscCode')} language={language} placeholder="e.g. SBIN0001234" />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-4">{t('upiDetails')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('upiId')}</label>
              <VoiceInputField value={formData.upiId} onChange={handleInputChange('upiId')} language={language} placeholder="yourname@upi" />
            </div>
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

export default BankDetailsPage;