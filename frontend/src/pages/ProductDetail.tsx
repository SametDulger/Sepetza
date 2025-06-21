import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageCircle, Edit, Trash2 } from 'lucide-react';
import api, { cartService, authService } from '../services/api';
import { Product } from '../types';
import { useToastContext } from '../contexts/ToastContext';
import { reviewService, Review, CreateReviewRequest } from '../services/reviewService';
import { getImageUrl } from '../utils/imageUtils';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToastContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Ürün yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    
    try {
      setReviewsLoading(true);
      const response = await reviewService.getProductReviews(parseInt(id));
      setReviews(response.reviews);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id, fetchProduct, fetchReviews]);

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      showWarning('Giriş Gerekli', 'Sepete ürün eklemek için giriş yapmalısınız!');
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      setAddingToCart(true);
      await cartService.addItem(parseInt(id), quantity);
      
      showSuccess('Başarılı!', `${quantity} adet ürün sepete eklendi!`);
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error: any) {
      console.error('Sepete ekleme hatası:', error);
      
      if (error.response?.status === 401) {
        showError('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
        navigate('/login');
      } else {
        showError('Hata!', error.response?.data?.message || 'Sepete ekleme sırasında bir hata oluştu');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authService.isAuthenticated()) {
      showWarning('Giriş Gerekli', 'Yorum yapmak için giriş yapmalısınız!');
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      setSubmittingReview(true);
      
      const reviewData: CreateReviewRequest = {
        productId: parseInt(id),
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment
      };

      await reviewService.createReview(reviewData);
      
      showSuccess('Başarılı!', 'Yorumunuz başarıyla eklendi!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      fetchReviews();
      
    } catch (error: any) {
      console.error('Yorum gönderme hatası:', error);
      
      if (error.response?.status === 401) {
        showError('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
        navigate('/login');
      } else {
        showError('Hata!', error.response?.data?.message || 'Yorum gönderilirken bir hata oluştu');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <p className="text-gray-600">Aradığınız ürün mevcut değil.</p>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => ({ imageUrl: img, altText: product.name }))
    : [{ imageUrl: 'product-image-placeholder.jpg', altText: product.name }];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ürün Resimleri */}
        <div>
          <div className="aspect-w-1 aspect-h-1 w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
            <img
              src={getImageUrl(images[selectedImage]?.imageUrl)}
              alt={images[selectedImage]?.altText || product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={getImageUrl(image.imageUrl)}
                    alt={image.altText || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ürün Bilgileri */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.shortDescription}</p>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">
                {product.rating} ({product.reviewCount} değerlendirme)
              </span>
            </div>
            <span className="ml-4 text-sm text-gray-500">Marka: {product.brand}</span>
          </div>

          <div className="mb-6">
            {product.discountPrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-red-600">
                  ₺{product.discountPrice.toLocaleString()}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ₺{product.price.toLocaleString()}
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                  %{Math.round(((product.price - product.discountPrice) / product.price) * 100)} İndirim
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ₺{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adet
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 border border-gray-300 rounded text-center min-w-[60px]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Stok: <span className="font-semibold">{product.stockQuantity} adet</span>
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0 || addingToCart}
            className="w-48 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 text-base font-medium"
          >
            {addingToCart ? 'Ekleniyor...' : product.stockQuantity === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
          </button>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ürün Açıklaması</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {product.dimensions && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ürün Boyutları</h3>
              <p className="text-gray-700">{product.dimensions}</p>
            </div>
          )}

          {product.weight && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ağırlık</h3>
              <p className="text-gray-700">{product.weight} kg</p>
            </div>
          )}
        </div>
      </div>

      {/* Yorumlar Bölümü */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2" />
            Müşteri Yorumları ({reviews.length})
          </h2>
          {authService.isAuthenticated() && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {showReviewForm ? 'İptal' : 'Yorum Yap'}
            </button>
          )}
        </div>

        {/* Yorum Formu */}
        {showReviewForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yorum Yaz</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Değerlendirme
                </label>
                {renderStars(reviewForm.rating, true, (rating) => 
                  setReviewForm(prev => ({ ...prev, rating }))
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Yorumunuz için bir başlık yazın"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yorum
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ürün hakkındaki görüşlerinizi paylaşın"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
                >
                  {submittingReview ? 'Gönderiliyor...' : 'Yorum Gönder'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Yorumlar Listesi */}
        {reviewsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Yorumlar yükleniyor...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center mb-2">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.userFirstName} {review.userLastName}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{review.title}</h4>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 