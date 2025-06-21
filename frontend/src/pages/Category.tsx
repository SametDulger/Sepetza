import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import api from '../services/api';
import { Category as CategoryType } from '../types';
import { useToastContext } from '../contexts/ToastContext';

export const Category: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { showError } = useToastContext();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, [categoryId]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      const allCategories = response.data.data || [];
      setCategories(allCategories);

      if (categoryId) {
        const current = allCategories.find((cat: CategoryType) => cat.id === parseInt(categoryId));
        setCurrentCategory(current || null);
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      showError('Hata!', 'Kategoriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'elektronik': '📱',
      'giyim': '👕',
      'ev': '🏠',
      'yaşam': '🏠',
      'spor': '⚽',
      'outdoor': '🏃',
      'kitap': '📚',
      'medya': '📚',
      'oyuncak': '🧸',
      'hobi': '🎨',
      'kozmetik': '💄',
      'bakım': '🧴',
      'sağlık': '💊',
      'otomotiv': '🚗',
      'bahçe': '🌱',
      'yapı': '🔨',
      'market': '🏪',
      'mutfak': '🍳',
      'mobilya': '🪑',
      'ayakkabı': '👟',
      'aksesuar': '⌚',
      'teknoloji': '💻',
      'telefon': '📱',
      'film': '🎬',
      'dizi': '📺',
      'müzik': '🎵',
      'puzzle': '🧩',
      'zeka': '🧠',
      'makyaj': '💋',
      'parfüm': '🌸',
      'yedek': '🔧',
      'parça': '⚙️',
      'el': '🔨',
      'alet': '🛠️'
    };

    const name = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) {
        return icon;
      }
    }
    return '📦';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border"></div>
            <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
            <div className="absolute inset-4 animate-pulse bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </div>
          <motion.p 
            className="text-white text-xl font-semibold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Kategoriler yükleniyor...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const parentCategories = categories.filter(cat => !cat.parentCategoryId);
  const currentSubCategories = currentCategory?.subCategories || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Breadcrumb */}
        <motion.nav 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {currentCategory ? currentCategory.name : 'Kategoriler'}
            </span>
          </div>
        </motion.nav>

        {/* Page Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {currentCategory ? currentCategory.name : 'Tüm Kategoriler'}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {currentCategory 
              ? `${currentCategory.name} kategorisindeki alt kategorileri keşfedin`
              : 'İstediğiniz ürün kategorisini seçin ve alışverişe başlayın'
            }
          </p>
        </motion.div>

        {/* Categories Grid */}
        {currentCategory && currentSubCategories.length > 0 ? (
          // Show subcategories if viewing a specific category
          <div>
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Alt Kategoriler
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentSubCategories.map((subCategory, index) => (
                <motion.div
                  key={subCategory.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Link to={`/products?category=${subCategory.id}`} className="block p-8 text-center">
                    <div className="text-6xl mb-4">
                      {getCategoryIcon(subCategory.name)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {subCategory.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Alt kategori
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          // Show main categories
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parentCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link to={`/category/${category.id}`} className="block p-8 text-center">
                  <div className="text-6xl mb-4">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {category.subCategories?.length || 0} alt kategori
                  </p>
                  {category.subCategories && category.subCategories.length > 0 && (
                    <div className="mt-4 flex justify-center">
                      <ChevronRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back to Categories Button */}
        {currentCategory && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              to="/categories"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Tüm Kategorilere Dön
            </Link>
          </motion.div>
        )}

        {/* View Products Button */}
        {currentCategory && (
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Link
              to={`/products?category=${currentCategory.id}`}
              className="inline-flex items-center bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Bu Kategorideki Ürünleri Gör
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 