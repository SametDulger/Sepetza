import React from 'react';
import { Truck, Clock, MapPin, Package, CheckCircle } from 'lucide-react';

export const Shipping: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Kargo Bilgileri</h1>
          <p className="text-xl text-blue-100">
            Siparişlerinizin kargo süreci hakkında detaylı bilgiler.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Shipping Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Kargo Seçenekleri</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Standart Kargo</h3>
                  <span className="text-green-600 font-semibold">Ücretsiz*</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  150 TL ve üzeri alışverişlerde ücretsiz
                </p>
                <p className="text-gray-600 text-sm">
                  Teslimat süresi: 2-5 iş günü
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Hızlı Kargo</h3>
                  <span className="text-blue-600 font-semibold">49,90 TL</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Tüm siparişler için geçerli
                </p>
                <p className="text-gray-600 text-sm">
                  Teslimat süresi: 1-2 iş günü
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Aynı Gün Teslimat</h3>
                  <span className="text-purple-600 font-semibold">79,90 TL</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Sadece İstanbul içi (saat 14:00'a kadar verilen siparişler)
                </p>
                <p className="text-gray-600 text-sm">
                  Teslimat süresi: Aynı gün
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Teslimat Süreleri</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">İstanbul</p>
                  <p className="text-sm text-gray-600">1-2 iş günü</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Ankara, İzmir</p>
                  <p className="text-sm text-gray-600">2-3 iş günü</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Diğer İller</p>
                  <p className="text-sm text-gray-600">3-5 iş günü</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Not:</strong> Teslimat süreleri, ürünün stok durumu ve hava koşulları gibi faktörlere bağlı olarak değişebilir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Process */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            Kargo Süreci
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sipariş Onayı</h3>
              <p className="text-gray-600 text-sm">
                Siparişiniz onaylandıktan sonra hazırlık sürecine başlanır.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hazırlık</h3>
              <p className="text-gray-600 text-sm">
                Ürünleriniz özenle paketlenir ve kargoya hazırlanır.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kargoya Verildi</h3>
              <p className="text-gray-600 text-sm">
                Siparişiniz kargo firmasına teslim edilir ve takip numarası gönderilir.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Teslimat</h3>
              <p className="text-gray-600 text-sm">
                Siparişiniz belirtilen adrese güvenli şekilde teslim edilir.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kargo Politikamız</h2>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">150 TL ve üzeri alışverişlerde kargo ücretsizdir.</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">Siparişler en geç 24 saat içinde kargoya verilir.</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">Tüm kargolar sigortalı olarak gönderilir.</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">Kargo takip numarası SMS ile bildirilir.</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">Kapıda ödeme seçeneği mevcuttur.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Önemli Notlar</h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Teslimat Adresi</h3>
                <p className="text-yellow-700 text-sm">
                  Teslimat adresinizin eksiksiz ve doğru olduğundan emin olun. Yanlış adres nedeniyle oluşan gecikmelerden sorumlu değiliz.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Büyük Ürünler</h3>
                <p className="text-blue-700 text-sm">
                  Beyaz eşya ve mobilya gibi büyük ürünler için özel kargo koşulları geçerlidir. Detaylar için müşteri hizmetlerimizle iletişime geçin.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Tatil Günleri</h3>
                <p className="text-red-700 text-sm">
                  Resmi tatil günlerinde kargo hizmeti verilmez. Teslimat süreleri buna göre hesaplanır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 