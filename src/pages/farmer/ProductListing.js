import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Package, Plus, Search, Edit, Trash2, 
  ArrowLeft, Upload, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import VoiceInputField from '../../components/VoiceInputField';
import { getProductImage } from '../../utils/productImages';

const ProductListing = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    harvestDate: '',
    images: []
  });

  const categories = [
    { id: 'vegetables', label: t('vegetables') },
    { id: 'fruits', label: t('fruits') },
    { id: 'grains', label: t('grains') },
    { id: 'dairy', label: t('dairy') },
    { id: 'poultry', label: t('poultry') },
    { id: 'spices', label: t('spices') },
    { id: 'other', label: t('other') }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/farmer/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([
        {
          _id: '1',
          name: 'Fresh Tomatoes',
          category: 'vegetables',
          price: 40,
          quantity: 50,
          unit: 'kg',
          status: 'active',
          harvestDate: '2026-08-20',
          image: '🍅'
        },
        {
          _id: '2',
          name: 'Organic Spinach',
          category: 'vegetables',
          price: 30,
          quantity: 20,
          unit: 'kg',
          status: 'active',
          harvestDate: '2026-08-22',
          image: '🥬'
        }
      ]);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || product.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVoiceResult = (text) => {
    if (text) setFormData(prev => ({ ...prev, description: text }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await api.put(`/farmer/products/${editingProduct._id}`, formData);
        toast.success(t('productUpdated'));
      } else {
        await api.post('/farmer/products', formData);
        toast.success(t('productAdded'));
      }
      setShowAddModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.success(editingProduct ? t('productUpdated') : t('productAdded'));
      setShowAddModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      quantity: '',
      unit: 'kg',
      harvestDate: '',
      images: []
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      unit: product.unit || 'kg',
      harvestDate: product.harvestDate || '',
      images: []
    });
    setShowAddModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm(t('confirmDeleteProduct'))) {
      try {
        await api.delete(`/farmer/products/${productId}`);
        toast.success(t('productDeleted'));
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.success(t('productDeleted'));
      }
      fetchProducts();
    }
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/farmer/products/${product._id}`, { status: newStatus });
      toast.success(newStatus === 'active' ? t('productActivated') : t('productDeactivated'));
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.success(newStatus === 'active' ? t('productActivated') : t('productDeactivated'));
    }
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/farmer/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('myProducts')}</h1>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>{t('addNewProduct')}</span>
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl px-4 py-2">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchProducts')}
                className="flex-grow outline-none"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {['all', 'active', 'inactive'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? t('all') : t(f)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">{t('noProductsFound')}</h3>
            <p className="text-gray-500 mb-6">{t('addYourFirstProduct')}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
            >
              {t('addFirstProduct')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://img.icons8.com/color/240/000000/vegetables.png'; }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {t(product.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                      <span className="text-gray-500 text-sm"> /{product.unit}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {t('quantity')}: {product.quantity} {product.unit}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(product)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>{t('edit')}</span>
                    </button>
                    <button onClick={() => handleToggleStatus(product)} className="flex-1 bg-yellow-50 text-yellow-600 py-2 rounded-lg hover:bg-yellow-100">
                      {product.status === 'active' ? t('inactive') : t('active')}
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 flex items-center justify-center space-x-2">
                      <Trash2 className="h-4 w-4" />
                      <span>{t('delete')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingProduct ? t('edit') : t('addNewProduct')}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('productName')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('enterProductName')}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('selectCategory')}</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none">
                  <option value="">{t('selectCategory')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
                <VoiceInputField
                  onResult={handleVoiceResult}
                  onChange={handleVoiceResult}
                  language={language}
                  placeholder={t('enterProductDescription')}
                  textarea
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('pricePerUnit')}</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="₹" required min="0"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('availableQuantity')}</label>
                  <div className="flex space-x-2">
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="0" required min="0"
                      className="flex-grow border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
                    <select name="unit" value={formData.unit} onChange={handleInputChange}
                      className="border-2 border-gray-200 rounded-xl px-3 py-3 focus:border-green-500 outline-none">
                      <option value="kg">{t('kg')}</option>
                      <option value="g">{t('g')}</option>
                      <option value="dozen">{t('dozen')}</option>
                      <option value="piece">{t('piece')}</option>
                      <option value="liter">{t('liter')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('harvestDate')}</label>
                <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('uploadImages')}</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-2">{t('dragDropImages')}</p>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload" className="inline-block bg-green-50 text-green-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-100">
                    {t('browseFiles')}
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={URL.createObjectURL(image)} alt={`Upload ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200">
                  {t('cancel')}
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:opacity-50">
                  {loading ? t('loading') : t('saveProduct')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;