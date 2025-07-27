import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Truck, Shield, RotateCcw, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import api, { cartService, authService } from '../services/api';
import { Product, Category } from '../types';
import { useToastContext } from '../contexts/ToastContext';
import { cn } from '../utils/cn';
import { favoriteService } from '../services/favoriteService';
import { getMainProductImage } from '../utils/imageUtils';

export const Home: React.FC = () => {
  const location = useLocation();
  const { showSuccess, showError, showWarning } = useToastContext();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
    loadFavorites();
    
    // Yeni kayıt olan kullanıcı için hoşgeldin mesajı
    const isNewUser = localStorage.getItem('isNewUser');
    if (isNewUser === 'true') {
      showSuccess('Hoş Geldiniz!', 'Kayıt başarılı! Sepetza ailesine hoş geldiniz!');
      localStorage.removeItem('isNewUser'); // Bir kez göster
    }

    // Favoriler güncellendiğinde yeniden yükle
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
  }, [showSuccess]);

  // Load initial data (categories and products)
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Kategorileri ve ürünleri paralel olarak yükle
      const [categoriesRes, productsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products')
      ]);
      
      setCategories(categoriesRes.data.data || []);
      setFeaturedProducts(productsRes.data.data || []);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      showError('Hata!', 'Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Load user favorites
  const loadFavorites = async () => {
    try {
      if (authService.isAuthenticated()) {
        const favorites = await favoriteService.getFavorites();
        const favoriteIds = favorites.map(f => f.productId);
        setLikedProducts(new Set(favoriteIds));
      }
    } catch (error) {
      // Hata durumunda sessizce geç, favoriler yüklenemezse sadece boş set kullan
      setLikedProducts(new Set());
    }
  };

  // Add product to cart
  const addToCart = async (productId: number) => {
    try {
      setAddingToCart(productId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        showWarning('Giriş Gerekli', 'Sepete ürün eklemek için giriş yapmalısınız.');
        return;
      }

      await cartService.addItem(productId, 1);
      
      // Sepet güncellendiğini bildirmek için event dispatch et
      window.dispatchEvent(new Event('cartUpdated'));
      
      showSuccess('Başarılı!', 'Ürün sepete eklendi!');
    } catch (error: any) {
      console.error('Sepete ekleme hatası:', error);
      
      if (error.response?.status === 401) {
        showError('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || 'Ürün sepete eklenirken bir hata oluştu!';
        showError('Hata!', errorMessage);
      }
    } finally {
      setAddingToCart(null);
    }
  };

  // Toggle product favorite status
  const toggleLike = async (productId: number) => {
    try {
      if (!authService.isAuthenticated()) {
        showWarning('Giriş Gerekli', 'Favorilere eklemek için giriş yapmalısınız.');
        return;
      }

      const newLiked = new Set(likedProducts);
      if (newLiked.has(productId)) {
        await favoriteService.removeFromFavorites(productId);
        newLiked.delete(productId);
        showSuccess('Başarılı!', 'Ürün favorilerden kaldırıldı');
      } else {
        await favoriteService.addToFavorites(productId);
        newLiked.add(productId);
        showSuccess('Başarılı!', 'Ürün favorilere eklendi');
      }
      setLikedProducts(newLiked);
      
      // Diğer sayfalardaki favori durumunu güncelle
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error: any) {
      if (error.response?.status === 401) {
        showError('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
      } else {
        showError('Hata!', error.response?.data?.message || 'Favori işlemi sırasında bir hata oluştu');
      }
    }
  };

  // Format price display
  const formatPrice = (price: number) => {
    return `₺${price.toLocaleString()}`;
  };

  // Get category icon
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
    return '📦'; // Default icon
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
            Sepetza yükleniyor...
          </motion.p>
        </motion.div>
      </div>
    );
  }

    return (
    <div className="w-screen min-h-screen">
      {/* Categories Section - Dropdown Menu */}
      <section id="categories-section" className="bg-white border-b border-gray-200 pb-0">
        <div className="w-full">
          {/* Horizontal Dropdown Menu */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-full">
              <nav className="flex items-center justify-center w-full bg-gray-50 p-6 shadow-lg">
                {/* Ana kategoriler - Artık ortalanmış */}
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6">
                  {categories
                    .filter(category => !category.parentCategoryId)
                    .slice(0, 8)
                    .map((category, index) => (
                  <motion.div
                    key={category.id}
                    className="relative group/dropdown"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  >
                    <div className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-white rounded-xl transition-all duration-200 group-hover/dropdown:shadow-md cursor-pointer">
                      <span className="text-lg">
                        {getCategoryIcon(category.name)}
                      </span>
                      <span className="font-medium text-sm">{category.name}</span>
                      {category.subCategories && category.subCategories.length > 0 && (
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover/dropdown:text-blue-600 transition-all duration-200 group-hover/dropdown:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>

                    {/* Ana kategori linki */}
                    <Link
                      to={`/products?category=${category.id}`}
                      className="absolute inset-0 z-10"
                    />

                    {/* Dropdown Alt Kategoriler */}
                    {category.subCategories && category.subCategories.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-150 z-50 transform translate-y-1 group-hover/dropdown:translate-y-0">
                        <div className="p-4">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            {category.name} Alt Kategorileri
                          </div>
                          <div className="space-y-1">
                            {category.subCategories.map((subCategory) => (
                              <Link
                                key={subCategory.id}
                                to={`/products?category=${subCategory.id}`}
                                className="flex items-center space-x-3 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-100 group/sub relative z-20"
                              >
                                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60 group-hover/sub:opacity-100 transition-opacity"></div>
                                <span className="text-sm font-medium">{subCategory.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        {/* Arrow */}
                        <div className="absolute -top-1 left-6 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                      </div>
                    )}
                  </motion.div>
                  ))}
                </div>
              </nav>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products - Ultra Modern */}
      <section id="products-section" className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-8 pb-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 16).map((product, index) => (
              <motion.div 
                key={product.id} 
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Discount Badge */}
                {product.discountPrice && (
                  <motion.div
                    className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                  >
                    %{Math.round(((product.price - product.discountPrice) / product.price) * 100)} İndirim
                  </motion.div>
                )}

                {/* Like Button */}
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleLike(product.id);
                  }}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart 
                    className={cn(
                      "h-4 w-4 transition-colors",
                      likedProducts.has(product.id) 
                        ? "text-red-500 fill-red-500" 
                        : "text-gray-400 hover:text-red-400"
                    )}
                  />
                </motion.button>

                {/* Product Image */}
                <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
                  <motion.div 
                    className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-gray-100 to-gray-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={getMainProductImage(product.images)}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>
                
                {/* Content */}
                <div className="p-6">
                  <Link to={`/products/${product.id}`}>
                    <motion.h3 
                      className="font-bold text-gray-900 hover:text-blue-600 transition-colors mb-3 line-clamp-2 text-lg"
                      whileHover={{ x: 2 }}
                    >
                      {product.name}
                    </motion.h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                  
                  {/* Rating & Brand */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < Math.floor(product.rating || 0) 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {product.brand}
                    </span>
                  </div>
                  
                  {/* Price & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.discountPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(product.discountPrice || product.price)}
                      </span>
                    </div>
                    
                    <motion.button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product.id);
                      }}
                      disabled={addingToCart === product.id}
                      className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {addingToCart === product.id ? (
                        <motion.div 
                          className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                      
                      {/* Ripple Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </motion.button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link
                to="/products"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Tüm Ürünleri Gör
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
                    </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 pt-8 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >


          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Hızlı Teslimat",
                description: "Siparişleriniz 24 saat içinde kargoya verilir",
                gradient: "from-green-500 to-emerald-600",
                bgGradient: "from-green-50 to-emerald-50",
                delay: 0.1
              },
              {
                icon: Shield,
                title: "Güvenli Ödeme",
                description: "SSL sertifikası ile korunan güvenli ödeme sistemi",
                gradient: "from-blue-500 to-indigo-600",
                bgGradient: "from-blue-50 to-indigo-50",
                delay: 0.2
              },
              {
                icon: RotateCcw,
                title: "Kolay İade",
                description: "30 gün içinde ücretsiz iade hakkı",
                gradient: "from-purple-500 to-violet-600",
                bgGradient: "from-purple-50 to-violet-50",
                delay: 0.3
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={cn(
                  "relative group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50",
                  "hover:-translate-y-2"
                )}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Gradient Background */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br",
                  feature.bgGradient
                )} />
                
                {/* Icon Container */}
                <motion.div
                  className={cn(
                    "relative w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br shadow-lg",
                    feature.gradient
                  )}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon className="h-10 w-10 text-white" />
                  
                  {/* Glow Effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500",
                    feature.gradient
                  )} />
                </motion.div>
                
                {/* Content */}
                <div className="text-center relative">
                  <motion.h3 
                    className="text-2xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: feature.delay + 0.2 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 leading-relaxed text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: feature.delay + 0.3 }}
                  >
                    {feature.description}
                  </motion.p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
            ))}
          </div>

          {/* Additional Trust Indicators */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">7/24 Destek</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Ücretsiz Kargo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}; 