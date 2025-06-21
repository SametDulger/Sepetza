import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cartService, authService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { favoriteService, FavoriteItem } from '../services/favoriteService';
import { getImageUrl } from '../utils/imageUtils';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [removingFromFavorites, setRemovingFromFavorites] = useState<number | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadFavorites();
    
    // Favoriler güncellendiğinde sayfayı yenile
    const handleFavoritesUpdate = () => {
  
      loadFavorites();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
  }, [navigate]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favorites = await favoriteService.getFavorites();
      setFavorites(favorites);
    } catch (error) {
      showError('Hata!', 'Favoriler yüklenirken bir hata oluştu');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId: number) => {
    try {
      setRemovingFromFavorites(productId);
      await favoriteService.removeFromFavorites(productId);
      setFavorites(favorites.filter(item => item.productId !== productId));
      
      // Diğer sayfalardaki favori durumunu güncelle
      window.dispatchEvent(new Event('favoritesUpdated'));
      showSuccess('Başarılı!', 'Ürün favorilerden kaldırıldı');
    } catch (error) {
      showError('Hata!', 'Ürün favorilerden kaldırılırken bir hata oluştu');
    } finally {
      setRemovingFromFavorites(null);
    }
  };

  const addToCart = async (productId: number) => {
    try {
      setAddingToCart(productId);
      await cartService.addItem(productId, 1);
      
      window.dispatchEvent(new Event('cartUpdated'));
      showSuccess('Başarılı!', 'Ürün sepete eklendi!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        showError('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
        navigate('/login');
      } else {
        showError('Hata!', error.response?.data?.message || 'Sepete ekleme sırasında bir hata oluştu');
      }
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Favoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Favorilerim</h1>
            <div className="bg-white rounded-lg shadow-md p-12">
              <div className="text-gray-400 mb-4">
                <Heart className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Favori ürününüz yok</h3>
              <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.</p>
              <Link
                to="/products"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Alışverişe Başla
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Favorilerim</h1>
          <div className="text-sm text-gray-600">
            {favorites.length} ürün
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {favorites.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative">
                  <Link to={`/products/${item.productId}`}>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getImageUrl();
                      }}
                    />
                  </Link>
                  <button
                    onClick={() => removeFromFavorites(item.productId)}
                    disabled={removingFromFavorites === item.productId}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    {removingFromFavorites === item.productId ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <Link to={`/products/${item.productId}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  
                  {item.brand && (
                    <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      {item.discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            ₺{item.discountPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₺{item.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ₺{item.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Stok: {item.stockQuantity}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item.productId)}
                      disabled={addingToCart === item.productId || item.stockQuantity === 0}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                    >
                      {addingToCart === item.productId ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Sepete Ekle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}; 