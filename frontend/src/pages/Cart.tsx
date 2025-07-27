import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { cartService, authService } from '../services/api';
import { useToastContext } from '../contexts/ToastContext';
import { getMainProductImage } from '../utils/imageUtils';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image: string;
  stockQuantity: number;
}

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const loadCartItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartService.getItems();
      
      // API response'unu CartItem interface'ine uygun hale getir
      const formattedItems = response.data.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        name: item.product?.name || 'Ürün',
        price: item.product?.price || 0,
        discountPrice: item.product?.discountPrice,
        quantity: item.quantity,
        image: getMainProductImage(item.product?.images),
        stockQuantity: item.product?.stockQuantity || 0
      }));
      
      setCartItems(formattedItems);
    } catch (error: any) {
      console.error('Sepet yükleme hatası:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadCartItems();
  }, [navigate, loadCartItems]);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    try {
      setUpdating(productId);
      await cartService.updateItem(productId, newQuantity);
      
      setCartItems(items =>
        items.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      console.error('Sepet güncelleme hatası:', error);
      showError('Hata!', error.response?.data?.message || 'Sepet güncellenirken bir hata oluştu');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      setUpdating(productId);
      await cartService.removeItem(productId);
      
      setCartItems(items => items.filter(item => item.productId !== productId));
      window.dispatchEvent(new Event('cartUpdated'));
      showSuccess('Başarılı!', 'Ürün sepetten kaldırıldı');
    } catch (error: any) {
      console.error('Ürün kaldırma hatası:', error);
      showError('Hata!', error.response?.data?.message || 'Ürün kaldırılırken bir hata oluştu');
    } finally {
      setUpdating(null);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.discountPrice) {
        return total + ((item.price - item.discountPrice) * item.quantity);
      }
      return total;
    }, 0);
  };

    if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sepet yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Sepetim</h1>
          <div className="bg-white rounded-lg shadow-md p-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m12 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sepetiniz boş</h3>
            <p className="text-gray-600 mb-6">Alışverişe başlamak için ürünleri sepetinize ekleyin.</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sepetim</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sepet Ürünleri */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="p-6 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
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
                    <p className="text-sm text-gray-600">
                      Stok: {item.stockQuantity} adet
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 py-1 border border-gray-300 rounded text-center min-w-[50px]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 mb-2">
                      ₺{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-800 transition duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sipariş Özeti */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} ürün)</span>
                <span>₺{(getTotalPrice() + getTotalDiscount()).toLocaleString()}</span>
              </div>
              
              {getTotalDiscount() > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim</span>
                  <span>-₺{getTotalDiscount().toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Toplam</span>
                <span>₺{getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 text-center block font-semibold"
            >
              Siparişi Tamamla
            </Link>
            
            <Link
              to="/products"
              className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200 text-center block"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 