import React from 'react';
import { Shield, Eye, Lock, Users } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-xl text-blue-100">
            Kişisel verilerinizin korunması bizim için önceliklidir.
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

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giriş</h2>
          <p className="text-gray-600 leading-relaxed">
            Sepetza olarak, kişisel verilerinizin korunması konusunda hassasiyetle hareket etmekteyiz. 
            Bu Gizlilik Politikası, platformumuzda sunduğumuz hizmetler kapsamında toplanan kişisel 
            verilerinizin nasıl işlendiği, korunduğu ve kullanıldığı hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
          </p>
        </div>

        {/* Data Collection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Toplanan Veriler</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Kimlik Bilgileri</h3>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Ad, soyad</li>
                <li>• E-posta adresi</li>
                <li>• Telefon numarası</li>
                <li>• Doğum tarihi</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">İletişim Bilgileri</h3>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Teslimat adresi</li>
                <li>• Faturalama adresi</li>
                <li>• Şehir, ilçe, posta kodu</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">İşlem Bilgileri</h3>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Sipariş geçmişi</li>
                <li>• Ödeme bilgileri (şifrelenmiş)</li>
                <li>• Sepet içeriği</li>
                <li>• Site kullanım verileri</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Usage */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Eye className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Verilerin Kullanım Amacı</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Temel Hizmetler</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Sipariş işlemlerinin gerçekleştirilmesi</li>
                <li>• Ürün teslimatının yapılması</li>
                <li>• Müşteri hizmetleri desteği</li>
                <li>• Fatura ve belge düzenleme</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">İyileştirme ve Pazarlama</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Kişiselleştirilmiş ürün önerileri</li>
                <li>• Kampanya ve promosyon bildirimleri</li>
                <li>• Site deneyiminin iyileştirilmesi</li>
                <li>• Müşteri memnuniyeti araştırmaları</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Veri Güvenliği</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Teknik Güvenlik Önlemleri</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• SSL şifreleme ile veri iletimi</li>
                <li>• Güvenli sunucu altyapısı</li>
                <li>• Düzenli güvenlik güncellemeleri</li>
                <li>• Erişim kontrolü ve yetkilendirme</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">İdari Güvenlik Önlemleri</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Personel eğitimi ve bilinçlendirme</li>
                <li>• Gizlilik sözleşmeleri</li>
                <li>• Düzenli güvenlik denetimleri</li>
                <li>• Veri minimizasyonu prensibi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Rights */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Lock className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Hakları</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Temel Haklar</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Kişisel verilerinize erişim hakkı</li>
                <li>• Verilerin düzeltilmesini isteme hakkı</li>
                <li>• Verilerin silinmesini isteme hakkı</li>
                <li>• Veri işlemeye itiraz etme hakkı</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Başvuru Yolları</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• E-posta: privacy@sepetza.com</li>
                <li>• Telefon: 0850 123 45 67</li>
                <li>• Hesap ayarlarından yönetim</li>
                <li>• Yazılı başvuru</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Çerezler (Cookies)</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Sitemizde kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanılmaktadır.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Zorunlu Çerezler</h3>
                <p className="text-gray-600 text-sm">
                  Sitenin temel işlevleri için gerekli çerezler
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Analitik Çerezler</h3>
                <p className="text-gray-600 text-sm">
                  Site kullanımını analiz eden çerezler
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Pazarlama Çerezleri</h3>
                <p className="text-gray-600 text-sm">
                  Kişiselleştirilmiş reklam çerezleri
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>
          <p className="text-gray-600 mb-4">
            Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
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