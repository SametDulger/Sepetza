import React from 'react';
import { RotateCcw, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export const Returns: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">İade & Değişim</h1>
          <p className="text-xl text-blue-100">
            Ürün iade ve değişim işlemleriniz hakkında detaylı bilgiler.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Return Policy Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <RotateCcw className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">İade Politikası</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">14 gün içinde ücretsiz iade hakkı</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">Ürün kullanılmamış ve orijinal ambalajında olmalı</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">Online iade talebi oluşturabilirsiniz</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">Para iadesi 3-5 iş günü içinde yapılır</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">İade Süreci</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                <div>
                  <p className="font-medium text-gray-900">İade Talebi</p>
                  <p className="text-sm text-gray-600">Hesabınızdan iade talebi oluşturun</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                <div>
                  <p className="font-medium text-gray-900">Kargo Ayarlama</p>
                  <p className="text-sm text-gray-600">Ücretsiz kargo kodu gönderilir</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                <div>
                  <p className="font-medium text-gray-900">Ürün Gönderimi</p>
                  <p className="text-sm text-gray-600">Ürünü orijinal ambalajında gönderin</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                <div>
                  <p className="font-medium text-gray-900">Para İadesi</p>
                  <p className="text-sm text-gray-600">3-5 iş günü içinde hesabınıza iade</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return Conditions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">İade Koşulları</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                İade Edilebilir Ürünler
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Elektronik ürünler (kullanılmamış)</li>
                <li>• Giyim ürünleri (etiketli ve temiz)</li>
                <li>• Ev & yaşam ürünleri</li>
                <li>• Spor & outdoor ürünleri</li>
                <li>• Kitap ve kırtasiye ürünleri</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                İade Edilemeyen Ürünler
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Hijyen ürünleri</li>
                <li>• İç giyim ürünleri</li>
                <li>• Kişiselleştirilmiş ürünler</li>
                <li>• Gıda ve içecek ürünleri</li>
                <li>• Kozmetik ürünler (açılmış)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exchange Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Değişim İşlemi</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Satın aldığınız ürünü farklı renk, beden veya model ile değiştirebilirsiniz.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Değişim Koşulları:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Ürün kullanılmamış olmalı</li>
                  <li>• Orijinal ambalajında olmalı</li>
                  <li>• 14 gün içinde talep edilmeli</li>
                  <li>• Fiyat farkı varsa ödenmeli</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Avantajlar:</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Ücretsiz kargo</li>
                  <li>• Hızlı işlem süreci</li>
                  <li>• Online takip imkanı</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">İade sürem ne zaman başlar?</h3>
                <p className="text-gray-600 text-sm">
                  İade süresi, ürünü teslim aldığınız tarihten itibaren 14 gün olarak hesaplanır.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Kargo ücreti kim öder?</h3>
                <p className="text-gray-600 text-sm">
                  Üründe herhangi bir sorun yoksa ve iade sebebi müşteri kaynaklıysa, kargo ücreti müşteriye aittir.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Para iadesi ne zaman yapılır?</h3>
                <p className="text-gray-600 text-sm">
                  Ürünümüz depoya ulaştıktan sonra 3-5 iş günü içinde para iadesi gerçekleştirilir.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hangi kargo firması ile gönderebilirim?</h3>
                <p className="text-gray-600 text-sm">
                  İade için size özel kargo kodu gönderilir. Bu kod ile anlaşmalı kargo firmamız üzerinden gönderim yapabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 