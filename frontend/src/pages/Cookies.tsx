import React from 'react';
import { Cookie, Settings, Eye, BarChart } from 'lucide-react';

export const Cookies: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Çerez Politikası</h1>
          <p className="text-xl text-blue-100">
            Web sitemizde kullanılan çerezler hakkında detaylı bilgiler.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Last Updated */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800">
            <strong>Son Güncelleme:</strong> 1 Ocak 2025
          </p>
        </div>

        {/* What are Cookies */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Cookie className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Çerez Nedir?</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Çerezler, web sitelerinin daha iyi çalışmasını sağlamak amacıyla cihazınızda saklanan 
            küçük metin dosyalarıdır. Bu dosyalar, site deneyiminizi kişiselleştirmek, site 
            performansını analiz etmek ve size daha iyi hizmet sunmak için kullanılır.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Sepetza olarak, kullanıcı deneyimini iyileştirmek ve hizmetlerimizi geliştirmek 
            amacıyla çeşitli türde çerezler kullanmaktayız.
          </p>
        </div>

        {/* Cookie Types */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Çerez Türleri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Settings className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Zorunlu Çerezler</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Web sitesinin temel işlevlerini yerine getirmesi için gerekli çerezlerdir.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Oturum yönetimi</li>
                <li>• Güvenlik kontrolleri</li>
                <li>• Sepet işlemleri</li>
                <li>• Dil tercihleri</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <BarChart className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Analitik Çerezler</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Site kullanımını analiz etmek ve performansı iyileştirmek için kullanılır.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Sayfa görüntüleme istatistikleri</li>
                <li>• Kullanıcı davranış analizi</li>
                <li>• Site performans ölçümü</li>
                <li>• Hata raporlama</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Eye className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">İşlevsel Çerezler</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Gelişmiş özellikler ve kişiselleştirme için kullanılan çerezlerdir.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Kullanıcı tercihleri</li>
                <li>• Kişiselleştirilmiş içerik</li>
                <li>• Sosyal medya entegrasyonu</li>
                <li>• Canlı destek özellikleri</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-5 h-5 bg-yellow-600 rounded mr-2"></div>
                <h3 className="font-semibold text-gray-900">Pazarlama Çerezleri</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Reklam ve pazarlama faaliyetleri için kullanılan çerezlerdir.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Hedefli reklamlar</li>
                <li>• Kampanya takibi</li>
                <li>• Sosyal medya paylaşımları</li>
                <li>• Üçüncü taraf reklamlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Third Party Cookies */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Üçüncü Taraf Çerezleri</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Sitemizde bazı üçüncü taraf hizmet sağlayıcılarının çerezleri de kullanılmaktadır:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Site trafiği ve kullanıcı davranışlarını analiz etmek için kullanılır.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Facebook Pixel</h3>
                <p className="text-gray-600 text-sm">
                  Sosyal medya reklamlarının etkinliğini ölçmek için kullanılır.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Google Ads</h3>
                <p className="text-gray-600 text-sm">
                  Reklam kampanyalarının performansını takip etmek için kullanılır.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Hotjar</h3>
                <p className="text-gray-600 text-sm">
                  Kullanıcı deneyimini analiz etmek ve iyileştirmek için kullanılır.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Çerez Yönetimi</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Tarayıcı Ayarları</h3>
              <p className="text-blue-700 text-sm mb-2">
                Çoğu tarayıcı çerezleri otomatik olarak kabul eder, ancak bunu değiştirebilirsiniz:
              </p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Tarayıcı ayarlarından çerez tercihlerini yönetebilirsiniz</li>
                <li>• Mevcut çerezleri silebilirsiniz</li>
                <li>• Gelecekteki çerezleri engelleyebilirsiniz</li>
                <li>• Çerez bildirimleri alabilirsiniz</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Önemli Not</h3>
              <p className="text-yellow-700 text-sm">
                Zorunlu çerezleri devre dışı bırakmanız durumunda, sitemizin bazı özellikleri 
                düzgün çalışmayabilir. Alışveriş sepeti, giriş işlemleri ve güvenlik özellikleri 
                etkilenebilir.
              </p>
            </div>
          </div>
        </div>

        {/* Browser Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tarayıcı Ayarları</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Chrome</h3>
              <ol className="text-gray-600 text-sm space-y-1">
                <li>1. Ayarlar menüsünü açın</li>
                <li>2. "Gizlilik ve güvenlik" bölümüne gidin</li>
                <li>3. "Çerezler ve diğer site verileri" seçin</li>
                <li>4. Tercihlerinizi ayarlayın</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Firefox</h3>
              <ol className="text-gray-600 text-sm space-y-1">
                <li>1. Seçenekler menüsünü açın</li>
                <li>2. "Gizlilik ve Güvenlik" sekmesine gidin</li>
                <li>3. "Çerezler ve Site Verileri" bölümünü bulun</li>
                <li>4. Ayarlarınızı düzenleyin</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Safari</h3>
              <ol className="text-gray-600 text-sm space-y-1">
                <li>1. Safari menüsünden Tercihler'i seçin</li>
                <li>2. "Gizlilik" sekmesine tıklayın</li>
                <li>3. Çerez ayarlarını yapın</li>
                <li>4. Değişiklikleri kaydedin</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Edge</h3>
              <ol className="text-gray-600 text-sm space-y-1">
                <li>1. Ayarlar menüsünü açın</li>
                <li>2. "Çerezler ve site izinleri" seçin</li>
                <li>3. "Çerezler ve site verileri" tıklayın</li>
                <li>4. Tercihlerinizi belirleyin</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>
          <p className="text-gray-600 mb-4">
            Çerez politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
          </p>
          
          <div className="space-y-2 text-gray-600">
            <p><strong>E-posta:</strong> privacy@sepetza.com</p>
            <p><strong>Telefon:</strong> 0850 123 45 67</p>
            <p><strong>Adres:</strong> Maslak Mahallesi, Büyükdere Caddesi No: 123, Sarıyer/İstanbul</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 